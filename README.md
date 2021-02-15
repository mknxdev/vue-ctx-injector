# [WIP] vue-ctx-injector

## Preamble

*During a complete refactoring of a company's big project, integrating Vue.js to
replace a very old code architecture was almost a necessity to keep a
well-working website.  
The problem was the lack of time to allow to a one-shot refactoring on the
project, and a progressive transition was the only solution.*

*After looking a long time for tools or libraries allowing to progressively
integrate Vue.js components into non-Vue project and didn't found viable packages
to do the trick, the choice has been made to create a dedicated package for that.*

## Introduction

VCI is a tiny tool for injecting standalone components with Vue.js context into
basic HTML templates, while keeping them updated by simply manipulating
component-related HTML elements.

It can be assimiled to a customized `main.js` script replacement, which
will instanciate child components on-demand, without enforcing a global Vue.js
context.

## Prerequisites

- **Vue v2.6.8** or greater *(Vue 3 not currently supported)*

## Browser compatibility

Here the minimum browser versions required for this package to work.

**Desktop**

| Chrome | Firefox | Safari | IE | Edge | Opera |
|:------:|:-------:|:------:|:--:|:----:|:-----:|
| 18     | 14      | 6.1    | 11 | 12   | 15    |

**Smartphone/Tablet**

| iOS Safari | Opera Mini | Opera Mobile | Android Browser | Chrome Android | Firefox Android | UC Browser | Samsung | QQ Browser | Baidu | KaiOS |
|:----------:|:----------:|:------------:|:---------------:|:--------------:|:---------------:|:----------:|:-------:|:----------:|:-----:|:-----:|
| 7          | No support | 59           | 4.4             | 88             | 83              | 12.12      | 4       | 10.4       | 7.12  | 2.5   |

## Installation

Via `yarn` or `npm`:

```
npm i vue-ctx-injector
```

```
yarn add vue-ctx-injector
```

## Usage

As VCI uses the [UMD](https://github.com/umdjs/umd) standard, it can be either
included into your code builder *(only tested with webpack yet)* or used as a
standalone package (e.g. `<script />` tags).

### Module Builder (recommended)

This is the preferred method to use this package, as it is the simpliest way to
use it.

Simply importing and instanciating it starts the DOM parsing process.

```js
import Vue from 'vue'
import VueCtxInjector from 'vue-ctx-injector'
import HelloWorld from '@/path/to/your/HelloWorld.vue'

const vci = new VueCtxInjector(Vue, {
  components: {
    HelloWorld,
    // ...
  }
})
```

*Note: The Vue package is not automatically included in order to limit the
bundled script size, so you'll need to inject it manually during instantiation.*

### Standalone package

This package can also be loaded using classic import method:

```html
<script type="text/javascript" src="/path/to/vue-ctx-injector/vue-ctx-injector.js"></script>
```

This implementation is slightly different: as VCI works by parsing the entire
DOM, the instantiation must be started only once the DOM is fully loaded.

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

## Configuration

These are the available options you can pass to VCI during initialization.

```js
{
  /**
   * A set of key-value pairs referencing all Vue Components that need to be
   * managed by VCI. Keys are component names, while values are component
   * definitions objects.
   *
   * @type {Object<VComponent>}
   */
  components: {
    // ...
  }
}
```
