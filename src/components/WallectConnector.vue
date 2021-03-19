<template>
  <div v-if="hasConnectableWallet" class="m-10 text-center">
    <button v-if="!wallet" class="btn btn-indigo" @click="connectWallet">Connect Wallet</button>
    <div class="font-bold py-2 px-4 rounded-md shadow border border-indigo-500 prose-sm" v-else>
      <h3>{{ wallet.address }}</h3>
      <p>{{ wallet.balance }} ETH</p>
    </div>
  </div>
  <div v-else class="m-10 btn text-center">No Connectable Wallet</div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { globalState } from '../store'
import {
  hasConnectableWallet,
  readAddress,
  readBalance,
  lookupAddress,
  enableProvider,
} from '../helpers/crypto'

export default defineComponent({
  setup() {
    const wallet = toRef(globalState, 'wallet')

    const connectWallet = async () => {
      const provider = await enableProvider()
      const address = readAddress()
      wallet.value = address
      const balance = (await readBalance(provider, address)) || ''
      wallet.value = { address, balance }
      const addressName = await lookupAddress(provider, address)
      wallet.value = { address: addressName, balance }
    }

    return {
      wallet,
      connectWallet,
      hasConnectableWallet,
    }
  },
})
</script>

<style></style>
