/* eslint-disable max-classes-per-file */

import {
	ERR_RESPONSE,
	ERR_PARAM,
	ERR_METHOD_NOT_IMPLEMENTED,
	ERR_CONN,
	ERR_CONN_INVALID,
	ERR_CONN_TIMEOUT,
	ERR_CONN_NOT_OPEN,
	ERR_CONN_CLOSE,
	ERR_CONN_MAX_ATTEMPTS,
	ERR_CONN_PENDING_REQUESTS,
	ERR_INVALID_PROVIDER,
	ERR_INVALID_RESPONSE,
	ERR_TX_REVERT_INSTRUCTION,
	ERR_TX_REVERT_TRANSACTION,
	ERR_TX,
	ERR_TX_NO_CONTRACT_ADDRESS,
	ERR_TX_CONTRACT_NOT_STORED,
	ERR_TX_REVERT_WITHOUT_REASON,
	ERR_TX_OUT_OF_GAS,
	ERR_CONTRACT_RESOLVER_MISSING,
	ERR_CONTRACT_ABI_MISSING,
	ERR_CONTRACT_REQUIRED_CALLBACK,
	ERR_CONTRACT_EVENT_NOT_EXISTS,
	ERR_CONTRACT_RESERVED_EVENT,
	ERR_CONTRACT_MISSING_DEPLOY_DATA,
	ERR_CONTRACT_MISSING_ADDRESS,
	ERR_CONTRACT_MISSING_FROM_ADDRESS,
	ERR_FORMATTERS,
	ERR_INVALID_CLIENT,
	ERR_PROVIDER,
	ERR_SUBSCRIPTION,
	ERR_OPERATION_TIMEOUT,
	ERR_OPERATION_ABORT,
	ERR_ABI_ENCODING,
	ERR_INVALID_PRIVATE_KEY,
	ERR_PRIVATE_KEY_LENGTH,
} from './constants';
import { isResponseWithError } from './json_rpc';

import { ConnectionEvent, JsonRpcResponse, Receipt } from './types';

export abstract class Web3Error extends Error {
	public readonly name: string;
	public abstract readonly code: number;

	public constructor(msg: string) {
		super(msg);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, Web3Error);
	}

	public toJSON() {
		return { name: this.name, code: this.code, message: this.message };
	}
}

export class InvalidNumberOfParamsError extends Web3Error {
	public code = ERR_PARAM;

	public constructor(public got: number, public expected: number, public method: string) {
		super(`Invalid number of parameters for "${method}". Got "${got}" expected "${expected}"!`);
	}

	public toJSON() {
		return {
			...super.toJSON(),
			got: this.got,
			expected: this.expected,
			method: this.method,
		};
	}
}

export class ConnectionError extends Web3Error {
	public code = ERR_CONN;
	public errorCode?: number;
	public errorReason?: string;

	public constructor(message: string, event?: ConnectionEvent) {
		super(message);

		if (event) {
			this.errorCode = event.code;
			this.errorReason = event.reason;
		}
	}

	public toJSON() {
		return { ...super.toJSON(), errorCode: this.errorCode, errorReason: this.errorReason };
	}
}

export class InvalidConnectionError extends ConnectionError {
	public constructor(public host: string, event?: ConnectionEvent) {
		super(`CONNECTION ERROR: Couldn't connect to node ${host}.`, event);
		this.code = ERR_CONN_INVALID;
	}

	public toJSON() {
		return { ...super.toJSON(), host: this.host };
	}
}

export class ConnectionTimeoutError extends ConnectionError {
	public constructor(public duration: number) {
		super(`CONNECTION TIMEOUT: timeout of ${duration}ms achieved`);
		this.code = ERR_CONN_TIMEOUT;
	}

	public toJSON() {
		return { ...super.toJSON(), duration: this.duration };
	}
}

export class ConnectionNotOpenError extends ConnectionError {
	public constructor(event?: ConnectionEvent) {
		super('Connection not open', event);
		this.code = ERR_CONN_NOT_OPEN;
	}
}

