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
import { Bytes } from 'web3-utils';

import { Transaction } from '../../../../src/types';

export const mockRpcResponse: Transaction = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: '0x174876e800',
	gas: '0x5208',
	gasPrice: '0x4a817c800',
	type: '0x0',
	maxFeePerGas: '0x1229298c00',
	maxPriorityFeePerGas: '0x49504f80',
	data: '0x',
	nonce: '0x4',
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: '0x1',
	gasLimit: '0x5208',
	v: '0x25',
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transactionHash
 */
type TestData = [string, [Bytes]];
export const testData: TestData[] = [
	// transactionHash = Bytes
	[
		'transactionHash = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8'],
	],
	[
		'transactionHash = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex")',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex')],
	],
	[
		'transactionHash = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8")',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
		],
	],
];
