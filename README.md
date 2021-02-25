# Vue Context Injector

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Browser compatibility](#browser-compatibility)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [HTML-based standalone components](#html-based-standalone-components)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Licensing](#licensing)
- [Contribute](#contribute)

## Introduction

VCI is a tool that allows you to inject standalone Vue.js components with their
contexts into simple HTML templates.  
It can be assimiled to a customized entrypoint which allows you to instantiate
components on-demand directly on simple templates, without enforcing a global
Vue.js context on your webpage.

## Prerequisites

- **Vue v2.6.8** or greater *(Vue 3 not currently supported)*

## Browser compatibility

Here are the minimum browser versions required for this package to work.

**Desktop**

| Chrome | Firefox | Safari | IE | Edge | Opera |
|:------:|:-------:|:------:|:--:|:----:|:-----:|
| 18     | 14      | 6.1    | 11 | 12   | 15    |

**Smartphone/Tablet**

| iOS Safari | Opera Mini | Opera Mobile | Android Browser | Chrome Android | Firefox Android | UC Browser | Samsung | QQ Browser | Baidu | KaiOS |
|:----------:|:----------:|:------------:|:---------------:|:--------------:|:---------------:|:----------:|:-------:|:----------:|:-----:|:-----:|
| 7          | No support | 59           | 4.4             | 88             | 83              | 12.12      | 4       | 10.4       | 7.12  | 2.5   |

## Installation

Via `npm` or `yarn`:

```
npm i vue-ctx-injector --save
```

```
yarn add vue-ctx-injector
```

## Usage

### Initialization

As VCI uses the [UMD](https://github.com/umdjs/umd) standard, it can be either
used as a module *(only tested with webpack yet)* or as a standalone package
(e.g. `<script />` tags).

#### Module Builder

```js
import VueCtxInjector from 'vue-ctx-injector'
```

#### Standalone package

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-ctx-injector@1.2.0/dist/vue-ctx-injector.js"></script>
```

You just need to instantiate a new VCI object to start the parsing process.  
Pass your Vue instance as first argument and a configuration object as second
argument:

```js
document.addEventListener('DOMContentLoaded', () => {

  const vci = new VueCtxInjector(Vue, {
    components: {
      HelloWorld,
      // ...
    }
  })

})
```

*As VCI uses HTML elements to get component informations and instantiate them,
don't forget to launch the parsing only after these elements are mounted to
the DOM.*

**Important:** This tool only works with
[Local Registered Components](https://vuejs.org/v2/guide/components-registration.html).

### HTML-based standalone components

#### Syntax

To tell VCI which HTML elements must be targeted for injecting Vue components,
a special attributes-based syntax must be used. These attributes are used
to identify the Vue component and pass data to it.

```html
<div
  data-v-comp="HelloWorld"
  data-v:name="Jack"
  data-v:age="28"
></div>
```

This syntax must be used to let VCI knows which elements it needs to use and
how. By default, `data-v-comp` must be used to reference the component name
while `data-v:<propname>` is used to pass props data to the component
(`<propname>` is the **kebab-case** version of the component prop name).

These prefixes can be customized (except for the `data-` part) at
initialization. See the [Configuration](#configuration) section for more
informations.

#### Reactivity

Every component instantiated using VCI is watched for attributes updates,
and these changes also update component data.

This way you can easily initiate components' updates from outside scripts.

## Configuration

These are the available options you can pass to VCI during initialization.

*Values indicated below for optional options are used as internal default
values.*

```js
{
  /**
   * A set of key-value pairs referencing all Vue Components that need to be
   * managed by VCI. Keys are component names, while values are component
   * definitions objects.
   *
   * @required
   * @type {Object}
   */
  components: { /* ... */ },

  /**
   * Determines the mounting strategy for standalone components.
   * - `true`: the original HTML element will be merged with the component root
   * element (the component root element's type takes precedence and replaces
   * the original type).
   * - `false`: the component root element is simply injected as a child element
   * of the original HTML element.
   *
   * Note: Root element's `id` and `class` attributes values are preserved after
   * rendering.
   *
   * @optional
   * @type {Boolean}
   *
   * @version [1.1.0]
   */
  replaceRoot: true,

  /**
   * Defines the prefix to use as custom attributes name to reference Vue
   * components.
   *
   * Note: This prefix must be used in addition to the classic `data-`
   * standard prefix.
   * By default, the full prefix name for component reference is `data-v-comp`.
   *
   * @optional
   * @type {String}
   *
   * @version [1.1.0]
   */
  componentPrefix: 'v-comp',

  /**
   * Defines the prefix to use as custom attributes name for Vue component
   * props' binding.
   *
   * Note: This prefix must be used in addition to the classic `data-`
   * standard prefix.
   * By default, the full prefix name for props is `data-v:<propname>`.
   *
   * @optional
   * @type {String}
   *
   * @version [1.1.0]
   */
  propPrefix: 'v:',
}
```

## API Reference

These methods are callable directly on the VCI instance.

```js
.parse()
```

Starts a new DOM parsing. Useful to instantiate newly added
HTML customized elements ("standalone components") after VCI instance creation.

**Arguments**: -

*[Version: 1.2.0]*

## Licensing

Released under the [MIT](https://opensource.org/licenses/MIT) license.

## Contribute

Soon...
