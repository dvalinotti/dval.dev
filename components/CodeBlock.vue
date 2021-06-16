<template>
  <div class="prism">
    <span class="filename">{{ filename }}</span>
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

<style lang="scss" scoped>
.prism {
  position: relative;
  margin-top: 3em;
  z-index: 0;

  > pre {
    border-radius: 0 0 0.5em 0.5em;
    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.125);
    position: relative;
    overflow-y: visible;
  }

  > span.filename {
    position: absolute;
    top: -2.5em;
    left: 0;
    z-index: -1;
    background: rgb(51, 61, 75);
    color: white;
    font-size: 0.875em;
    width: 100%;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: 0.5em;
    padding-bottom: 1em;
    border-radius: 0.5em;
  }
}
</style>
