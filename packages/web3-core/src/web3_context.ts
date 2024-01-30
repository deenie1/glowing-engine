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
// eslint-disable-next-line max-classes-per-file
import {
	Web3APISpec,
	Web3BaseWallet,
	Web3BaseWalletAccount,
	Web3AccountProvider,
	SupportedProviders,
	HexString,
	EthExecutionAPI,
} from 'web3-types';
import { isNullish } from 'web3-utils';
import { ExistingPluginNamespaceError } from 'web3-errors';

import { isSupportedProvider } from './utils';
// eslint-disable-next-line import/no-cycle
import { Web3Config, Web3ConfigEvent, Web3ConfigOptions } from './web3_config';
import { Web3RequestManager } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';
import { Web3SubscriptionManager } from './web3_subscription_manager';
import { Web3BatchRequest } from './web3_batch_request';

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextObject<
	API extends Web3APISpec = unknown,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> = {
	config: Web3ConfigOptions;
	provider?: SupportedProviders<API> | string;
	requestManager: Web3RequestManager<API>;
	subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs> | undefined;
	registeredSubscriptions?: RegisteredSubs;
	providers: typeof Web3RequestManager.providers;
	accountProvider?: Web3AccountProvider<Web3BaseWalletAccount>;
	wallet?: Web3BaseWallet<Web3BaseWalletAccount>;
};

export type Web3ContextInitOptions<
	API extends Web3APISpec = unknown,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> = {
	config?: Partial<Web3ConfigOptions>;
	provider?: SupportedProviders<API> | string;
	requestManager?: Web3RequestManager<API>;
	subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs> | undefined;
	registeredSubscriptions?: RegisteredSubs;
	accountProvider?: Web3AccountProvider<Web3BaseWalletAccount>;
	wallet?: Web3BaseWallet<Web3BaseWalletAccount>;
};

// eslint-disable-next-line no-use-before-define
export type Web3ContextConstructor<T extends Web3Context, T2 extends unknown[]> = new (
	...args: [...extras: T2, context: Web3ContextObject]
) => T;

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextFactory<
	// eslint-disable-next-line no-use-before-define
	T extends Web3Context,
	T2 extends unknown[],
> = Web3ContextConstructor<T, T2> & {
	fromContextObject(this: Web3ContextConstructor<T, T2>, contextObject: Web3ContextObject): T;
};

