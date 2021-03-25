<template>
  <div class="mb-10">
    <h1 class="font-extrabold text-4xl">{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  props: {
    msg: String,
  },

  setup() {
    return {}
  },
})
</script>
