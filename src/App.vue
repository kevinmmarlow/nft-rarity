<template>
  <div>
    <nav class="bg-gray-100 fixed inset-x-0 divide-y divide-gray-300">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
          <div class="flex space-x-4">
            <!-- logo -->
            <div class="flex items-center py-5 px-2">
              <img class="h-8" :src="logo" alt="NFT Rarity" />
            </div>
            <!-- primary nav -->
            <div class="hidden md:flex items-center space-x-1">
              <router-link class="py-5 px-3 font-bold text-gray-700 hover:text-gray-900" to="/"
                >Home</router-link
              >
            </div>
          </div>
          <!-- secondary nav -->
          <div class="hidden md:flex items-center space-x-1">
            <wallect-connector />
          </div>
          <!-- mobile button goes here -->
          <div class="md:hidden flex items-center">
            <button class="mobile-menu-button focus:outline-none" @click.prevent="toggleMobileMenu">
              <img :src="menu" alt="Menu" />
            </button>
          </div>
        </div>
      </div>
      <!-- mobile menu -->
      <div v-show="mobileMenuVisible" class="divide-y divide-gray-300">
        <router-link class="block py-4 px-4 text-lg hover:bg-gray-200" to="/">Home</router-link>
      </div>
    </nav>
    <main class="py-16 max-w-6xl mx-auto px-8">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import logo from './assets/patent_2.svg'
import menu from './assets/menu.svg'
import { defineComponent, ref } from 'vue'
import WallectConnector from './components/WallectConnector.vue'

export default defineComponent({
  components: { WallectConnector },
  setup() {
    const mobileMenuVisible = ref(false)

    const toggleMobileMenu = () => {
      mobileMenuVisible.value = !mobileMenuVisible.value
    }

    return { logo, menu, mobileMenuVisible, toggleMobileMenu }
  },
})
</script>
