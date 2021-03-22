<template>
  <div class="justify-center flex-1">
    <div class="container h-screen pt-8 mx-auto">
      <hello-world msg="Connect Wallet to see ERC-20 tokens" />
      <token-table :data="erc20Tokens" :headers="erc20Headers" />
      <token-table :data="erc721Tokens" :headers="erc721Headers" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import TokenTable from './components/TokenTable.vue'
import { globalState } from './store'

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

    return {
      erc20Tokens,
      erc20Headers,
      erc721Tokens,
      erc721Headers,
    }
  },
})
</script>
