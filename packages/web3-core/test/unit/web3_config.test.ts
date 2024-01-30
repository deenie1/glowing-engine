import { toHex } from 'web3-utils';
import { Web3Config, Web3ConfigEvent } from '../../src/web3_config';

class MyConfigObject extends Web3Config {}

const defaultConfig = {
	blockHeaderTimeout: 10,
	defaultAccount: null,
	defaultBlock: 'latest',
	defaultChain: 'mainnet',
	defaultNetworkId: null,
	defaultCommon: null,
	defaultHardfork: 'london',
	handleRevert: false,
	maxListenersWarningThreshold: 100,
	transactionBlockTimeout: 50,
	transactionConfirmationBlocks: 24,
	transactionPollingInterval: 1000,
	transactionPollingTimeout: 750,
	transactionReceiptPollingInterval: null,
	transactionConfirmationPollingInterval: null,
	defaultTransactionType: '0x0',
	defaultMaxPriorityFeePerGas: toHex(2500000000),
};

describe('Web3Config', () => {
	it('should init default config values', () => {
		const obj = new MyConfigObject();

		expect(obj.getConfig()).toEqual(defaultConfig);
	});

	it.each(Object.keys(defaultConfig))('should expose a public getter for "%s"', key => {
		const obj = new MyConfigObject();
		const getterSpy = jest.spyOn(obj, key as never, 'get');

		const result = obj[key as never];

		expect(getterSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual(defaultConfig[key as never]);
	});

	it.each(Object.keys(defaultConfig))('should expose a public setter for "%s"', key => {
		const obj = new MyConfigObject();
		const setterSpy = jest.spyOn(obj, key as never, 'set');

		obj[key as never] = null as never;
		expect(setterSpy).toHaveBeenCalledTimes(1);
	});

	it.each(Object.keys(defaultConfig))('should set new config for "%s"', key => {
		const obj = new MyConfigObject();

		obj[key as never] = 'newValue' as never;
		const result = obj[key as never];

		expect(result).toBe('newValue');
	});

	it.each(Object.keys(defaultConfig))(
		'should trigger "configChange" event if "%s" is changed',
		key => {
			const obj = new MyConfigObject();
			const configChange = jest.fn();
			obj.on(Web3ConfigEvent.CONFIG_CHANGE, configChange);

			obj[key as never] = 'newValue' as never;

			if (key === 'transactionPollingInterval') return;

			expect(configChange).toHaveBeenCalledTimes(1);
			expect(configChange).toHaveBeenCalledWith({
				name: key,
				oldValue: defaultConfig[key as never],
				newValue: 'newValue',
			});
		},
	);

	it('Updating transactionPollingInterval should update transactionReceiptPollingInterval and transactionConfirmationPollingInterval', () => {
		const obj = new MyConfigObject();
		const configChange = jest.fn();
		obj.on(Web3ConfigEvent.CONFIG_CHANGE, configChange);

		obj.transactionPollingInterval = 1500;

		expect(configChange).toHaveBeenCalledTimes(3);
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionPollingInterval',
			oldValue: defaultConfig.transactionPollingInterval,
			newValue: 1500,
		});
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionReceiptPollingInterval',
			oldValue: defaultConfig.transactionReceiptPollingInterval,
			newValue: 1500,
		});
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionConfirmationPollingInterval',
			oldValue: defaultConfig.transactionConfirmationPollingInterval,
			newValue: 1500,
		});
	});
});
