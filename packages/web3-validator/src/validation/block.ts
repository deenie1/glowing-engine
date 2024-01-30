﻿/*
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

import { BlockTags } from '../types';
import { isHexStrict } from './string';

export const isBlockNumber = (value: string): boolean =>
	isHexStrict(value) && !value.startsWith('-');

/**
 * Returns true if the given blockNumber is 'latest', 'pending', or 'earliest.
 */
export const isBlockTag = (value: string) =>
	BlockTags.LATEST === value || BlockTags.PENDING === value || BlockTags.EARLIEST === value;

/**
 * Returns true if given value is valid hex string and not negative, or is a valid BlockTag
 */
export const isBlockNumberOrTag = (value: string) =>
	(isHexStrict(value) && !value.startsWith('-')) || isBlockTag(value);
