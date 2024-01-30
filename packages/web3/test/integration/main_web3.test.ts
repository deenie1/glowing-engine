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

import HttpProvider from 'web3-providers-http';
import WebsocketProvider from 'web3-providers-ws';
import IpcProvider from 'web3-providers-ipc';
import Contract from 'web3-eth-contract';
import { JsonRpcOptionalRequest, Web3BaseProvider } from 'web3-common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { SupportedProviders } from 'web3-core';
import { Web3EthExecutionAPI } from 'web3-eth/dist/web3_eth_execution_api';
import { Web3Account } from 'web3-eth-accounts';
import { BasicAbi } from '../shared_fixtures/Basic';
import { validEncodeParametersData } from '../shared_fixtures/data';
import {
	getSystemTestProvider,
	describeIf,
	itIf,
	getSystemTestAccounts,
	createNewAccount,
} from '../shared_fixtures/system_tests_utils';
import { Web3 } from '../../src/index';

const waitForOpenConnection = async (
	web3Inst: Web3,
	currentAttempt: number,
	status = 'connected',
) => {
	return new Promise<void>((resolve, reject) => {
		const maxNumberOfAttempts = 10;
		const intervalTime = 5000; // ms

		const interval = setInterval(() => {
			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval);
				reject(new Error('Maximum number of attempts exceeded'));
			} else if ((web3Inst.provider as unknown as Web3BaseProvider).getStatus() === status) {
				clearInterval(interval);
				resolve();
			}
			// eslint-disable-next-line no-plusplus, no-param-reassign
			currentAttempt++;
		}, intervalTime);
	});
};

