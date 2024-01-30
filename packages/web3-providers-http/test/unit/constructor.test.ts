import { ProviderOptions } from 'web3-providers-base/lib/types';

import Web3ProvidersHttp from '../../src/index';

describe('constructs a Web3ProvidersHttp instance with expected properties', () => {
    const providerOptions: ProviderOptions = {
        providerUrl: 'http://127.0.0.1:8545',
    };

    it('should set the correct property values', () => {
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(web3ProvidersHttp).toMatchObject(providerOptions);
    });
});
