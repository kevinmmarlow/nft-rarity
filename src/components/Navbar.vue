<template>
  <!-- navbar -->
  <nav class="fixed inset-x-0 top-0 bg-gray-100">
    <div class="px-8 xl:max-w-6xl mx-auto">
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <!-- logo -->
          <div>
            <router-link
              class="flex items-center px-2 py-5 text-gray-700 hover:text-gray-900"
              to="/"
            >
              <img class="h-8 mr-2" :src="logo" alt="NFT Rarity" />
              <span class="font-bold">NFT Rarity</span>
            </router-link>
          </div>

          <!-- primary nav -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link class="px-3 py-5 text-gray-700 hover:text-gray-900" to="/crypto-punks"
              >CryptoPunks</router-link
            >
            <router-link class="px-3 py-5 text-gray-700 hover:text-gray-900" to="/moon-cats"
              >Moon Cats</router-link
            >
          </div>
        </div>

        <!-- secondary nav -->
        <div class="hidden md:flex items-center space-x-1">
          <wallect-connector class="px-3" />
        </div>

        <!-- mobile menu button -->
        <div class="md:hidden flex items-center">
          <button class="focus:outline-none" @click.prevent="toggleMobileMenu">
            <img class="w-6 h-6" :src="menu" alt="Menu" />
          </button>
        </div>
      </div>
    </div>

    <!-- mobile menu -->
    <div v-show="mobileMenuVisible" class="md:hidden bg-gray-100">
      <router-link
        class="block py-4 px-8 text-lg hover:bg-gray-200 active:bg-gray-400"
        to="/crypto-punks"
        >CryptoPunks</router-link
      >
      <router-link
        class="block py-4 px-8 text-lg hover:bg-gray-200 active:bg-gray-400"
        to="/moon-cats"
        >Moon Cats</router-link
      >
    </div>
  </nav>
</template>

<script lang="ts">
import logo from '../assets/patent_2.svg'
import menu from '../assets/menu.svg'
import WallectConnector from './WallectConnector.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { WallectConnector },
  setup() {
    const mobileMenuVisible = ref(false)

    const toggleMobileMenu = () => {
      mobileMenuVisible.value = !mobileMenuVisible.value
    }

    return {
      logo,
      menu,
      mobileMenuVisible,
      toggleMobileMenu,
    }
  },
})
</script>

<style></style>
