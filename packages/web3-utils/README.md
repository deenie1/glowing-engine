<p align="center">
  <img src="assets/logo/web3js.jpg" width="500" alt="web3.js" />
</p>

# web3-utils

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-14.x-green)
[![NPM Package][npm-image]][npm-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

`web3-utils` This contains useful utility functions for Dapp developers.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-utils) or using [Yarn](https://yarnpkg.com/package/web3-utils)

### Using NPM

```bash
npm install web3-utils
```

### Using Yarn

```bash
yarn add web3-utils
```

## Usage

```js
const Web3Utils = require('web3-utils');
console.log(Web3Utils);
{
    sha3: function(){},
    soliditySha3: function(){},
    isAddress: function(){},
    ...
}
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/ChainSafe/web3.js/issues/new) or join us on [Discord](https://discord.gg/yjyvFRP)
    ![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Package.json Scripts

| Script           | Description                                        |
| ---------------- | -------------------------------------------------- |
| clean            | Uses `rimraf` to remove `dist/`                    |
| build            | Uses `tsc` to build package and dependent packages |
| lint             | Uses `eslint` to lint package                      |
| lint:fix         | Uses `eslint` to check and fix any warnings        |
| format           | Uses `prettier` to format the code                 |
| test             | Uses `jest` to run unit tests                      |
| test:integration | Uses `jest` to run tests under `/test/integration` |
| test:unit        | Uses `jest` to run tests under `/test/unit`        |

[docs]: http://web3js.readthedocs.io/en/4.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-utils.svg
[npm-url]: https://npmjs.org/packages/web3-utils
[deps-image]: https://david-dm.org/ethereum/web3.js/4.x/status.svg?path=packages/web3-utils
[deps-url]: https://david-dm.org/ethereum/web3.js/4.x?path=packages/web3-utils
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/4.x/dev-status.svg?path=packages/web3-utils
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/4.x?type=dev&path=packages/web3-utils
