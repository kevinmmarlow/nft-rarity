<template>
  <div v-if="hasConnectableWallet" class="text-center">
    <button v-if="!wallet" class="btn btn-indigo" @click="connectWallet">Connect Wallet</button>
    <div class="font-bold py-2 px-4 rounded-md shadow border border-indigo-500 prose-sm" v-else>
      <h3>{{ wallet.address }}</h3>
      <p>{{ `${wallet.balance} ETH` }}</p>
    </div>
  </div>
  <div v-else class="m-10 btn text-center">No Connectable Wallet</div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { globalState, TokenRow } from '../store'
import {
  hasConnectableWallet,
  readAddress,
  readBalance,
  lookupAddress,
  enableProvider,
} from '../helpers/crypto'
import { ethers } from 'ethers'
import tokenJson from '../assets/tokens.json'

export default defineComponent({
  setup() {
    const wallet = toRef(globalState, 'wallet')
    const tokenData = toRef(globalState, 'tokenData')

    const connectWallet = async () => {
      const provider = await enableProvider()
      const address = readAddress()
      wallet.value = { address, balance: '' }
      const balance = (await readBalance(provider, address)) || ''
      wallet.value = { address, balance }
      const addressName = await lookupAddress(provider, address)
      wallet.value = { address: addressName, balance }
      readTokens(provider, address)
    }

    const readTokens = async (provider: ethers.providers.BaseProvider, owner: string) => {
      const abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
      ]

      const promises = tokenJson.map((data) => {
        return new Promise<TokenRow>(async (resolve, reject) => {
          try {
            const contract = new ethers.Contract(data.address, abi, provider)
            const rawBalance = await contract.balanceOf(owner)
            if (ethers.utils.hexValue(rawBalance) === '0x0') {
              reject('No balance')
            }

            const balance = parseFloat(ethers.utils.formatUnits(rawBalance, data.decimals || 18))
            resolve({
              rawBalance,
              symbol: data.symbol,
              name: data.name,
              balance: balance.toFixed(4),
            })
          } catch (err) {
            console.error(err)
            reject(err)
          }
        })
      })
      const tokenBalances = await Promise.allSettled(promises)
      const pureBalances = tokenBalances
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value as TokenRow)

      tokenData.value = pureBalances as Array<TokenRow>
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
