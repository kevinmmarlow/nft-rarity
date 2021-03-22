<template>
  <div class="mb-10 w-full flex justify-between align-end">
    <div class="flex-initial prose">
      <h1>{{ msg }}</h1>
    </div>
    <wallect-connector />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WallectConnector from './WallectConnector.vue'

export default defineComponent({
  components: { WallectConnector },
  props: {
    msg: String,
  },

  setup() {
    return {}
  },
})
</script>
