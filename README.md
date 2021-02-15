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
will instantiate child components on-demand, without enforcing a global Vue.js
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
included and bundled with your code *(only tested with webpack yet)* or used as
a standalone package (e.g. `<script />` tags).

#### Module Builder

```js
import VueCtxInjector from 'vue-ctx-injector'
```

#### Standalone package

```html
<script type="text/javascript" src="/path/to/vue-ctx-injector/vue-ctx-injector.js"></script>
```

You just need to create a new VCI object to start the parsing process.

:warning: Don't forget to start this process only **after** your DOM is fully loaded,
because VCI use HTML elements to instantiate Vue Components.

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

*Note: The Vue package is not automatically included in VCI in order to limit the
bundle size, so you need to inject it manually during instantiation.*

## Configuration

These are the available options you can pass to VCI during initialization.

```js
{
  /**
   * A set of key-value pairs referencing all Vue Components that need to be
   * managed by VCI. Keys are component names, while values are component
   * definitions objects.
   *
   * @type {Object}
   */
  components: {
    // ...
  }
}
```

*More configuration options will be added very soon.*

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

## Contributions

Soon...
