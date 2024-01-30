import { Web3APISpec } from 'web3-common';
import { HexString } from 'web3-utils';
import { SupportedProviders } from './types';
import { isSupportedProvider } from './utils';
// eslint-disable-next-line import/no-cycle
import { Web3Config, Web3ConfigEvent, Web3ConfigOptions } from './web3_config';
import { Web3RequestManager } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';
import { Web3SubscriptionManager } from './web3_subscription_manager';

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextObject<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends Web3APISpec = any,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> = {
	config: Web3ConfigOptions;
	provider: SupportedProviders<API>;
	requestManager: Web3RequestManager<API>;
	subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs> | undefined;
	registeredSubscriptions?: RegisteredSubs;
	providers: typeof Web3RequestManager.providers;
};

export type Web3ContextInitOptions<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends Web3APISpec = any,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> = {
	config?: Partial<Web3ConfigOptions>;
	provider: SupportedProviders<API>;
	requestManager?: Web3RequestManager<API>;
	subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs> | undefined;
	registeredSubscriptions?: RegisteredSubs;
};

export type Web3ContextConstructor<
	// eslint-disable-next-line no-use-before-define, @typescript-eslint/no-explicit-any
	T extends Web3Context<any>,
	T2 extends unknown[],
> = new (...args: [...extras: T2, context: Web3ContextObject]) => T;

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextFactory<
	// eslint-disable-next-line no-use-before-define, @typescript-eslint/no-explicit-any
	T extends Web3Context<any>,
	T2 extends unknown[],
> = Web3ContextConstructor<T, T2> & {
	fromContextObject(this: Web3ContextConstructor<T, T2>, contextObject: Web3ContextObject): T;
};

export class Web3Context<
	API extends Web3APISpec,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = any,
> extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders<never>;
	public readonly providers = Web3RequestManager.providers;
	private _requestManager: Web3RequestManager<API>;
	private _subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs>;

	public constructor(
		providerOrContext: SupportedProviders<API> | Web3ContextInitOptions<API, RegisteredSubs>,
	) {
		super();

		if (
			typeof providerOrContext === 'string' ||
			isSupportedProvider(providerOrContext as SupportedProviders<API>)
		) {
			this._requestManager = new Web3RequestManager<API>(
				providerOrContext as SupportedProviders<API>,
			);

			return;
		}

		const { config, provider, requestManager, subscriptionManager, registeredSubscriptions } =
			providerOrContext as Partial<Web3ContextObject<API, RegisteredSubs>>;

		this.setConfig(config ?? {});

		this._requestManager = requestManager ?? new Web3RequestManager<API>(provider);

		if (subscriptionManager) {
			this._subscriptionManager = subscriptionManager;
		} else if (registeredSubscriptions) {
			this._subscriptionManager = new Web3SubscriptionManager(
				this.requestManager,
				registeredSubscriptions,
			);
		}
	}

	public get requestManager() {
		return this._requestManager;
	}

	public get subscriptionManager() {
		return this._subscriptionManager;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static fromContextObject<T extends Web3Context<any>, T3 extends unknown[]>(
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
		};
	}

	/**
	 * Use to create new object of any type extended by `Web3Context`
	 * and link it to current context. This can be used to initiate a global context object
	 * and then use it to create new objects of any type extended by `Web3Context`.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public use<T extends Web3Context<any>, T2 extends unknown[]>(
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
	public link<T extends Web3Context<API, RegisteredSubs>>(parentContext: T) {
		this.setConfig(parentContext.getConfig());
		this._requestManager = parentContext.requestManager;
		this.provider = parentContext.provider;
		this._subscriptionManager = parentContext.subscriptionManager;

		parentContext.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			this.setConfig({ [event.name]: event.newValue });
		});
	}

	public get provider(): SupportedProviders<API> {
		return this.requestManager.provider;
	}

	public set provider(provider: SupportedProviders<API>) {
		this.requestManager.setProvider(provider);
	}

	public get currentProvider(): SupportedProviders<API> {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders<API>) {
		this.requestManager.setProvider(provider);
	}
}

// To avoid cycle dependency declare this type in this file
// TODO: When we have `web3-types` package we can share TransactionType
export type TransactionBuilder<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends Web3APISpec = any,
> = <ReturnType = Record<string, unknown>>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<API>;
	privateKey?: HexString | Buffer;
}) => Promise<ReturnType>;
