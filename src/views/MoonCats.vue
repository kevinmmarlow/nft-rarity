<template>
  <div class="mb-10">
    <h1 class="font-extrabold text-4xl">Moon Cats</h1>

    <div class="m-16 btn btn-indigo max-w-sm" @click="showModal = !showModal">Find by ID</div>

    <moon-cats-id-form :showing="showModal" @close="showModal = false" />
  </div>
</template>

<script lang="ts">
import MoonCatsIdForm from '../components/MoonCatsIdForm.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { MoonCatsIdForm },
  setup() {
    const showModal = ref(false)

    return {
      showModal,
    }
  },
})
</script>

<style></style>
