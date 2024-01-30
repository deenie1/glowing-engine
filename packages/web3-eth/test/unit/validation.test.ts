/* eslint-disable jest/no-conditional-expect */

import { InvalidTransactionCall, InvalidTransactionWithSender } from '../../src/errors';
import {
	isAccessList,
	isAccessListEntry,
	isBaseTransaction,
	isTransaction1559Unsigned,
	isTransaction2930Unsigned,
	isTransactionCall,
	isTransactionLegacyUnsigned,
	isTransactionWithSender,
	validateTransactionCall,
	validateTransactionWithSender,
} from '../../src/validation';
import {
	isAccessListEntryValidData,
	isAccessListValidData,
	isBaseTransactionValidData,
	isTransaction1559UnsignedValidData,
	isTransaction2930UnsignedValidData,
	isTransactionCallValidData,
	isTransactionLegacyUnsignedValidData,
	isTransactionWithSenderValidData,
	validateTransactionCallInvalidData,
	validateTransactionWithSenderInvalidData,
} from '../fixtures/validation';

describe('validation', () => {
	describe('isBaseTransaction', () => {
		it.each(isBaseTransactionValidData)('%s', (input, output) => {
			expect(isBaseTransaction(input)).toEqual(output);
		});
	});
	describe('isAccessListEntry', () => {
		it.each(isAccessListEntryValidData)('%s', (input, output) => {
			expect(isAccessListEntry(input)).toEqual(output);
		});
	});
	describe('isAccessList', () => {
		it.each(isAccessListValidData())('%s', (input, output) => {
			expect(isAccessList(input)).toEqual(output);
		});
	});
	describe('isTransaction1559Unsigned', () => {
		it.each(isTransaction1559UnsignedValidData())('%s', (input, output) => {
			expect(isTransaction1559Unsigned(input)).toEqual(output);
		});
	});
	describe('isTransactionLegacyUnsigned', () => {
		it.each(isTransactionLegacyUnsignedValidData())('%s', (input, output) => {
			expect(isTransactionLegacyUnsigned(input)).toEqual(output);
		});
	});
	describe('isTransaction2930Unsigned', () => {
		it.each(isTransaction2930UnsignedValidData())('%s', (input, output) => {
			expect(isTransaction2930Unsigned(input)).toEqual(output);
		});
	});
	describe('isTransactionWithSender', () => {
		it.each(isTransactionWithSenderValidData())('%s', (input, output) => {
			expect(isTransactionWithSender(input)).toEqual(output);
		});
	});
	describe('validateTransactionWithSender', () => {
		it.each([
			...validateTransactionWithSenderInvalidData(),
			...isTransactionWithSenderValidData(),
		])('%s', (input, output) => {
			if (output instanceof InvalidTransactionWithSender) {
				expect(() => validateTransactionWithSender(input)).toThrow(output);
			} else {
				expect(() => validateTransactionWithSender(input)).not.toThrow();
			}
		});
	});
	describe('isTransactionCall', () => {
		it.each(isTransactionCallValidData)('%s', (input, output) => {
			expect(isTransactionCall(input)).toEqual(output);
		});
	});
	describe('validateTransactionCall', () => {
		it.each([...validateTransactionCallInvalidData(), ...isTransactionCallValidData])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidTransactionCall) {
					expect(() => validateTransactionCall(input)).toThrow(output);
				} else {
					expect(() => validateTransactionCall(input)).not.toThrow();
				}
			},
		);
	});
});