describe('Web3 instance', () => {
	let clientUrl: string;
	let accounts: string[];
	let web3: Web3;
	let currentAttempt = 0;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
	});
	beforeEach(async () => {
		currentAttempt = 0;
	});
	afterEach(async () => {
		if (getSystemTestProvider().startsWith('ws')) {
			// make sure we try to close the connection after it is established
			if (
				web3?.provider &&
				(web3.provider as unknown as Web3BaseProvider).getStatus() === 'connecting'
			) {
				await waitForOpenConnection(web3, currentAttempt);
			}

			if (web3?.provider) {
				(web3.provider as unknown as Web3BaseProvider).disconnect(1000, '');
			}
		}
	});

	it('should be able to create web3 object without provider', () => {
		expect(() => new Web3()).not.toThrow();
	});

	it('should be able use "utils" without provider', () => {
		web3 = new Web3();

		expect(web3.utils.hexToNumber('0x5')).toBe(5);
	});

	it('should be able use "abi" without provider', () => {
		web3 = new Web3();
		const validData = validEncodeParametersData[0];

		const encodedParameters = web3.eth.abi.encodeParameters(
			validData.input[0],
			validData.input[1],
		);
		expect(encodedParameters).toEqual(validData.output);
	});

	it('should throw error when we make a request when provider not available', async () => {
		web3 = new Web3();

		await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
	});

	describeIf(getSystemTestProvider().startsWith('http'))(
		'Create Web3 class instance with http string providers',
		() => {
			it('should create instance with string provider', async () => {
				web3 = new Web3(clientUrl);
				expect(web3).toBeInstanceOf(Web3);
			});

			itIf(
				process.env.INFURA_GOERLI_HTTP
					? process.env.INFURA_GOERLI_HTTP.toString().includes('http')
					: false,
			)('should create instance with string of external http provider', async () => {
				web3 = new Web3(process.env.INFURA_GOERLI_HTTP);
				// eslint-disable-next-line jest/no-standalone-expect
				expect(web3).toBeInstanceOf(Web3);
			});

			// todo fix ipc test
			// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
			// https://github.com/ethereum/go-ethereum/issues/17907
			// itIf(clientUrl.includes('ipc'))(
			// 	'should create instance with string of IPC provider',
			// 	() => {
			// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// 		// eslint-disable-next-line no-new
			// 		const fullIpcPath = path.join(__dirname, ipcStringProvider);
			// 		const ipcProvider = new Web3.providers.IpcProvider(fullIpcPath);
			// 		web3 = new Web3(ipcProvider);
			// 		expect(web3).toBeInstanceOf(Web3);
			// 	},
			// );
		},
	);

	describeIf(getSystemTestProvider().startsWith('ws'))(
		'Create Web3 class instance with ws string providers',
		() => {
			it('should create instance with string of ws provider', async () => {
				web3 = new Web3(clientUrl);
				expect(web3).toBeInstanceOf(Web3);
			});

			itIf(
				process.env.INFURA_GOERLI_WS
					? process.env.INFURA_GOERLI_WS.toString().includes('ws')
					: false,
			)('should create instance with string of external ws provider', async () => {
				web3 = new Web3(process.env.INFURA_GOERLI_WS);
				// eslint-disable-next-line jest/no-standalone-expect
				expect(web3).toBeInstanceOf(Web3);
			});
		},
	);
	describe('Web3 providers', () => {
		it('should set the provider with `.provider=`', async () => {
			web3 = new Web3('http://dummy.com');

			web3.provider = clientUrl;

			expect(web3).toBeInstanceOf(Web3);

			const response = await web3.eth.getBalance(accounts[0]);

			expect(response).toEqual(expect.any(BigInt));
		});

		it('should set the provider with `.setProvider`', async () => {
			let newProvider: Web3BaseProvider;
			web3 = new Web3('http://dummy.com');
			if (clientUrl.startsWith('http')) {
				newProvider = new Web3.providers.HttpProvider(clientUrl);
			} else {
				newProvider = new Web3.providers.WebsocketProvider(clientUrl);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			web3.setProvider(newProvider as SupportedProviders<Web3EthExecutionAPI>);

			expect(web3.provider).toBe(newProvider);
		});

		it('should set the provider with `.setProvider` of empty initialized object', async () => {
			web3 = new Web3();

			web3.setProvider(getSystemTestProvider());

			await expect(web3.eth.getChainId()).resolves.toBeDefined();
		});

		it('should set the provider with `.provider=` of empty initialized object', async () => {
			web3 = new Web3();

			web3.provider = getSystemTestProvider();

			await expect(web3.eth.getChainId()).resolves.toBeDefined();
		});

		it('should unset the provider with `.setProvider`', async () => {
			web3 = new Web3(getSystemTestProvider());
			await expect(web3.eth.getChainId()).resolves.toBeDefined();

			web3.setProvider(undefined);
			await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
		});

		it('should unset the provider with `.provider=`', async () => {
			web3 = new Web3(getSystemTestProvider());
			await expect(web3.eth.getChainId()).resolves.toBeDefined();

			web3.provider = undefined;
			await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
		});

		it('providers', async () => {
			const res = Web3.providers;

			expect(Web3.providers.HttpProvider).toBe(HttpProvider);
			expect(res.WebsocketProvider).toBe(WebsocketProvider);
			expect(res.IpcProvider).toBe(IpcProvider);
		});

		it('currentProvider', async () => {
			web3 = new Web3(clientUrl);

			let checkWithClass;
			if (clientUrl.startsWith('ws')) {
				checkWithClass = Web3.providers.WebsocketProvider;
			} else if (clientUrl.startsWith('http')) {
				checkWithClass = Web3.providers.HttpProvider;
			} else {
				checkWithClass = Web3.providers.IpcProvider;
			}
			expect(web3.currentProvider).toBeInstanceOf(checkWithClass);
		});

		it('givenProvider', async () => {
			const { givenProvider } = web3;
			expect(givenProvider).toBeUndefined();
		});
	});

	describe('Module instantiations', () => {
		it('should create contract', () => {
			const basicContract = new web3.eth.Contract(BasicAbi);
			expect(basicContract).toBeInstanceOf(Contract);
		});
	});

	describe('Batch Request', () => {
		let request1: JsonRpcOptionalRequest;
		let request2: JsonRpcOptionalRequest;
		beforeEach(() => {
			request1 = {
				id: 10,
				method: 'eth_getBalance',
				params: [accounts[0], 'latest'],
			};
			request2 = {
				id: 11,
				method: 'eth_getBalance',
				params: [accounts[1], 'latest'],
			};
		});

		it('should execute batch requests', async () => {
			web3 = new Web3(clientUrl);

			const batch = new web3.BatchRequest();

			const request1Promise = batch.add(request1);
			const request2Promise = batch.add(request2);

			const executePromise = batch.execute();
			const response = await Promise.all([request1Promise, request2Promise, executePromise]);

			expect(response[0]).toEqual(expect.stringMatching(/0[xX][0-9a-fA-F]+/));
			expect(response[1]).toEqual(expect.stringMatching(/0[xX][0-9a-fA-F]+/));

			expect(response[2]).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: request1.id,
						result: response[0],
					}),
					expect.objectContaining({
						id: request2.id,
						result: response[1],
					}),
				]),
			);
		});
	});

	describe('Abi requests', () => {
		const validData = validEncodeParametersData[0];

		it('hash correctly', async () => {
			web3 = new Web3(clientUrl);

			const encodedParameters = web3.eth.abi.encodeParameters(
				validData.input[0],
				validData.input[1],
			);
			expect(encodedParameters).toEqual(validData.output);
		});
	});
	describe('Account module', () => {
		it('should create account', async () => {
			web3 = new Web3(clientUrl);
			const account: Web3Account = web3.eth.accounts.create();
			expect(account).toEqual(
				expect.objectContaining({
					address: expect.stringMatching(/0[xX][0-9a-fA-F]+/),
					privateKey: expect.stringMatching(/0[xX][0-9a-fA-F]+/),
				}),
			);
		});
		it('should create account from private key', async () => {
			web3 = new Web3(clientUrl);
			const acc = await createNewAccount();
			const createdAccount: Web3Account = web3.eth.accounts.privateKeyToAccount(
				acc.privateKey,
			);
			expect(acc.address.toLowerCase()).toBe(createdAccount.address.toLowerCase());
		});
	});
});

describe('Create Web3 class instance with external providers', () => {
	let provider: HDWalletProvider;
	let clientUrl: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const account = await createNewAccount();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider = new HDWalletProvider({
			privateKeys: [account.privateKey],
			providerOrUrl: clientUrl,
		});
	});
	afterAll(async () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider.engine.stop();
	});
	it('should create instance with external wallet provider', async () => {
		web3 = new Web3(provider);
		expect(web3).toBeInstanceOf(Web3);
	});
});
