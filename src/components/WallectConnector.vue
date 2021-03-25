<template>
  <div v-if="hasConnectableWallet" class="text-center">
    <button v-if="!wallet" class="btn btn-indigo transition duration-300" @click="connectWallet">
      Connect Wallet
    </button>
    <div
      class="flex space-x-4 py-1 px-4 rounded-md border border-indigo-500 bg-gray-200 text-md"
      v-else
    >
      <h3>{{ wallet.address }}</h3>
      <p>{{ `${wallet.balance} ETH` }}</p>
    </div>
  </div>
  <div v-else class="m-10 btn text-center">No Connectable Wallet</div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { globalState, Erc20Token, Erc721Token } from '../store'
import {
  hasConnectableWallet,
  readAddress,
  readBalance,
  lookupAddress,
  enableProvider,
} from '../helpers/crypto'
import { ethers } from 'ethers'
import erc20TokenJson from '../assets/erc20_tokens.json'
import erc721TokenJson from '../assets/erc721_tokens.json'

export default defineComponent({
  setup() {
    const wallet = toRef(globalState, 'wallet')
    const erc20Tokens = toRef(globalState, 'erc20Tokens')
    const erc721Tokens = toRef(globalState, 'erc721Tokens')

    const connectWallet = async () => {
      const provider = (await enableProvider()) as ethers.providers.JsonRpcProvider
      const address = await readAddress(provider)
      if (!address) {
        window.alert('Cannot read wallet address!')
        return
      }

      wallet.value = { address, balance: '' }
      let balance = await readBalance(provider, address)
      balance = balance || ''
      wallet.value = { address, balance }
      const addressName = await lookupAddress(provider, address)
      if (addressName) {
        wallet.value = { address: addressName, balance }
      }
      readErc20Tokens(provider, address)
      readErc721Tokens(provider, address)
    }

    const readErc20Tokens = async (provider: ethers.providers.BaseProvider, owner: string) => {
      const abi = ['function balanceOf(address owner) view returns (uint256)']

      const promises = erc20TokenJson.map((data) => {
        return new Promise<Erc20Token>(async (resolve, reject) => {
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
            console.error(data.symbol, err)
            reject(err)
          }
        })
      })
      const tokenBalances = await Promise.allSettled(promises)
      const pureBalances = tokenBalances
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<Erc20Token>).value as Erc20Token)

      erc20Tokens.value = pureBalances as Array<Erc20Token>
    }

    const readErc721Tokens = async (provider: ethers.providers.BaseProvider, owner: string) => {
      const abi = [
        'function totalSupply() view returns (uint256)',
        'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
        'function balanceOf(address owner) view returns (uint256)',
      ]

      const promises = erc721TokenJson.map((data) => {
        return new Promise<Erc721Token>(async (resolve, reject) => {
          try {
            const contract = new ethers.Contract(data.address, abi, provider)
            const totalSupply = await contract
              .totalSupply()
              .then((result: ethers.BigNumber) => (result ? result.toString() : 0))
            const balance = await contract
              .balanceOf(owner)
              .then((result: ethers.BigNumber) => (result ? result.toString() : 0))

            resolve({
              name: data.name,
              balance,
              totalSupply,
            })
          } catch (err) {
            console.error(data.name, err)
            reject(err)
          }
        })
      })
      const tokenBalances = await Promise.allSettled(promises)
      const pureBalances = tokenBalances
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<Erc721Token>).value as Erc721Token)

      let withBalances = pureBalances.filter((item) => item.balance !== '0')
      if (withBalances.length === 0) {
        withBalances = pureBalances.slice(0, 10)
      }

      erc721Tokens.value = withBalances as Array<Erc721Token>
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
