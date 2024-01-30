---
sidebar_position: 0
sidebar_label: Add custom RPC methods
---

# Add custom RPC methods

#### Introduction

Web3.js is a popular library for interacting with the Ethereum blockchain. It provides a set of APIs to interact with Ethereum nodes via JSON-RPC calls. For adding new JSON-RPC function calls to the library, you can do so using the plugin feature in web3.js 4.x. This allows you to extend the functionality of Web3.js and add support for new JSON-RPC methods.

:::caution
In Web3.js 1.x, `web3.extend()` function could be used to add new JSON-RPC methods. `web3.extend()` is also available in Web3 v4.0.4+ with some breaking changes. However it is recommended to use Web3 Plugin feature for extending web3 functionality if you are developing new feature.
:::

Following tutorial will guide you through the process of creating a custom plugin to extend the functionality of web3.js 4.x and add support for new RPC methods.

#### Creating new RPC methods Plugin in 4 Steps

1. First add web3.js as peer dependency in project´s `package.json` and create a TypeScript class for your plugin. This class should extend the `Web3Plugin` class provided by web3.js.

:::info
This will give your plugin access to [requestManager](/api/web3-core/class/Web3Context#requestManager) and [accountProvider](/api/web3-core/class/Web3Context#accountProvider).
:::caution

```ts
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
	// step 1
	// ...
}
```

2. After that add public `pluginNamespace` property. This will be used to access your plugin, as mentioned in step number 5 code example.

```ts
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods'; // step 2
}
```

3. Once plugin class is created using above mentioned steps, its very easy to add new RPC methods like:

```ts
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public async customRpcMethod() {
		// step 3
		return this.requestManager.send({
			// plugin has access to web3.js internal features like request manager
			method: 'custom_rpc_method',
			params: [],
		});
	}
}
```

4. Final step is setting up module [augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation), this will allow you to access plugin on web3 object.

```ts
import { Web3PluginBase } from 'web3';

export default class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public async customRpcMethod() {
		return this.requestManager.send({
			// plugin has access to web3.js internal features like request manager
			method: 'custom_rpc_method',
			params: [],
		});
	}
}

// Module Augmentation
declare module 'web3' {
	// step 4

	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}
```

:::info
After the plugin is ready, it is recommended to publish it on the NPM registry.
:::

#### Using Web3 Custom PRC Plugin (with web3 instance)

5. First add plugin in your plugin consumer project's `package.json`, create web3 and plugin instances, and after that use `.registerPlugin` method with some web3.js module (in following example its registered with main web3).

Once plugin is registered its custom methods will be available to use.

```ts
import { Web3 } from 'web3';
import CustomRpcMethodsPlugin from 'web3-plugin-example';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new CustomRpcMethodsPlugin()); // step 5

web3.customRpcMethods.customRpcMethod();
```

#### More Details of Plugin Feature

For more details follow :

-   [Example Plugin Code](https://github.com/web3/web3.js/tree/4.x/tools/web3-plugin-example)
-   [Web3 Plugin developers Guide](/guides/web3_plugin_guide/plugin_authors)
-   [Web3 Plugin Users Guide](/guides/web3_plugin_guide/plugin_users)
