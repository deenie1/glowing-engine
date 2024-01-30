import * as utils from 'web3-utils';
import * as eth from 'web3-eth';
import { validator } from 'web3-validator';
import { EthPersonal } from '../../src/index';

jest.mock('web3-utils');
jest.mock('web3-eth');

describe('EthPersonal', () => {
	let ethPersonal: EthPersonal;
	let sendSpy: jest.SpyInstance;
	let validateSpy: jest.SpyInstance;

	beforeEach(() => {
		ethPersonal = new EthPersonal('http://localhost:8545');

		sendSpy = jest.spyOn(ethPersonal.requestManager, 'send').mockImplementation(async () => {
			return Promise.resolve('0x0');
		});

		validateSpy = jest.spyOn(validator, 'validate').mockReturnValue(undefined);

		jest.resetAllMocks();
	});

	describe('getAccounts', () => {
		it('should call the correct method for request manager', async () => {
			sendSpy.mockResolvedValue(['0x528ABBBa47c33600245066398072799A9b7e2d9E']);

			await ethPersonal.getAccounts();

			expect(sendSpy).toHaveBeenCalledWith({ method: 'personal_listAccounts', params: [] });
		});

		it('should format return with toChecksumAddress', async () => {
			const result = ['0x528ABBBa47c33600245066398072799A9b7e2d9E'];
			sendSpy.mockResolvedValue(result);

			await ethPersonal.getAccounts();

			expect(utils.toChecksumAddress).toHaveBeenCalledTimes(1);
			expect(utils.toChecksumAddress).toHaveBeenCalledWith(result[0], 0, result);
		});
	});

	describe('newAccount', () => {
		it('should call the correct method for request manager', async () => {
			await ethPersonal.newAccount('password');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_newAccount',
				params: ['password'],
			});
		});

		it('should validate user input', async () => {
			await ethPersonal.newAccount('password');

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(['string'], ['password']);
		});

		it('should format return with toChecksumAddress', async () => {
			const result = '0x528ABBBa47c33600245066398072799A9b7e2d9E';
			sendSpy.mockResolvedValue(result);

			await ethPersonal.newAccount('password');

			expect(utils.toChecksumAddress).toHaveBeenCalledTimes(1);
			expect(utils.toChecksumAddress).toHaveBeenCalledWith(result);
		});
	});

	describe('unlockAccount', () => {
		it('should call the correct method for request manager', async () => {
			await ethPersonal.unlockAccount(
				'0x528ABBBa47c33600245066398072799A9b7e2d9E',
				'password',
				30,
			);

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_unlockAccount',
				params: ['0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password', 30],
			});
		});

		it('should validate user input', async () => {
			await ethPersonal.unlockAccount(
				'0x528ABBBa47c33600245066398072799A9b7e2d9E',
				'password',
				30,
			);

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(
				['address', 'string', 'uint'],
				['0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password', 30],
			);
		});
	});

	describe('lockAccount', () => {
		it('should call the correct method for request manager', async () => {
			await ethPersonal.lockAccount('0x528ABBBa47c33600245066398072799A9b7e2d9E');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_lockAccount',
				params: ['0x528ABBBa47c33600245066398072799A9b7e2d9E'],
			});
		});

		it('should validate user input', async () => {
			await ethPersonal.lockAccount('0x528ABBBa47c33600245066398072799A9b7e2d9E');

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(
				['address'],
				['0x528ABBBa47c33600245066398072799A9b7e2d9E'],
			);
		});
	});

	describe('importRawKey', () => {
		it('should call the correct method for request manager', async () => {
			await ethPersonal.importRawKey(
				'0x528ABBBa47c33600245066398072799A9b7e2d9E',
				'password',
			);

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_importRawKey',
				params: ['0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password'],
			});
		});

		it('should validate user input', async () => {
			await ethPersonal.importRawKey(
				'0x528ABBBa47c33600245066398072799A9b7e2d9E',
				'password',
			);

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(
				['bytes', 'string'],
				['0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password'],
			);
		});
	});

	describe('sendTransaction', () => {
		it('should call the correct method for request manager', async () => {
			const tx = {
				from: '0x528ABBBa47c33600245066398072799A9b7e2d9E',
				to: '0x9988BBBa47c33600245066398072799A9b7e2d9E',
			};
			jest.spyOn(eth, 'formatTransaction').mockReturnValue(tx);

			await ethPersonal.sendTransaction(tx, 'password');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_sendTransaction',
				params: [tx, 'password'],
			});
		});

		it('should format user input', async () => {
			const tx = {
				from: '0x528ABBBa47c33600245066398072799A9b7e2d9E',
				to: '0x9988BBBa47c33600245066398072799A9b7e2d9E',
			};
			jest.spyOn(eth, 'formatTransaction').mockReturnValue(tx);

			await ethPersonal.sendTransaction(tx, 'password');

			expect(eth.formatTransaction).toHaveBeenCalledTimes(1);
			expect(eth.formatTransaction).toHaveBeenCalledWith(tx, {
				bytes: 'BYTES_HEX',
				number: 'NUMBER_HEX',
			});
		});
	});

	describe('signTransaction', () => {
		it('should call the correct method for request manager', async () => {
			const tx = {
				from: '0x528ABBBa47c33600245066398072799A9b7e2d9E',
				to: '0x9988BBBa47c33600245066398072799A9b7e2d9E',
			};
			jest.spyOn(eth, 'formatTransaction').mockReturnValue(tx);

			await ethPersonal.signTransaction(tx, 'password');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_signTransaction',
				params: [tx, 'password'],
			});
		});

		it('should format user input', async () => {
			const tx = {
				from: '0x528ABBBa47c33600245066398072799A9b7e2d9E',
				to: '0x9988BBBa47c33600245066398072799A9b7e2d9E',
			};
			jest.spyOn(eth, 'formatTransaction').mockReturnValue(tx);

			await ethPersonal.signTransaction(tx, 'password');

			expect(eth.formatTransaction).toHaveBeenCalledTimes(1);
			expect(eth.formatTransaction).toHaveBeenCalledWith(tx, {
				bytes: 'BYTES_HEX',
				number: 'NUMBER_HEX',
			});
		});
	});

	describe('sign', () => {
		it('should call the correct method for request manager', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.sign(data, '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_sign',
				params: ['0x1234', '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password'],
			});
		});

		it('should convert input if not hex', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(false);
			jest.spyOn(utils, 'utf8ToHex').mockReturnValue(data);

			await ethPersonal.sign(data, '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password');

			expect(utils.utf8ToHex).toHaveBeenCalledTimes(1);
			expect(utils.utf8ToHex).toHaveBeenCalledWith(data);
		});

		it('should not convert input if data is already hex', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.sign(data, '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password');

			expect(utils.utf8ToHex).toHaveBeenCalledTimes(0);
		});

		it('should validate user input', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.sign(data, '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password');

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(
				['bytes', 'address', 'string'],
				[data, '0x528ABBBa47c33600245066398072799A9b7e2d9E', 'password'],
			);
		});
	});

	describe('ecRecover', () => {
		it('should call the correct method for request manager', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.ecRecover(data, '0x000000');

			expect(sendSpy).toHaveBeenCalledWith({
				method: 'personal_ecRecover',
				params: [data, '0x000000'],
			});
		});

		it('should convert input if not hex', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(false);
			jest.spyOn(utils, 'utf8ToHex').mockReturnValue(data);

			await ethPersonal.ecRecover(data, 'password');

			expect(utils.utf8ToHex).toHaveBeenCalledTimes(1);
			expect(utils.utf8ToHex).toHaveBeenCalledWith(data);
		});

		it('should not convert input if data is already hex', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.ecRecover(data, 'password');

			expect(utils.utf8ToHex).toHaveBeenCalledTimes(0);
		});

		it('should validate user input', async () => {
			const data = '0x1234';

			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);

			await ethPersonal.ecRecover(data, 'password');

			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(['bytes', 'string'], [data, 'password']);
		});
	});
});
