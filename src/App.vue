<template>
  <div class="justify-center flex-1">
    <div class="container h-screen pt-8 mx-auto">
      <hello-world msg="Connect Wallet to see ETH tokens" />
      <wallect-connector />
      <rarity-table />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import RarityTable from './components/RarityTable.vue'
import WallectConnector from './components/WallectConnector.vue'

export default defineComponent({
  components: {
    HelloWorld,
    RarityTable,
    WallectConnector,
  },
})
</script>
