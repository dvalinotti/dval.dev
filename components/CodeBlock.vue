<template>
  <div class="prism">
    <div class="prism-bar">
      <span class="filename">{{ filename }}</span>
      <div class="btn-group">
        <span class="btn-group-item red"></span>
        <span class="btn-group-item yellow"></span>
        <span class="btn-group-item green"></span>
      </div>
    </div>
    <pre
      class="line-numbers"
      :class="`language-${lang}`"
      :data-line="highlightLines"
    >
      <code>
        <slot></slot>
      </code>
    </pre>
  </div>
</template>

<script>
import Prism from 'prismjs'

import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'

import 'prismjs/plugins/highlight-keywords/prism-highlight-keywords'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'

export default {
  props: {
    lang: {
      type: String,
      default: 'js'
    },
    filename: {
      type: String,
      default: 'index.js'
    },
    highlightLines: {
      type: String,
      default: ''
    }
  },
  mounted() {
    Prism.highlightAll()
  }
}
</script>

<style lang="scss">
div.prism {
  position: relative;
  margin-top: 3.5em;
  z-index: 0;

  pre[class*='language-'].line-numbers {
    padding-left: 1em;

    > .line-highlight {
      margin-top: 0.9em;
    }
  }

  > pre {
    border-radius: 0 0 0.5em 0.5em;
    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.125);
    position: relative;
    overflow-y: visible;
  }

  .prism-bar {
    position: absolute;
    top: -2.5em;
    left: 0;
    z-index: -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: 0.5em;
    padding-bottom: 1em;
    border-radius: 0.5em;
    background: rgb(51, 61, 75);

    > span.filename {
      color: white;
      font-size: 0.875em;
      font-weight: bold;
    }

    > .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      .btn-group-item {
        width: 12px;
        height: 12px;
        border-radius: 100%;
        border-width: 1px;
        border-style: solid;
        margin-left: 0.5rem;

        &.red {
          background-color: #ff6058;
          border-color: #e24940;
        }
        &.yellow {
          background-color: #ffbd2e;
          border-color: #e2a221;
        }
        &.green {
          background-color: #29ca41;
          border-color: #16ae2e;
        }
      }
    }
  }
}
</style>