export class ConnectionCloseError extends ConnectionError {
	public constructor(event?: ConnectionEvent) {
		super(
			`CONNECTION ERROR: The connection got closed with the close code ${
				event?.code ?? ''
			} and the following reason string ${event?.reason ?? ''}`,
			event,
		);
		this.code = ERR_CONN_CLOSE;
	}
}

export class MaxAttemptsReachedOnReconnectingError extends ConnectionError {
	public constructor() {
		super('Maximum number of reconnect attempts reached!');
		this.code = ERR_CONN_MAX_ATTEMPTS;
	}
}

export class PendingRequestsOnReconnectingError extends ConnectionError {
	public constructor() {
		super('CONNECTION ERROR: Provider started to reconnect before the response got received!');
		this.code = ERR_CONN_PENDING_REQUESTS;
	}
}

export class ProviderError extends Web3Error {
	public code = ERR_PROVIDER;
}

export class InvalidProviderError extends Web3Error {
	public code = ERR_INVALID_PROVIDER;

	public constructor(public clientUrl: string) {
		super(`Provider with url "${clientUrl}" is not set or invalid`);
	}
}

export class SubscriptionError extends Web3Error {
	public code = ERR_SUBSCRIPTION;
}

const buildErrorMessage = (response: JsonRpcResponse<unknown, unknown>): string =>
	isResponseWithError(response) ? response.error.message : '';

export class ResponseError<ErrorType = unknown> extends Web3Error {
	public code = ERR_RESPONSE;
	public data?: ErrorType | ErrorType[];

	public constructor(response: JsonRpcResponse<unknown, ErrorType>, message?: string) {
		super(
			message ??
				`Returned error: ${
					Array.isArray(response)
						? response.map(r => buildErrorMessage(r)).join(',')
						: buildErrorMessage(response)
				}`,
		);

		if (!message) {
			this.data = Array.isArray(response)
				? response.map(r => r.error?.data as ErrorType)
				: response?.error?.data;
		}
	}

	public toJSON() {
		return { ...super.toJSON(), data: this.data };
	}
}

export class InvalidResponseError<ErrorType = unknown> extends ResponseError<ErrorType> {
	public constructor(result: JsonRpcResponse<unknown, ErrorType>) {
		super(result);
		if (!this.message || this.message === '') {
			this.message = `Invalid JSON RPC response: ${JSON.stringify(result)}`;
		}
		this.code = ERR_INVALID_RESPONSE;
	}
}

export class TransactionError extends Web3Error {
	public code = ERR_TX;

	public constructor(message: string, public receipt: Receipt) {
		super(message);
	}

	public toJSON() {
		return { ...super.toJSON(), receipt: this.receipt };
	}
}

export class RevertInstructionError extends Web3Error {
	public code = ERR_TX_REVERT_INSTRUCTION;

	public constructor(public reason: string, public signature: string) {
		super(`Your request got reverted with the following reason string: ${reason}`);
	}

	public toJSON() {
		return { ...super.toJSON(), reason: this.reason, signature: this.signature };
	}
}

export class TransactionRevertError extends Web3Error {
	public code = ERR_TX_REVERT_TRANSACTION;

	public constructor(public reason: string, public signature: string, public receipt: Receipt) {
		super(`Transaction has been reverted by the EVM:\n ${JSON.stringify(receipt, null, 2)}`);
	}

	public toJSON() {
		return {
			...super.toJSON(),
			reason: this.reason,
			signature: this.signature,
			receipt: this.receipt,
		};
	}
}

export class NoContractAddressFoundError extends TransactionError {
	public constructor(receipt: Receipt) {
		super("The transaction receipt didn't contain a contract address.", receipt);
		this.code = ERR_TX_NO_CONTRACT_ADDRESS;
	}

	public toJSON() {
		return { ...super.toJSON(), receipt: this.receipt };
	}
}

export class ContractCodeNotStoredError extends TransactionError {
	public constructor(receipt: Receipt) {
		super("The contract code couldn't be stored, please check your gas limit.", receipt);
		this.code = ERR_TX_CONTRACT_NOT_STORED;
	}
}

