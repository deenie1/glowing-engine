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

export const SimpleOverloadedAbi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'numToAdd',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: '_someString',
				type: 'string',
			},
		],
		name: 'getSecret',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getSecret',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'numToAdd',
				type: 'uint256',
			},
		],
		name: 'getSecret',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'deadline',
				type: 'uint256',
			},
			{
				internalType: 'bytes[]',
				name: 'datas',
				type: 'bytes[]',
			},
		],
		name: 'multicall',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes[]',
				name: 'datas',
				type: 'bytes[]',
			},
		],
		name: 'multicall',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'secret',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'numToAdd',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: '_someString',
				type: 'string',
			},
		],
		name: 'setSecret',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'numToAdd',
				type: 'uint256',
			},
		],
		name: 'setSecret',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'setSecret',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'someString',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

export const SimpleOverloadedBytecode =
	'608060405234801561001057600080fd5b50602a600081905550610da5806100286000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80638d17664d116100665780638d17664d14610146578063ac9650d814610176578063b8bf4de714610192578063d1efd30d1461019c578063e7a96f6d146101ba5761009e565b806301a27378146100a35780632687b697146100d45780633b4dbf8b146100f05780635ae401dc1461010c5780635b9fdc3014610128575b600080fd5b6100bd60048036038101906100b89190610540565b6101d8565b6040516100cb92919061063f565b60405180910390f35b6100ee60048036038101906100e99190610540565b61021b565b005b61010a6004803603810190610105919061066f565b61024a565b005b610126600480360381019061012191906106f2565b610265565b005b610130610328565b60405161013d9190610752565b60405180910390f35b610160600480360381019061015b919061066f565b610331565b60405161016d9190610752565b60405180910390f35b610190600480360381019061018b919061076d565b610348565b005b61019a6103fd565b005b6101a4610407565b6040516101b19190610752565b60405180910390f35b6101c261040d565b6040516101cf91906107ba565b60405180910390f35b60006060846000546101ea919061080b565b6001858560405160200161020093929190610976565b60405160208183030381529060405291509150935093915050565b8260008082825461022c919061080b565b92505081905550818160019182610244929190610b6d565b50505050565b8060008082825461025b919061080b565b9250508190555050565b8242111561027257600080fd5b60005b82829050811015610322573073ffffffffffffffffffffffffffffffffffffffff168383838181106102aa576102a9610c3d565b5b90506020028101906102bc9190610c7b565b6040516102ca929190610d0e565b6000604051808303816000865af19150503d8060008114610307576040519150601f19603f3d011682016040523d82523d6000602084013e61030c565b606091505b505050808061031a90610d27565b915050610275565b50505050565b60008054905090565b600081600054610341919061080b565b9050919050565b60005b828290508110156103f8573073ffffffffffffffffffffffffffffffffffffffff168383838181106103805761037f610c3d565b5b90506020028101906103929190610c7b565b6040516103a0929190610d0e565b6000604051808303816000865af19150503d80600081146103dd576040519150601f19603f3d011682016040523d82523d6000602084013e6103e2565b606091505b50505080806103f090610d27565b91505061034b565b505050565b602a600081905550565b60005481565b6001805461041a9061086e565b80601f01602080910402602001604051908101604052809291908181526020018280546104469061086e565b80156104935780601f1061046857610100808354040283529160200191610493565b820191906000526020600020905b81548152906001019060200180831161047657829003601f168201915b505050505081565b600080fd5b600080fd5b6000819050919050565b6104b8816104a5565b81146104c357600080fd5b50565b6000813590506104d5816104af565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f840112610500576104ff6104db565b5b8235905067ffffffffffffffff81111561051d5761051c6104e0565b5b602083019150836001820283011115610539576105386104e5565b5b9250929050565b6000806000604084860312156105595761055861049b565b5b6000610567868287016104c6565b935050602084013567ffffffffffffffff811115610588576105876104a0565b5b610594868287016104ea565b92509250509250925092565b6105a9816104a5565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156105e95780820151818401526020810190506105ce565b60008484015250505050565b6000601f19601f8301169050919050565b6000610611826105af565b61061b81856105ba565b935061062b8185602086016105cb565b610634816105f5565b840191505092915050565b600060408201905061065460008301856105a0565b81810360208301526106668184610606565b90509392505050565b6000602082840312156106855761068461049b565b5b6000610693848285016104c6565b91505092915050565b60008083601f8401126106b2576106b16104db565b5b8235905067ffffffffffffffff8111156106cf576106ce6104e0565b5b6020830191508360208202830111156106eb576106ea6104e5565b5b9250929050565b60008060006040848603121561070b5761070a61049b565b5b6000610719868287016104c6565b935050602084013567ffffffffffffffff81111561073a576107396104a0565b5b6107468682870161069c565b92509250509250925092565b600060208201905061076760008301846105a0565b92915050565b600080602083850312156107845761078361049b565b5b600083013567ffffffffffffffff8111156107a2576107a16104a0565b5b6107ae8582860161069c565b92509250509250929050565b600060208201905081810360008301526107d48184610606565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610816826104a5565b9150610821836104a5565b9250828201905080821115610839576108386107dc565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061088657607f821691505b6020821081036108995761089861083f565b5b50919050565b600081905092915050565b60008190508160005260206000209050919050565b600081546108cc8161086e565b6108d6818661089f565b945060018216600081146108f1576001811461090657610939565b60ff1983168652811515820286019350610939565b61090f856108aa565b60005b8381101561093157815481890152600182019150602081019050610912565b838801955050505b50505092915050565b82818337600083830152505050565b600061095d838561089f565b935061096a838584610942565b82840190509392505050565b600061098282866108bf565b915061098f828486610951565b9150819050949350505050565b600082905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020601f8301049050919050565b600082821b905092915050565b600060088302610a237fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826109e6565b610a2d86836109e6565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610a6a610a65610a60846104a5565b610a45565b6104a5565b9050919050565b6000819050919050565b610a8483610a4f565b610a98610a9082610a71565b8484546109f3565b825550505050565b600090565b610aad610aa0565b610ab8818484610a7b565b505050565b5b81811015610adc57610ad1600082610aa5565b600181019050610abe565b5050565b601f821115610b2157610af2816108aa565b610afb846109d6565b81016020851015610b0a578190505b610b1e610b16856109d6565b830182610abd565b50505b505050565b600082821c905092915050565b6000610b4460001984600802610b26565b1980831691505092915050565b6000610b5d8383610b33565b9150826002028217905092915050565b610b77838361099c565b67ffffffffffffffff811115610b9057610b8f6109a7565b5b610b9a825461086e565b610ba5828285610ae0565b6000601f831160018114610bd45760008415610bc2578287013590505b610bcc8582610b51565b865550610c34565b601f198416610be2866108aa565b60005b82811015610c0a57848901358255600182019150602085019450602081019050610be5565b86831015610c275784890135610c23601f891682610b33565b8355505b6001600288020188555050505b50505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610c9857610c97610c6c565b5b80840192508235915067ffffffffffffffff821115610cba57610cb9610c71565b5b602083019250600182023603831315610cd657610cd5610c76565b5b509250929050565b600081905092915050565b6000610cf58385610cde565b9350610d02838584610942565b82840190509392505050565b6000610d1b828486610ce9565b91508190509392505050565b6000610d32826104a5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610d6457610d636107dc565b5b60018201905091905056fea264697066735822122051bf349567ac5068fe1c4aeb5f09d024556608a3de408fb2ad8bee6570f865c864736f6c63430008130033';
