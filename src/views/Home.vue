<template>
  <div>
    <hello-world :msg="getHeader()" />
    <token-table :data="erc20Tokens" :headers="erc20Headers" />
    <token-table :data="erc721Tokens" :headers="erc721Headers" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'

import HelloWorld from '../components/HelloWorld.vue'
import TokenTable from '../components/TokenTable.vue'
import { globalState } from '../store'

export default defineComponent({
  components: {
    HelloWorld,
    TokenTable,
  },
  setup() {
    const erc20Tokens = toRef(globalState, 'erc20Tokens')
    const erc721Tokens = toRef(globalState, 'erc721Tokens')

    const erc20Headers = [
      { name: 'Name', key: 'name' },
      { name: 'Symbol', key: 'symbol' },
      {
        name: 'Balance',
        key: 'balance',
      },
    ]

    const erc721Headers = [
      { name: 'Name', key: 'name' },
      { name: 'Total Supply', key: 'totalSupply' },
      {
        name: 'Balance',
        key: 'balance',
      },
    ]

    const getHeader = () => {
      if (erc20Tokens.value && erc20Tokens.value.length > 0) {
        return 'ERC-20 token list'
      }

      return 'Connect Wallet to see ERC-20 tokens'
    }

    return {
      erc20Tokens,
      erc20Headers,
      erc721Tokens,
      erc721Headers,
      getHeader,
    }
  },
})
</script>

<style></style>
