# [WIP] vue-ctx-injector

## Preamble

*During a complete refactoring of a company's big project, integrating Vue.js to
replace a very old code architecture was almost a necessity to keep a
well-working website.  
The problem was the lack of time to allow to a one-shot refactoring on the
project, and a progressive transition was the only solution.*

*After looking a long time for tools or libraries to progressively integrate
Vue.js components into the project and found no viable packages to do this job,
the choice has been made to create a dedicated package for that.*

## Introduction

VCI is a tiny tool for injecting standalone components with Vue.js context into
basic HTML templates, while keeping them updated by simply manipulating
component-related HTML elements.

It can be assimiled to a customized `App` entrypoint replacement, which
will instanciate child components on-demand, without enforcing a global Vue.js
context.

## Prerequisites

- **Vue v2.6.7** or greater *(Vue 3 not currently supported)*

## Browser compatibility

| Chrome | Firefox | Safari | IE | Edge | Opera |
|:------:|:-------:|:------:|:--:|:----:|:-----:|
| -      | -       | -      | 11 | -    | -     |

## Installation

Soon...