export class Web3Context<
	API extends Web3APISpec = unknown,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders<never>;
	public readonly providers = Web3RequestManager.providers;
	protected _requestManager: Web3RequestManager<API>;
	protected _subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs>;
	protected _accountProvider?: Web3AccountProvider<Web3BaseWalletAccount>;
	protected _wallet?: Web3BaseWallet<Web3BaseWalletAccount>;

	public constructor(
		providerOrContext?:
			| string
			| SupportedProviders<API>
			| Web3ContextInitOptions<API, RegisteredSubs>,
	) {
		super();

		// If "providerOrContext" is provided as "string" or an objects matching "SupportedProviders" interface
		if (
			isNullish(providerOrContext) ||
			(typeof providerOrContext === 'string' && providerOrContext.trim() !== '') ||
			isSupportedProvider(providerOrContext as SupportedProviders<API>)
		) {
			this._requestManager = new Web3RequestManager<API>(
				providerOrContext as undefined | string | SupportedProviders<API>,
			);
			this._subscriptionManager = new Web3SubscriptionManager(
				this._requestManager,
				{} as RegisteredSubs,
			);

			return;
		}

		const {
			config,
			provider,
			requestManager,
			subscriptionManager,
			registeredSubscriptions,
			accountProvider,
			wallet,
		} = providerOrContext as Web3ContextInitOptions<API, RegisteredSubs>;

		this.setConfig(config ?? {});

		this._requestManager =
			requestManager ??
			new Web3RequestManager<API>(
				provider,
				undefined,
				config?.enableExperimentalFeatures?.useSubscriptionWhenCheckingBlockTimeout,
			);

		if (subscriptionManager) {
			this._subscriptionManager = subscriptionManager;
		} else if (registeredSubscriptions) {
			this._subscriptionManager = new Web3SubscriptionManager(
				this.requestManager,
				registeredSubscriptions,
			);
		}

		if (accountProvider) {
			this._accountProvider = accountProvider;
		}

		if (wallet) {
			this._wallet = wallet;
		}
	}

	public get requestManager() {
		return this._requestManager;
	}

	public get subscriptionManager() {
		return this._subscriptionManager;
	}

	public get wallet() {
		return this._wallet;
	}

	public get accountProvider() {
		return this._accountProvider;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static fromContextObject<T extends Web3Context, T3 extends unknown[]>(
		this: Web3ContextConstructor<T, T3>,
		...args: [Web3ContextObject, ...T3]
	) {
		return new this(...(args.reverse() as [...T3, Web3ContextObject]));
	}

	public getContextObject(): Web3ContextObject<API, RegisteredSubs> {
		return {
			config: this.getConfig(),
			provider: this.provider,
			requestManager: this.requestManager,
			subscriptionManager: this.subscriptionManager,
			registeredSubscriptions: this.subscriptionManager
				?.registeredSubscriptions as RegisteredSubs,
			providers: this.providers,
			wallet: this.wallet,
			accountProvider: this.accountProvider,
		};
	}

	/**
	 * Use to create new object of any type extended by `Web3Context`
	 * and link it to current context. This can be used to initiate a global context object
	 * and then use it to create new objects of any type extended by `Web3Context`.
	 */
	public use<T extends Web3Context, T2 extends unknown[]>(
		ContextRef: Web3ContextConstructor<T, T2>,
		...args: [...T2]
	) {
		const newContextChild: T = new ContextRef(
			...([...args, this.getContextObject()] as unknown as [...T2, Web3ContextObject]),
		);

		this.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			newContextChild.setConfig({ [event.name]: event.newValue });
		});

		return newContextChild;
	}

	/**
	 * Link current context to another context.
	 */
	public link<T extends Web3Context>(parentContext: T) {
		this.setConfig(parentContext.getConfig());
		this._requestManager = parentContext.requestManager;
		this.provider = parentContext.provider;
		this._subscriptionManager = parentContext.subscriptionManager;
		this._wallet = parentContext.wallet;
		this._accountProvider = parentContext._accountProvider;

		parentContext.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			this.setConfig({ [event.name]: event.newValue });
		});
	}

	// eslint-disable-next-line no-use-before-define
	public registerPlugin(plugin: Web3PluginBase) {
		// @ts-expect-error No index signature with a parameter of type 'string' was found on type 'Web3Context<API, RegisteredSubs>'
		if (this[plugin.pluginNamespace] !== undefined)
			throw new ExistingPluginNamespaceError(plugin.pluginNamespace);

		const _pluginObject = {
			[plugin.pluginNamespace]: plugin,
		};
		_pluginObject[plugin.pluginNamespace].link(this);
		Object.assign(this, _pluginObject);
	}

	public get provider(): SupportedProviders<API> | string | undefined {
		return this.requestManager.provider;
	}

	public set provider(provider: SupportedProviders<API> | string | undefined) {
		this.requestManager.setProvider(provider);
	}

	public get currentProvider(): SupportedProviders<API> | string | undefined {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders<API> | string | undefined) {
		this.requestManager.setProvider(provider);
	}

	// eslint-disable-next-line class-methods-use-this
	public get givenProvider() {
		return Web3Context.givenProvider;
	}

	public setProvider(provider?: SupportedProviders<API> | string): boolean {
		this.provider = provider;
		return true;
	}

	public get BatchRequest(): new () => Web3BatchRequest {
		return Web3BatchRequest.bind(
			undefined,
			this._requestManager as unknown as Web3RequestManager,
		);
	}
}

// To avoid cycle dependency declare this type in this file
// TODO: When we have `web3-types` package we can share TransactionType
export type TransactionBuilder<API extends Web3APISpec = unknown> = <
	ReturnType = Record<string, unknown>,
>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<API>;
	privateKey?: HexString | Buffer;
}) => Promise<ReturnType>;

/**
 * Extend this class when creating a plugin that either doesn't require {@link EthExecutionAPI},
 * or interacts with a RPC node that doesn't fully implement {@link EthExecutionAPI}.
 *
 * To add type support for RPC methods to the {@link Web3RequestManager},
 * define a {@link Web3APISpec} and pass it as a generic to Web3PluginBase like so:
 *
 * ```ts
 * type CustomRpcApi = {
 *	custom_rpc_method: () => string;
 *	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
 * };
 *
 * class CustomPlugin extends Web3PluginBase<CustomRpcApi> {...}
 * ```
 */
export abstract class Web3PluginBase<
	API extends Web3APISpec = Web3APISpec,
> extends Web3Context<API> {
	public abstract pluginNamespace: string;
}

/**
 * Extend this class when creating a plugin that makes use of {@link EthExecutionAPI},
 * or depends on other Web3 packages (such as `web3-eth-contract`) that depend on {@link EthExecutionAPI}.
 *
 * To add type support for RPC methods to the {@link Web3RequestManager} (in addition to {@link EthExecutionAPI}),
 * define a {@link Web3APISpec} and pass it as a generic to Web3PluginBase like so:
 *
 * ```ts
 * type CustomRpcApi = {
 *	custom_rpc_method: () => string;
 *	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
 * };
 *
 * class CustomPlugin extends Web3PluginBase<CustomRpcApi> {...}
 * ```
 */
export abstract class Web3EthPluginBase<API extends Web3APISpec = unknown> extends Web3PluginBase<
	API & EthExecutionAPI
> {}
