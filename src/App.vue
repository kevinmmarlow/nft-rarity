<template>
  <div class="py-16">
    <navbar />
    <main class="pt-8 max-w-6xl mx-auto px-8">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  components: { Navbar, RouterView },
  setup() {
    return {}
  },
})
</script>
