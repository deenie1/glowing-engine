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


import { InvalidAddressError } from "web3-errors";
import { encodeAddress } from "../../../../src/coders/base/address";
import { AbiCoderError } from "../../../../src/errors";
import { invalidAddressCoderData, validAddressCoderData } from "../../../fixtures/coders/base/address";


describe("address coder", () => {

    it.each(validAddressCoderData)("value %s to result in %s", (value, expected) => {  
        const result = encodeAddress({type: "address", name: ""}, value);
        expect(Buffer.from(result.encoded).toString("hex")).toEqual(expected)
        
    })

    it.each(invalidAddressCoderData)("value %s to throw", (value) => {  
        expect(() => encodeAddress({type: "address", name: ""},value)).toThrow(AbiCoderError)
        
    })
})