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

import { Web3BaseProvider } from 'web3-common';
import { Contract } from '../../src';
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import { getSystemTestProvider, getSystemTestAccounts } from '../fixtures/system_test_utils';

describe('contract', () => {
	describe('defaults', () => {
		let contract: Contract<typeof GreeterAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let accounts: string[];

		beforeEach(async () => {
			contract = new Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			accounts = await getSystemTestAccounts();

			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: accounts[0], gas: '1000000' };
		});

		describe('defaultAccount', () => {
			it('should use "defaultAccount" on "Contract" level instead of "from"', async () => {
				// eslint-disable-next-line prefer-destructuring
				Contract.defaultAccount = accounts[0];

				const receiptHandler = jest.fn();

				// We didn't specify "from" in this call
				const tx = contract.deploy(deployOptions).send({ gas: '1000000' });

				tx.on('receipt', receiptHandler);

				await tx;

				// We didn't specify "from" in this call
				expect(receiptHandler).toHaveBeenCalledWith(
					expect.objectContaining({ from: accounts[0] }),
				);
			});

			it('should use "defaultAccount" on "instance" level instead of "from"', async () => {
				const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

				// eslint-disable-next-line prefer-destructuring
				deployedContract.defaultAccount = accounts[0];

				// We didn't specify "from" in this call
				const receipt = await deployedContract.methods
					.setGreeting('New Greeting')
					.send({ gas: '1000000' });

				expect(receipt.from).toEqual(accounts[0]);
			});

			it('should throw error when "from" is not set on any level', async () => {
				Contract.defaultAccount = undefined;
				contract.defaultAccount = undefined;

				expect(() => contract.deploy(deployOptions).send({ gas: '1000000' })).toThrow(
					'Contract "from" address not specified',
				);
			});
		});

		describe('defaultBlock', () => {
			it('should use "defaultBlock" on "Contract" level', async () => {
				contract = await contract.deploy(deployOptions).send(sendOptions);

				await contract.methods.setGreeting('New Greeting').send(sendOptions);

				const requestSpy = jest.spyOn(
					contract.currentProvider as Web3BaseProvider,
					'request',
				);
				Contract.defaultBlock = 'pending';

				// Forcefully delete this property from the contract instance
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				contract.defaultBlock = undefined;

				await contract.methods.greet().call();

				expect(requestSpy).toHaveBeenCalledWith(
					expect.objectContaining({ params: [expect.any(Object), 'pending'] }),
				);
			});

			it('should use "defaultBlock" on "instance" level', async () => {
				contract = await contract.deploy(deployOptions).send(sendOptions);

				await contract.methods.setGreeting('New Greeting').send(sendOptions);

				const requestSpy = jest.spyOn(
					contract.currentProvider as Web3BaseProvider,
					'request',
				);
				contract.defaultBlock = 'pending';
				Contract.defaultBlock = undefined;

				await contract.methods.greet().call();

				expect(requestSpy).toHaveBeenCalledWith(
					expect.objectContaining({ params: [expect.any(Object), 'pending'] }),
				);
			});

			it('should use "defaultBlock" on "call" level', async () => {
				contract = await contract.deploy(deployOptions).send(sendOptions);

				await contract.methods.setGreeting('New Greeting').send(sendOptions);

				const requestSpy = jest.spyOn(
					contract.currentProvider as Web3BaseProvider,
					'request',
				);

				// Forcefully delete this property from the contract instance
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				contract.defaultBlock = undefined;
				Contract.defaultBlock = undefined;

				await contract.methods.greet().call(undefined, 'pending');

				expect(requestSpy).toHaveBeenCalledWith(
					expect.objectContaining({ params: [expect.any(Object), 'pending'] }),
				);
			});
		});
	});
});
