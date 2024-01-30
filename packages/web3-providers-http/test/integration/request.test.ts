import {
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
} from 'web3-common';
import { toWei, hexToNumber } from 'web3-utils';
import HttpProvider from '../../src/index';
import { accounts, clientUrl } from '../fixtures/config';

describe('HttpProvider - implemented methods', () => {
	let httpProvider: HttpProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	beforeAll(() => {
		httpProvider = new HttpProvider(clientUrl);
		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: [accounts[0].address, 'latest'],
		} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
			expect(
				String(hexToNumber(String((response as JsonRpcResponseWithResult).result))),
			).toEqual(toWei(accounts[0].balance, 'ether'));
		});
	});
});
