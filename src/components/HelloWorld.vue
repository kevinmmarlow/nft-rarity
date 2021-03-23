<template>
  <div class="mb-10 w-full flex justify-between align-end space-x-10">
    <div class="flex-initial prose">
      <h1>{{ msg }}</h1>
    </div>
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