export class TransactionRevertedWithoutReasonError extends TransactionError {
	public constructor(receipt: Receipt) {
		super(
			`Transaction has been reverted by the EVM:\n ${JSON.stringify(receipt, null, 2)}`,
			receipt,
		);
		this.code = ERR_TX_REVERT_WITHOUT_REASON;
	}
}

export class TransactionOutOfGasError extends TransactionError {
	public constructor(receipt: Receipt) {
		super(
			`Transaction ran out of gas. Please provide more gas:\n ${JSON.stringify(
				receipt,
				null,
				2,
			)}`,
			receipt,
		);
		this.code = ERR_TX_OUT_OF_GAS;
	}
}

export class ResolverMethodMissingError extends Web3Error {
	public code = ERR_CONTRACT_RESOLVER_MISSING;

	public constructor(public address: string, public name: string) {
		super(`The resolver at ${address} does not implement requested method: "${name}".`);
	}

	public toJSON() {
		return { ...super.toJSON(), address: this.address, name: this.name };
	}
}

export class ContractMissingABIError extends Web3Error {
	public code = ERR_CONTRACT_ABI_MISSING;

	public constructor() {
		super(
			'You must provide the json interface of the contract when instantiating a contract object.',
		);
	}
}

export class ContractOnceRequiresCallbackError extends Web3Error {
	public code = ERR_CONTRACT_REQUIRED_CALLBACK;

	public constructor() {
		super('Once requires a callback as the second parameter.');
	}
}

export class ContractEventDoesNotExistError extends Web3Error {
	public code = ERR_CONTRACT_EVENT_NOT_EXISTS;

	public constructor(public eventName: string) {
		super(`Event "${eventName}" doesn't exist in this contract.`);
	}

	public toJSON() {
		return { ...super.toJSON(), eventName: this.eventName };
	}
}

export class ContractReservedEventError extends Web3Error {
	public code = ERR_CONTRACT_RESERVED_EVENT;

	public constructor(public type: string) {
		super(`Event "${type}" doesn't exist in this contract.`);
	}

	public toJSON() {
		return { ...super.toJSON(), type: this.type };
	}
}

export class ContractMissingDeployDataError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_DEPLOY_DATA;

	public constructor() {
		super(`No "data" specified in neither the given options, nor the default options.`);
	}
}

export class ContractNoAddressDefinedError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_ADDRESS;

	public constructor() {
		super("This contract object doesn't have address set yet, please set an address first.");
	}
}

export class ContractNoFromAddressDefinedError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_FROM_ADDRESS;

	public constructor() {
		super('No "from" address specified in neither the given options, nor the default options.');
	}
}

export class FormatterError extends Web3Error {
	public code = ERR_FORMATTERS;
}

export class MethodNotImplementedError extends Web3Error {
	public code = ERR_METHOD_NOT_IMPLEMENTED;

	public constructor() {
		super("The method you're trying to call is not implemented.");
	}
}

export class InvalidClientError extends Web3Error {
	public code = ERR_INVALID_CLIENT;

	public constructor(clientUrl: string) {
		super(`Client URL "${clientUrl}" is invalid.`);
	}
}

export class OperationTimeoutError extends Web3Error {
	public code = ERR_OPERATION_TIMEOUT;
}

export class OperationAbortError extends Web3Error {
	public code = ERR_OPERATION_ABORT;
}

export class AbiError extends Web3Error {
	public code = ERR_ABI_ENCODING;
}

export class PrivateKeyLengthError extends Web3Error {
	public code = ERR_PRIVATE_KEY_LENGTH;
	public constructor(value: string | Buffer) {
		super(`Invalid value given "${value.toString()}". Error: Private key must be 32 bytes.`);
	}
}

export class InvalidPrivateKeyError extends Web3Error {
	public code = ERR_INVALID_PRIVATE_KEY;
	public constructor(value: string | Buffer) {
		super(`Invalid value given "${String(value)}". Error: not a valid string or buffer.`);
	}
}
