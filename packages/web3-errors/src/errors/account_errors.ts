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

/* eslint-disable max-classes-per-file */

import {
	ERR_PRIVATE_KEY_LENGTH,
	ERR_INVALID_PRIVATE_KEY,
	ERR_INVALID_SIGNATURE,
	ERR_UNSUPPORTED_KDF,
	ERR_KEY_DERIVATION_FAIL,
	ERR_KEY_VERSION_UNSUPPORTED,
	ERR_INVALID_PASSWORD,
	ERR_IV_LENGTH,
	ERR_PBKDF2_ITERATIONS,
} from '../error_codes';
import { Web3Error } from '../web3_error_base';

export class PrivateKeyLengthError extends Web3Error {
	public code = ERR_PRIVATE_KEY_LENGTH;
	public constructor() {
		super(`Private key must be 32 bytes.`);
	}
}

export class InvalidPrivateKeyError extends Web3Error {
	public code = ERR_INVALID_PRIVATE_KEY;
	public constructor() {
		super(`Invalid Private Key, Not a valid string or buffer`);
	}
}

export class InvalidSignatureError extends Web3Error {
	public code = ERR_INVALID_SIGNATURE;
	public constructor(errorDetails: string) {
		super(`"${errorDetails}"`);
	}
}

export class InvalidKdfError extends Web3Error {
	public code = ERR_UNSUPPORTED_KDF;
	public constructor() {
		super(`Invalid key derivation function`);
	}
}

export class KeyDerivationError extends Web3Error {
	public code = ERR_KEY_DERIVATION_FAIL;
	public constructor() {
		super(`Key derivation failed - possibly wrong password`);
	}
}

export class KeyStoreVersionError extends Web3Error {
	public code = ERR_KEY_VERSION_UNSUPPORTED;
	public constructor() {
		super('Unsupported key store version');
	}
}

export class InvalidPasswordError extends Web3Error {
	public code = ERR_INVALID_PASSWORD;
	public constructor() {
		super('Password cannot be empty');
	}
}

export class IVLengthError extends Web3Error {
	public code = ERR_IV_LENGTH;
	public constructor() {
		super('Initialization vector must be 16 bytes');
	}
}

export class PBKDF2IterationsError extends Web3Error {
	public code = ERR_PBKDF2_ITERATIONS;
	public constructor() {
		super('c > 1000, pbkdf2 is less secure with less iterations');
	}
}
