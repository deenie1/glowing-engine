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
import WebSocketProvider from 'web3-providers-ws';
import { Web3BaseProvider } from 'web3-common';
import Web3Eth from '../../src/index';
import {
	NewHeadsSubscription,
	SyncingSubscription,
	NewPendingTransactionsSubscription,
	LogsSubscription,
} from '../../src/web3_subscriptions';
import {
	getSystemTestProvider,
	describeIf,
	getSystemTestAccounts,
} from '../fixtures/system_test_utils';

describeIf(getSystemTestProvider().startsWith('ws'))('subscribe', () => {
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider;
	let accounts: string[];

	beforeAll(async () => {
		accounts = await getSystemTestAccounts();
		provider = new WebSocketProvider(
			getSystemTestProvider(),
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
	});

	afterAll(() => {
		provider.disconnect();
	});

	afterEach(async () => {
		await web3Eth.clearSubscriptions();
	});

	describe('subscribe to', () => {
		it('newHeads', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('newHeads');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewHeadsSubscription);
		});
		it('syncing', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('syncing');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(SyncingSubscription);
		});
		it('newPendingTransactions', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('newPendingTransactions');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewPendingTransactionsSubscription);
		});
		it('logs', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('logs', {
				address: accounts[0],
			});
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(LogsSubscription);
		});
	});
});
