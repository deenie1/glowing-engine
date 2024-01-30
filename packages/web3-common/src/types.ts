import { HexString } from 'web3-utils';

export type JsonRpcId = string | number | null;
export type JsonRpcResult = string | number | boolean | Record<string, unknown>;
export type JsonRpcIdentifier = string & ('2.0' | '1.0');

// Make each attribute mutable by removing `readonly`
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export interface JsonRpcError<T = JsonRpcResult> {
	readonly code: number;
	readonly message: string;
	readonly data?: T;
}

export interface JsonRpcResponseWithError<Error = JsonRpcResult> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error: JsonRpcError<Error>;
	readonly result?: never;
}

export interface JsonRpcResponseWithResult<T = JsonRpcResult> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error?: never;
	readonly result: T;
}

export interface SubscriptionParams<T = JsonRpcResult> {
	readonly subscription: string; // for subscription id
	readonly result: T;
}
export interface JsonRpcNotification<T = JsonRpcResult> {
	readonly id?: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly method: string; // for subscription
	readonly params: SubscriptionParams<T>; // for subscription results
}

export interface JsonRpcRequest<T = unknown[]> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly method: string;
	readonly params?: T;
}

export interface JsonRpcOptionalRequest<ParamType = unknown[]>
	extends Omit<JsonRpcRequest<ParamType>, 'id' | 'jsonrpc'> {
	readonly id?: JsonRpcId;
	readonly jsonrpc?: JsonRpcIdentifier;
}

export type JsonRpcBatchRequest = JsonRpcRequest[];

export type JsonRpcPayload<Param = unknown[]> = JsonRpcRequest<Param> | JsonRpcBatchRequest;

export type JsonRpcBatchResponse<Result = JsonRpcResult, Error = JsonRpcResult> =
	| (JsonRpcResponseWithError<Error> | JsonRpcResponseWithResult<Result>)[];

export type JsonRpcResponse<Result = JsonRpcResult, Error = JsonRpcResult> =
	| JsonRpcResponseWithError<Error>
	| JsonRpcResponseWithResult<Result>
	| JsonRpcBatchResponse<Result, Error>;

export interface Proof {
	readonly address: HexString;
	readonly nonce: string;
	readonly balance: string;
}

export interface TransactionInput {
	readonly [key: string]: unknown;
	readonly to?: HexString; // If its a contract creation tx then no address wil be specified.
	readonly from?: HexString;
	readonly data?: string;
	readonly input?: string;
	readonly gas: HexString;
	readonly gasLimit?: string;
	readonly gasPrice?: string;
	readonly maxPriorityFeePerGas?: string;
	readonly maxFeePerGas?: string;
	readonly nonce: string;
	readonly value: string;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly type?: HexString;
}

export type TransactionOutput = {
	readonly [key: string]: unknown;
	readonly to?: HexString; // If its a contract creation tx then no address wil be specified.
	readonly from?: HexString;
	readonly data: string;
	readonly gas?: bigint | number;
	readonly gasLimit?: string;
	readonly nonce: bigint | number;
	readonly value: bigint | number;
	readonly blockNumber?: bigint | number;
	readonly transactionIndex?: bigint | number;
} & (
	| { maxPriorityFeePerGas: bigint | number; maxFeePerGas: bigint | number; gasPrice?: never }
	| { maxPriorityFeePerGas?: never; maxFeePerGas?: never; gasPrice: bigint | number }
);

export interface LogsInput {
	readonly blockHash?: HexString;
	readonly transactionHash?: HexString;
	readonly logIndex?: HexString;
	readonly id?: string;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly address?: HexString;
}
export interface LogsOutput {
	readonly id?: string;
	readonly blockHash?: HexString;
	readonly transactionHash?: HexString;
	readonly logIndex?: bigint | number;
	readonly blockNumber?: bigint | number;
	readonly transactionIndex?: bigint | number;
	readonly address?: string;
}

export interface BlockInput {
	readonly gasLimit: HexString;
	readonly gasUsed: HexString;
	readonly size: HexString;
	readonly timestamp: HexString;
	readonly number?: HexString;
	readonly difficulty?: HexString;
	readonly totalDifficulty?: HexString;
	readonly transactions?: TransactionInput[];
	readonly miner?: HexString;
	readonly baseFeePerGas?: HexString;
}

export interface BlockOutput {
	readonly gasLimit: bigint | number;
	readonly gasUsed: bigint | number;
	readonly size: bigint | number;
	readonly timestamp: bigint | number;
	readonly number?: bigint | number;
	readonly difficulty?: bigint | number;
	readonly totalDifficulty?: bigint | number;
	readonly transactions?: TransactionOutput[];
	readonly miner?: HexString;
	readonly baseFeePerGas?: bigint | number;
}

export interface ReceiptInput {
	readonly [x: string]: unknown;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly cumulativeGasUsed: HexString;
	readonly gasUsed: HexString;
	readonly logs?: LogsInput[];
	readonly contractAddress?: HexString;
	readonly status?: string;
}

export interface ReceiptOutput {
	readonly blockNumber?: bigint | number;
	readonly transactionIndex?: bigint | number;
	readonly cumulativeGasUsed: bigint | number;
	readonly gasUsed: bigint | number;
	readonly logs?: LogsOutput[];
	readonly contractAddress?: HexString;
	readonly status: boolean;
}

export interface PostInput {
	readonly ttl?: HexString;
	readonly workToProve?: HexString;
	readonly priority?: HexString;
	readonly expiry?: HexString;
	readonly sent?: HexString;
	readonly workProved?: HexString;
	readonly topics?: HexString[];
}

export interface PostOutput {
	readonly ttl?: bigint | number;
	readonly workToProve?: bigint | number;
	readonly priority?: bigint | number;
	readonly expiry?: bigint | number;
	readonly sent?: bigint | number;
	readonly workProved?: bigint | number;
	readonly topics?: string[];
}

export interface SyncInput {
	readonly startingBlock: HexString;
	readonly currentBlock: HexString;
	readonly highestBlock: HexString;
	readonly knownStates?: HexString;
	readonly pulledStates?: HexString;
}

export interface SyncOutput {
	readonly startingBlock: bigint | number;
	readonly currentBlock: bigint | number;
	readonly highestBlock: bigint | number;
	readonly knownStates?: bigint | number;
	readonly pulledStates?: bigint | number;
}

export enum PredefinedBlockNumbers {
	LATEST = 'latest',
	PENDING = 'pending',
	EARLIEST = 'earliest',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Web3APISpec = Record<string, (...params: any) => any>;
export type Web3APIMethod<T extends Web3APISpec> = string & keyof T;
export type Web3APIParams<API extends Web3APISpec, Method extends Web3APIMethod<API>> = Parameters<
	API[Method]
>;

export interface Web3APIRequest<API extends Web3APISpec, Method extends Web3APIMethod<API>> {
	method: Method;
	params: Web3APIParams<API, Method> extends [] ? [] : Web3APIParams<API, Method>;
}

export interface Web3APIPayload<API extends Web3APISpec, Method extends Web3APIMethod<API>>
	extends Web3APIRequest<API, Method> {
	readonly jsonrpc?: JsonRpcIdentifier;
	readonly id?: JsonRpcId;
}

export type Web3APIReturnType<
	API extends Web3APISpec,
	Method extends Web3APIMethod<API>,
> = ReturnType<API[Method]>;

export type ConnectionEvent = {
	code: number;
	reason: string;
	wasClean?: boolean; // if WS connection was closed properly
};

export type Receipt = Record<string, unknown>;
