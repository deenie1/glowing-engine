import { RpcResponse } from 'web3-providers-base/lib/types';
import { DEFAULT_ACCOUNTS } from '../constants';

interface Method {
    name: string;
    rpcMethod: string;
    parameters?: any;
    defaultExpectedResult: RpcResponse;
    testInputFormatter?: true;
    testOutputFormatter?: true;
    formattableInputProperties?: string[];
    formattablePropertyByteLengths?: { [key: string]: number };
    formattableOutputProperties?: string[];
}

interface TestConfig {
    providerUrl: string;
    jsonRpcVersion: string;
    expectedRpcId: number;
    methods: Method[];
}

const expectedRpcId = 42;
const expectedRpcVersion = '2.0';
const expectedResultBase = {
    id: expectedRpcId,
    jsonrpc: expectedRpcVersion,
    result: undefined,
};
export const testConfig: TestConfig = {
    providerUrl: 'http://127.0.0.1:8545',
    jsonRpcVersion: expectedRpcVersion,
    expectedRpcId: expectedRpcId,
    methods: [
        {
            name: 'getClientVersion',
            rpcMethod: 'web3_clientVersion',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: 'Mist/v0.9.3/darwin/go1.4.1',
            },
        },
        {
            name: 'getSha3',
            rpcMethod: 'web3_sha3',
            parameters: {
                data: '0x68656c6c6f20776f726c64',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
            },
        },
        {
            name: 'getNetworkVersion',
            rpcMethod: 'net_version',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1',
            },
            testOutputFormatter: true,
        },
        {
            name: 'getNetworkListening',
            rpcMethod: 'net_listening',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1',
            },
        },
        {
            name: 'getNetworkPeerCount',
            rpcMethod: 'net_peerCount',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x2',
            },
            testOutputFormatter: true,
        },
        {
            name: 'getProtocolVersion',
            rpcMethod: 'eth_protocolVersion',
            defaultExpectedResult: { ...expectedResultBase, result: '0x36' },
            testOutputFormatter: true,
        },
        {
            name: 'getSyncing',
            rpcMethod: 'eth_syncing',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    startingBlock: '0x384',
                    currentBlock: '0x386',
                    highestBlock: '0x454',
                },
            },
            testOutputFormatter: true,
            formattableOutputProperties: [
                'startingBlock',
                'currentBlock',
                'highestBlock',
            ],
        },
        {
            name: 'getCoinbase',
            rpcMethod: 'eth_coinbase',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
            },
        },
        {
            name: 'getMining',
            rpcMethod: 'eth_mining',
            defaultExpectedResult: { ...expectedResultBase, result: true },
        },
        {
            name: 'getHashRate',
            rpcMethod: 'eth_hashrate',
            defaultExpectedResult: { ...expectedResultBase, result: '0x38a' },
            testOutputFormatter: true,
        },
        {
            name: 'getGasPrice',
            rpcMethod: 'eth_gasPrice',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1dfd14000',
            },
            testOutputFormatter: true,
        },
        {
            name: 'getAccounts',
            rpcMethod: 'eth_accounts',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: DEFAULT_ACCOUNTS,
            },
        },
        {
            name: 'getBlockNumber',
            rpcMethod: 'eth_blockNumber',
            defaultExpectedResult: { ...expectedResultBase, result: '0x4b7' },
            testOutputFormatter: true,
        },
        {
            name: 'getBalance',
            rpcMethod: 'eth_getBalance',
            parameters: {
                address: DEFAULT_ACCOUNTS[0],
                blockIdentifier: '0x2a',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x0234c8a3397aab58',
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
        },
        {
            name: 'getStorageAt',
            rpcMethod: 'eth_getStorageAt',
            parameters: {
                address: '0x295a70b2de5e3953354a6a8344e616ed314d7251',
                storagePosition: '0x0',
                blockIdentifier: '0x2a',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x000000000000000000000000000000000000000000000000000000000000162e',
            },
            testInputFormatter: true,
            formattableInputProperties: ['storagePosition', 'blockIdentifier'],
        },
        {
            name: 'getTransactionCount',
            rpcMethod: 'eth_getTransactionCount',
            parameters: {
                address: DEFAULT_ACCOUNTS[0],
                blockIdentifier: '0x2a',
            },
            defaultExpectedResult: { ...expectedResultBase, result: '0x1' },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
        },
        {
            name: 'getBlockTransactionCountByHash',
            rpcMethod: 'eth_getBlockTransactionCountByHash',
            parameters: {
                blockHash:
                    '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
            },
            defaultExpectedResult: { ...expectedResultBase, result: '0xb' },
            testOutputFormatter: true,
        },
        {
            name: 'getBlockTransactionCountByNumber',
            rpcMethod: 'eth_getBlockTransactionCountByNumber',
            parameters: { blockIdentifier: '0xe8' },
            defaultExpectedResult: { ...expectedResultBase, result: '0xb' },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
        },
        {
            name: 'getUncleCountByBlockHash',
            rpcMethod: 'eth_getUncleCountByBlockHash',
            parameters: {
                blockHash:
                    '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
            },
            defaultExpectedResult: { ...expectedResultBase, result: '0x1' },
            testOutputFormatter: true,
        },
        {
            name: 'getUncleCountByBlockNumber',
            rpcMethod: 'eth_getUncleCountByBlockNumber',
            parameters: { blockIdentifier: '0xe8' },
            defaultExpectedResult: { ...expectedResultBase, result: '0x1' },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
        },
        {
            name: 'getCode',
            rpcMethod: 'eth_getCode',
            parameters: {
                address: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                blockIdentifier: '0x42',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056',
            },
            testInputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
        },
        {
            name: 'sign',
            rpcMethod: 'eth_sign',
            parameters: {
                address: DEFAULT_ACCOUNTS[0],
                message: '0xc0ffe',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x00b227ebf7f1964350a49c00ec38d5177b3103a3daad188300fa54f3cd715c8d3750404dbdfa16154ea65e92f9278773bcac80f98e245eb9b5f1c0a25bca9f8600',
            },
        },
        // {
        //     name: 'signTransaction',
        //     rpcMethod: 'eth_signTransaction',
        //     parameters: {
        //         transaction: {
        //             from: DEFAULT_ACCOUNTS[0],
        //             to: DEFAULT_ACCOUNTS[1],
        //             gas: '0x76c0',
        //             gasPrice: '0x9184e72a000',
        //             value: '0x1',
        //             nonce: '0x1',
        //         },
        //     },
        //     defaultExpectedResult: { ...expectedResultBase, result: '0x1' },
        //     testInputFormatter: true,
        //     formattableInputProperties: ['gas', 'gasPrice', 'value', 'nonce'],
        // },
        // {
        //     name: 'sendTransaction',
        //     rpcMethod: 'eth_sendTransaction',
        //     parameters: {
        //         transaction: {
        //             from: DEFAULT_ACCOUNTS[0],
        //             to: DEFAULT_ACCOUNTS[1],
        //             gas: '0x76c0',
        //             gasPrice: '0x9184e72a000',
        //             value: '0x1',
        //             nonce: '0x1',
        //         },
        //     },
        //     defaultExpectedResult: { ...expectedResultBase, result: '0x1' },
        //     testInputFormatter: true,
        //     formattableInputProperties: ['gas', 'gasPrice', 'value', 'nonce'],
        // },
        {
            name: 'sendRawTransaction',
            rpcMethod: 'eth_sendRawTransaction',
            parameters: {
                rawTransaction:
                    '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
            },
        },
        // {
        //     name: 'call',
        //     rpcMethod: 'eth_call',
        //     parameters: {
        //         transaction: {
        //             from: DEFAULT_ACCOUNTS[0],
        //             to: DEFAULT_ACCOUNTS[1],
        //             gas: '0x76c0',
        //             gasPrice: '0x9184e72a000',
        //             value: '0x1',
        //             data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
        //             nonce: '0x1',
        //         },
        //     },
        //     defaultExpectedResult: {
        //         ...expectedResultBase,
        //         result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
        //     },
        //     testInputFormatter: true,
        //     formattableInputProperties: ['gas', 'gasPrice', 'value', 'nonce'],
        // },
        // {
        //     name: 'estimateGas',
        //     rpcMethod: 'eth_estimateGas',
        //     parameters: {
        //         transaction: {
        //             from: DEFAULT_ACCOUNTS[0],
        //             to: DEFAULT_ACCOUNTS[1],
        //             gas: '0x76c0',
        //             gasPrice: '0x9184e72a000',
        //             value: '0x1',
        //             data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
        //             nonce: '0x1',
        //         },
        //     },
        //     defaultExpectedResult: {
        //         ...expectedResultBase,
        //         result: '0x5208',
        //     },
        //     testInputFormatter: true,
        //     testOutputFormatter: true,
        //     formattableInputProperties: ['gas', 'gasPrice', 'value', 'nonce'],
        // },
        {
            name: 'getBlockByHash',
            rpcMethod: 'eth_getBlockByHash',
            parameters: {
                blockHash:
                    '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                returnFullTxs: false,
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    {
                        difficulty: '0x4ea3f27bc',
                        extraData:
                            '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                        gasLimit: '0x1388',
                        gasUsed: '0x0',
                        hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                        logsBloom:
                            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                        miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                        mixHash:
                            '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                        nonce: '0x689056015818adbe',
                        number: '0x1b4',
                        parentHash:
                            '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                        receiptsRoot:
                            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                        sha3Uncles:
                            '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                        size: '0x220',
                        stateRoot:
                            '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                        timestamp: '0x55ba467c',
                        totalDifficulty: '0x78ed983323d',
                        transactions: [],
                        transactionsRoot:
                            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                        uncles: [],
                    },
                ],
            },
            testOutputFormatter: true,
            formattableOutputProperties: [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
            ],
        },
        {
            name: 'getBlockByNumber',
            rpcMethod: 'eth_getBlockByNumber',
            parameters: {
                blockIdentifier: '0x1b4',
                returnFullTxs: true,
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    {
                        difficulty: '0x4ea3f27bc',
                        extraData:
                            '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                        gasLimit: '0x1388',
                        gasUsed: '0x0',
                        hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                        logsBloom:
                            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                        miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                        mixHash:
                            '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                        nonce: '0x689056015818adbe',
                        number: '0x1b4',
                        parentHash:
                            '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                        receiptsRoot:
                            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                        sha3Uncles:
                            '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                        size: '0x220',
                        stateRoot:
                            '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                        timestamp: '0x55ba467c',
                        totalDifficulty: '0x78ed983323d',
                        transactions: [],
                        transactionsRoot:
                            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                        uncles: [],
                    },
                ],
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier'],
            formattableOutputProperties: [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
            ],
        },
        {
            name: 'getTransactionByHash',
            rpcMethod: 'eth_getTransactionByHash',
            parameters: {
                txHash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    blockHash:
                        '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                    blockNumber: '0x5daf3b',
                    from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                    gas: '0xc350',
                    gasPrice: '0x4a817c800',
                    hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                    input: '0x68656c6c6f21',
                    nonce: '0x15',
                    to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                    transactionIndex: '0x41',
                    value: '0xf3dbb76162000',
                    v: '0x25',
                    r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                    s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                },
            },
            testOutputFormatter: true,
            formattableOutputProperties: [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
        },
        {
            name: 'getTransactionByBlockHashAndIndex',
            rpcMethod: 'eth_getTransactionByBlockHashAndIndex',
            parameters: {
                blockHash:
                    '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
                transactionIndex: '0x0',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    blockHash:
                        '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                    blockNumber: '0x5daf3b',
                    from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                    gas: '0xc350',
                    gasPrice: '0x4a817c800',
                    hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                    input: '0x68656c6c6f21',
                    nonce: '0x15',
                    to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                    transactionIndex: '0x41',
                    value: '0xf3dbb76162000',
                    v: '0x25',
                    r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                    s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                },
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['transactionIndex'],
            formattableOutputProperties: [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
        },
        {
            name: 'getTransactionByBlockNumberAndIndex',
            rpcMethod: 'eth_getTransactionByBlockNumberAndIndex',
            parameters: {
                blockIdentifier: '0x29c',
                transactionIndex: '0x0',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    blockHash:
                        '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                    blockNumber: '0x5daf3b',
                    from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                    gas: '0xc350',
                    gasPrice: '0x4a817c800',
                    hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                    input: '0x68656c6c6f21',
                    nonce: '0x15',
                    to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                    transactionIndex: '0x41',
                    value: '0xf3dbb76162000',
                    v: '0x25',
                    r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                    s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                },
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier', 'transactionIndex'],
            formattableOutputProperties: [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
        },
        {
            name: 'getTransactionReceipt',
            rpcMethod: 'eth_getTransactionReceipt',
            parameters: {
                txHash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    transactionHash:
                        '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
                    transactionIndex: '0x1',
                    blockNumber: '0xb',
                    blockHash:
                        '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                    cumulativeGasUsed: '0x33bc',
                    gasUsed: '0x4dc',
                    contractAddress:
                        '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
                    logs: [],
                    logsBloom: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
                    status: '0x1',
                },
            },
            testOutputFormatter: true,
            formattableOutputProperties: [
                'transactionIndex',
                'blockNumber',
                'cumulativeGasUsed',
                'gasUsed',
                'status',
            ],
        },
        {
            name: 'getUncleByBlockHashAndIndex',
            rpcMethod: 'eth_getUncleByBlockHashAndIndex',
            parameters: {
                blockHash:
                    '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                uncleIndex: '0x0',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    difficulty: '0x4ea3f27bc',
                    extraData:
                        '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                    gasLimit: '0x1388',
                    gasUsed: '0x0',
                    hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                    logsBloom:
                        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                    mixHash:
                        '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                    nonce: '0x689056015818adbe',
                    number: '0x1b4',
                    parentHash:
                        '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                    receiptsRoot:
                        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                    sha3Uncles:
                        '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                    size: '0x220',
                    stateRoot:
                        '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                    timestamp: '0x55ba467c',
                    totalDifficulty: '0x78ed983323d',
                    transactions: [],
                    transactionsRoot:
                        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                    uncles: [],
                },
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['uncleIndex'],
            formattableOutputProperties: [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
            ],
        },
        {
            name: 'getUncleByBlockNumberAndIndex',
            rpcMethod: 'eth_getUncleByBlockNumberAndIndex',
            parameters: {
                blockIdentifier: '0x29c',
                uncleIndex: '0x0',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    difficulty: '0x4ea3f27bc',
                    extraData:
                        '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                    gasLimit: '0x1388',
                    gasUsed: '0x0',
                    hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                    logsBloom:
                        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                    mixHash:
                        '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                    nonce: '0x689056015818adbe',
                    number: '0x1b4',
                    parentHash:
                        '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                    receiptsRoot:
                        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                    sha3Uncles:
                        '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                    size: '0x220',
                    stateRoot:
                        '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                    timestamp: '0x55ba467c',
                    totalDifficulty: '0x78ed983323d',
                    transactions: [],
                    transactionsRoot:
                        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                    uncles: [],
                },
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['blockIdentifier', 'uncleIndex'],
            formattableOutputProperties: [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
            ],
        },
        {
            name: 'getCompilers',
            rpcMethod: 'eth_getCompilers',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: ['solidity', 'lll', 'serpent'],
            },
        },
        {
            name: 'compileSolidity',
            rpcMethod: 'eth_compileSolidity',
            parameters: {
                sourceCode:
                    'contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: {
                    code: '0x605880600c6000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063c6888fa114602e57005b603d6004803590602001506047565b8060005260206000f35b60006007820290506053565b91905056',
                    info: {
                        source: 'contract test {\n   function multiply(uint a) constant returns(uint d) {\n       return a * 7;\n   }\n}\n',
                        language: 'Solidity',
                        languageVersion: '0',
                        compilerVersion: '0.9.19',
                        abiDefinition: [
                            {
                                constant: true,
                                inputs: [
                                    {
                                        name: 'a',
                                        type: 'uint256',
                                    },
                                ],
                                name: 'multiply',
                                outputs: [
                                    {
                                        name: 'd',
                                        type: 'uint256',
                                    },
                                ],
                                type: 'function',
                            },
                        ],
                        userDoc: {
                            methods: {},
                        },
                        developerDoc: {
                            methods: {},
                        },
                    },
                },
            },
        },
        {
            name: 'compileLLL',
            rpcMethod: 'eth_compileLLL',
            parameters: { sourceCode: '(returnlll (suicide (caller)))' },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056',
            },
        },
        {
            name: 'compileSerpent',
            rpcMethod: 'eth_compileSerpent',
            parameters: { sourceCode: '/* some serpent */' },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056',
            },
        },
        {
            name: 'newFilter',
            rpcMethod: 'eth_newFilter',
            parameters: {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1',
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['fromBlock', 'toBlock'],
        },
        {
            name: 'newBlockFilter',
            rpcMethod: 'eth_newBlockFilter',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1',
            },
            testOutputFormatter: true,
        },
        {
            name: 'newPendingTransactionFilter',
            rpcMethod: 'eth_newPendingTransactionFilter',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: '0x1',
            },
            testOutputFormatter: true,
        },
        {
            name: 'uninstallFilter',
            rpcMethod: 'eth_uninstallFilter',
            parameters: { filterId: '0xb' },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: true,
            },
            testInputFormatter: true,
            formattableInputProperties: ['filterId'],
        },
        {
            name: 'getFilterChanges',
            rpcMethod: 'eth_getFilterChanges',
            parameters: { filterId: '0x16' },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    {
                        logIndex: '0x1',
                        blockNumber: '0x1b4',
                        blockHash:
                            '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        transactionHash:
                            '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                        transactionIndex: '0x0',
                        address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        topics: [
                            '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                        ],
                    },
                ],
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['filterId'],
            formattableOutputProperties: [
                'logIndex',
                'transactionIndex',
                'blockNumber',
            ],
        },
        {
            name: 'getFilterLogs',
            rpcMethod: 'eth_getFilterLogs',
            parameters: { filterId: '0x16' },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    {
                        logIndex: '0x1',
                        blockNumber: '0x1b4',
                        blockHash:
                            '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        transactionHash:
                            '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                        transactionIndex: '0x0',
                        address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        topics: [
                            '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                        ],
                    },
                ],
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['filterId'],
            formattableOutputProperties: [
                'logIndex',
                'transactionIndex',
                'blockNumber',
            ],
        },
        {
            name: 'getLogs',
            rpcMethod: 'eth_getLogs',
            parameters: {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    {
                        logIndex: '0x1',
                        blockNumber: '0x1b4',
                        blockHash:
                            '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        transactionHash:
                            '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                        transactionIndex: '0x0',
                        address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        topics: [
                            '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                        ],
                    },
                ],
            },
            testInputFormatter: true,
            testOutputFormatter: true,
            formattableInputProperties: ['fromBlock', 'toBlock'],
            formattableOutputProperties: [
                'logIndex',
                'transactionIndex',
                'blockNumber',
            ],
        },
        {
            name: 'getWork',
            rpcMethod: 'eth_getWork',
            defaultExpectedResult: {
                ...expectedResultBase,
                result: [
                    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                    '0x5EED00000000000000000000000000005EED0000000000000000000000000000',
                    '0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000',
                ],
            },
        },
        {
            name: 'submitWork',
            rpcMethod: 'eth_submitWork',
            parameters: {
                nonce: '0x000000000000002a',
                powHash:
                    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                digest: '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: true,
            },
            testInputFormatter: true,
            formattableInputProperties: ['nonce'],
            formattablePropertyByteLengths: { nonce: 8 },
        },
        {
            name: 'submitHashRate',
            rpcMethod: 'eth_submitHashRate',
            parameters: {
                hashRate:
                    '0x0000000000000000000000000000000000000000000000000000000000500000',
                clientId:
                    '0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
            },
            defaultExpectedResult: {
                ...expectedResultBase,
                result: true,
            },
            testInputFormatter: true,
            formattableInputProperties: ['hashRate'],
            formattablePropertyByteLengths: { hashRate: 32 },
        },
    ],
};
