/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import {
	ConnectionEvent,
	EthExecutionAPI,
	JsonRpcBatchRequest,
	JsonRpcBatchResponse,
	JsonRpcId,
	JsonRpcNotification,
	JsonRpcRequest,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
	JsonRpcResult,
	SocketRequestItem,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3ProviderEventCallback,
	Web3ProviderStatus,
} from 'web3-types';
import {
	ConnectionError,
	ConnectionNotOpenError,
	InvalidClientError,
	PendingRequestsOnReconnectingError,
	RequestAlreadySentError,
	ResponseError,
	Web3WSProviderError,
} from 'web3-errors';
import { Eip1193Provider } from './web3_eip1193_provider';
import { ChunkResponseParser } from './chunk_response_parser';
import { isNullish } from './validation';
import { Web3DeferredPromise } from './web3_deferred_promise';
import * as jsonRpc from './json_rpc';

type ReconnectOptions = {
	autoReconnect: boolean;
	delay: number;
	maxAttempts: number;
};

type EventType = 'message' | 'connect' | 'disconnect' | 'chainChanged' | 'accountsChanged' | string;

export abstract class SocketProvider<
	MessageEvent,
	CloseEvent,
	ErrorEvent,
	API extends Web3APISpec = EthExecutionAPI,
> extends Eip1193Provider<API> {
	protected isReconnecting: boolean;
	protected readonly _socketPath: string;
	protected readonly chunkResponseParser: ChunkResponseParser;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	protected readonly _pendingRequestsQueue: Map<JsonRpcId, SocketRequestItem<any, any, any>>;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	protected readonly _sentRequestsQueue: Map<JsonRpcId, SocketRequestItem<any, any, any>>;
	protected _reconnectAttempts!: number;
	protected readonly _providerOptions?: object;
	protected readonly _reconnectOptions: ReconnectOptions;
	protected _socketConnection?: unknown;
	protected _connectionStatus: Web3ProviderStatus;
	protected readonly _onMessageHandler: (event: MessageEvent) => void;
	protected readonly _onOpenHandler: () => void;
	protected readonly _onCloseHandler: (event: CloseEvent) => void;
	protected readonly _onErrorHandler: (event: ErrorEvent) => void;

	public constructor(socketPath: string, options?: object, reconnectOptions?: object) {
		super();
		this._connectionStatus = 'connecting';
		this._onMessageHandler = this._onMessage.bind(this);
		this._onOpenHandler = this._onConnect.bind(this);
		this._onCloseHandler = this._onCloseEvent.bind(this);
		this._onErrorHandler = this._onError.bind(this);
		if (!this._validateProviderPath(socketPath)) throw new InvalidClientError(socketPath);

		this._socketPath = socketPath;
		this._providerOptions = options;

		const DEFAULT_PROVIDER_RECONNECTION_OPTIONS = {
			autoReconnect: true,
			delay: 5000,
			maxAttempts: 5,
		};

		this._reconnectOptions = {
			...DEFAULT_PROVIDER_RECONNECTION_OPTIONS,
			...(reconnectOptions ?? {}),
		};

		this._pendingRequestsQueue = new Map<JsonRpcId, SocketRequestItem<any, any, any>>();
		this._sentRequestsQueue = new Map<JsonRpcId, SocketRequestItem<any, any, any>>();

		this._init();
		this.connect();
		this.chunkResponseParser = new ChunkResponseParser();
		this.chunkResponseParser.onError(() => {
			this._clearQueues();
		});
		this.isReconnecting = false;
	}

	protected _init() {
		this._reconnectAttempts = 0;
	}

	public connect(): void {
		try {
			this._openSocketConnection();
			this._connectionStatus = 'connecting';
			this._addSocketListeners();
		} catch (e) {
			if (!this.isReconnecting) {
				this._connectionStatus = 'disconnected';
				if (e && (e as Error).message) {
					throw new ConnectionError(
						`Error while connecting to ${this._socketPath}. Reason: ${
							(e as Error).message
						}`,
					);
				} else {
					throw new InvalidClientError(this._socketPath);
				}
			} else {
				setImmediate(() => {
					this._reconnect();
				});
			}
		}
	}

	protected abstract _openSocketConnection(): void;
	protected abstract _addSocketListeners(): void;

	protected abstract _removeSocketListeners(): void;

	protected abstract _onCloseEvent(_event: unknown): void;

	protected abstract _sendToSocket(_payload: Web3APIPayload<API, any>): void;

	protected abstract _parseResponses(_event: MessageEvent): JsonRpcResponse[];

	protected abstract _closeSocketConnection(_code?: number, _data?: string): void;

	// eslint-disable-next-line class-methods-use-this
	protected _validateProviderPath(path: string): boolean {
		return !!path;
	}

	// eslint-disable-next-line class-methods-use-this
	public supportsSubscriptions(): boolean {
		return true;
	}

	public on<T = JsonRpcResult>(type: EventType, callback: Web3ProviderEventCallback<T>): void {
		this._eventEmitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: EventType, callback: Web3ProviderEventCallback<T>): void {
		this._eventEmitter.once(type, callback);
	}

	public removeListener(type: EventType, callback: Web3ProviderEventCallback): void {
		this._eventEmitter.removeListener(type, callback);
	}

	protected _onDisconnect(code?: number, data?: string) {
		this._connectionStatus = 'disconnected';
		super._onDisconnect(code, data);
	}

	public disconnect(code?: number, data?: string): void {
		this._removeSocketListeners();
		if (this.getStatus() !== 'disconnected') {
			this._closeSocketConnection(code, data);
		}
		this._onDisconnect(code, data);
	}

	public removeAllListeners(type: string): void {
		this._eventEmitter.removeAllListeners(type);
	}

	protected _onError(event: ErrorEvent): void {
		// do not emit error while trying to reconnect
		if (this.isReconnecting) {
			this._reconnect();
		} else {
			this._eventEmitter.emit('error', event);
		}
	}

	public reset(): void {
		this._sentRequestsQueue.clear();
		this._pendingRequestsQueue.clear();

		this._init();
		this._removeSocketListeners();
		this._addSocketListeners();
	}

	protected _reconnect(): void {
		if (this.isReconnecting) {
			return;
		}

		this.isReconnecting = true;

		if (this._sentRequestsQueue.size > 0) {
			this._sentRequestsQueue.forEach(
				(request: SocketRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new PendingRequestsOnReconnectingError());
					this._sentRequestsQueue.delete(key);
				},
			);
		}

		if (this._reconnectAttempts < this._reconnectOptions.maxAttempts) {
			this._reconnectAttempts += 1;
			setTimeout(() => {
				this._removeSocketListeners();
				this.connect();
				this.isReconnecting = false;
			}, this._reconnectOptions.delay);
		} else {
			this.isReconnecting = false;
			this._clearQueues();
			this._removeSocketListeners();
			const errorMsg = `Max connection attempts exceeded (${this._reconnectOptions.maxAttempts})`;
			this._eventEmitter.emit('error', errorMsg);
		}
	}

	public async request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(request: Web3APIPayload<API, Method>): Promise<JsonRpcResponseWithResult<ResultType>> {
		if (isNullish(this._socketConnection)) {
			throw new Error('Connection is undefined');
		}
		// if socket disconnected - open connection
		if (this.getStatus() === 'disconnected') {
			this.connect();
		}

		const requestId = jsonRpc.isBatchRequest(request)
			? (request as unknown as JsonRpcBatchRequest)[0].id
			: (request as unknown as JsonRpcRequest).id;

		if (!requestId) {
			throw new Web3WSProviderError('Request Id not defined');
		}

		if (this._sentRequestsQueue.has(requestId)) {
			throw new RequestAlreadySentError(requestId);
		}

		const deferredPromise = new Web3DeferredPromise<JsonRpcResponseWithResult<ResultType>>();

		const reqItem: SocketRequestItem<API, Method, JsonRpcResponseWithResult<ResultType>> = {
			payload: request,
			deferredPromise,
		};

		if (this.getStatus() === 'connecting') {
			this._pendingRequestsQueue.set(requestId, reqItem);

			return reqItem.deferredPromise;
		}

		this._sentRequestsQueue.set(requestId, reqItem);

		try {
			this._sendToSocket(reqItem.payload);
		} catch (error) {
			this._sentRequestsQueue.delete(requestId);
			throw error;
		}

		return deferredPromise;
	}

	protected _onConnect() {
		this._connectionStatus = 'connected';
		this._reconnectAttempts = 0;
		super._onConnect();
		this._sendPendingRequests();
	}

	private _sendPendingRequests() {
		for (const [id, value] of this._pendingRequestsQueue.entries()) {
			this._sendToSocket(value.payload as Web3APIPayload<API, any>);
			this._pendingRequestsQueue.delete(id);
			this._sentRequestsQueue.set(id, value);
		}
	}

	protected _onMessage(event: MessageEvent): void {
		const responses = this._parseResponses(event);
		if (!responses) {
			return;
		}
		for (const response of responses) {
			if (
				jsonRpc.isResponseWithNotification(response as JsonRpcNotification) &&
				(response as JsonRpcNotification).method.endsWith('_subscription')
			) {
				this._eventEmitter.emit('message', undefined, response);
				return;
			}

			const requestId = jsonRpc.isBatchResponse(response)
				? (response as unknown as JsonRpcBatchResponse)[0].id
				: (response as unknown as JsonRpcResponseWithResult).id;

			const requestItem = this._sentRequestsQueue.get(requestId);

			if (!requestItem) {
				return;
			}

			if (jsonRpc.isBatchResponse(response) || jsonRpc.isResponseWithResult(response)) {
				this._eventEmitter.emit('message', undefined, response);
				requestItem.deferredPromise.resolve(response);
			} else {
				this._eventEmitter.emit('message', response, undefined);
				requestItem?.deferredPromise.reject(new ResponseError(response));
			}

			this._sentRequestsQueue.delete(requestId);
		}
	}

	protected _clearQueues(event?: ConnectionEvent) {
		if (this._pendingRequestsQueue.size > 0) {
			this._pendingRequestsQueue.forEach(
				(request: SocketRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._pendingRequestsQueue.delete(key);
				},
			);
		}

		if (this._sentRequestsQueue.size > 0) {
			this._sentRequestsQueue.forEach(
				(request: SocketRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._sentRequestsQueue.delete(key);
				},
			);
		}

		this._removeSocketListeners();
	}
}
