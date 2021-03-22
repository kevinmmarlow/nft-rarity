<template>
  <div class="justify-center flex-1">
    <div class="container h-screen pt-8 mx-auto">
      <hello-world msg="Connect Wallet to see ERC-20 tokens" />
      <token-table />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import TokenTable from './components/TokenTable.vue'

export default defineComponent({
  components: {
    HelloWorld,
    TokenTable,
  },
})
</script>
