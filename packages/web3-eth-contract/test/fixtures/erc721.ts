import { Address, Numbers } from 'web3-utils';
import { LogsSubscription } from '../../src/log_subscription';
import { ContractEventOptions, NonPayableMethodObject, PayableMethodObject } from '../../src/types';

export interface Erc721Interface {
	methods: {
		[key: string]: (
			...args: ReadonlyArray<any>
		) =>
			| PayableMethodObject<ReadonlyArray<unknown>, ReadonlyArray<unknown>>
			| NonPayableMethodObject<ReadonlyArray<unknown>, ReadonlyArray<unknown>>;
		getApproved: (_tokenId: Numbers) => NonPayableMethodObject<[_tokenId: Numbers], [Address]>;
		approve: (
			_approved: Address,
			_tokenId: Numbers,
		) => PayableMethodObject<[_approved: Address, _tokenId: Numbers], []>;
		transferFrom: (
			_from: Address,
			_to: Address,
			_tokenId: Numbers,
		) => PayableMethodObject<[_from: Address, _to: Address, _tokenId: Numbers], []>;
		safeTransferFrom: (
			_from: Address,
			_to: Address,
			_tokenId: Numbers,
		) => PayableMethodObject<[_from: Address, _to: Address, _tokenId: Numbers], []>;
		ownerOf: (_tokenId: Numbers) => NonPayableMethodObject<[_tokenId: Numbers], [Address]>;
		balanceOf: (_owner: Address) => NonPayableMethodObject<[_owner: Address], [Numbers]>;
		setApprovalForAll: (
			_operator: Address,
			_approved: boolean,
		) => NonPayableMethodObject<[_operator: Address, _approved: boolean], []>;

		isApprovedForAll: (
			_owner: Address,
			_operator: Address,
		) => NonPayableMethodObject<[_owner: Address, _operator: Address], [boolean]>;
	};

	events: {
		[key: string]: (options?: ContractEventOptions) => Promise<LogsSubscription>;
		Transfer: (options?: ContractEventOptions) => Promise<LogsSubscription>;
		Approval: (options?: ContractEventOptions) => Promise<LogsSubscription>;
		ApprovalForAll: (options?: ContractEventOptions) => Promise<LogsSubscription>;
	};
}

// https://eips.ethereum.org/EIPS/eip-721
// Copied interface from above link to Remix and compile
export const erc721Abi = [
	{
		constant: true,
		inputs: [
			{
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'getApproved',
		outputs: [
			{
				name: '',
				type: 'address',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_approved',
				type: 'address',
			},
			{
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'ownerOf',
		outputs: [
			{
				name: '',
				type: 'address',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_operator',
				type: 'address',
			},
			{
				name: '_approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},

	// TODO: Need to check how to handle overloads in generics
	// This is overloaded method
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_tokenId',
				type: 'uint256',
			},
			{
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_operator',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_from',
				type: 'address',
			},
			{
				indexed: true,
				name: '_to',
				type: 'address',
			},
			{
				indexed: true,
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_owner',
				type: 'address',
			},
			{
				indexed: true,
				name: '_approved',
				type: 'address',
			},
			{
				indexed: true,
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_owner',
				type: 'address',
			},
			{
				indexed: true,
				name: '_operator',
				type: 'address',
			},
			{
				indexed: false,
				name: '_approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
] as const;
