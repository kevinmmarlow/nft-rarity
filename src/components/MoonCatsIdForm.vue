<template>
  <div v-if="showing" class="flex items-center justify-center">
    <div class="w-full bg-white shadow-lg rounded max-w-xlg">
      <div class="flex p-8">
        <form class="flex-none px-8 pt-6 pb-8 mb-4" @submit.prevent="handleSubmit">
          <div class="mb-6 text-gray-600 text-lg font-bold">
            Fill in one of the fields and press convert.
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="original">
              Original ID
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="original"
              v-model="original"
              type="text"
              placeholder="Original ID"
            />
          </div>
          <div class="mb-14">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="wrapped">
              Wrapped ID
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="wrapped"
              v-model="wrapped"
              type="text"
              placeholder="Wrapped ID"
            />
          </div>
          <div class="flex flex-col">
            <button
              :disabled="loading"
              class="inline-flex items-center mx-auto leading-6 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <svg
                v-show="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Convert
            </button>
          </div>
        </form>
        <div
          class="flex-grow flex flex-col mid-width-300 space-y-1 items-center justify-center p-10 text-gray-800"
        >
          <img class="mb-10" :src="imageSrc" />

          <div v-if="saleRef">{{ saleRef }}</div>
          <div v-if="priceRef">{{ priceRef }}</div>
          <div v-if="linkRef">
            <a
              class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              :href="linkRef"
              >Go to Opensea</a
            >
          </div>
          <div v-if="result">{{ result }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  getBlock,
  getOpenSeaAsset,
  getOriginalId,
  getWrappedId,
  parseOpenSeaResponse,
} from '../api/etherscan'

const getOriginalImageSource = (originalId: string): string => {
  const patt = originalId.substring(4, 6)
  return `https://gateway.pinata.cloud/ipfs/bafybeihc3a4k4ybjduese6ipsxqg4rvlissts7obtuajffj4nmgraizqcy/${patt}/${originalId}.svg`
}

export interface EtherscanResult {
  status: string
  message: string
  result: Result[]
}

export interface Result {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  timeStamp: string
  gasPrice: string
  gasUsed: string
  logIndex: string
  transactionHash: string
  transactionIndex: string
}

const parseGetWrappedIdResponse = (data: EtherscanResult) => {
  let wrapID = data.result[0].data
  wrapID = wrapID.substring(2)
  wrapID = wrapID.replace(/\b0+/g, '')
  wrapID = parseInt(wrapID, 16).toString()
  return wrapID
}

const parseGetOriginalIdResponse = (data: EtherscanResult): string => {
  let block = data.result[0].blockNumber
  block = block.substring(2)
  block = parseInt(block, 16).toString()
  return block
}

const parseBlockResponse = (data: EtherscanResult, hex: string) => {
  const id = data.result.findIndex((r) => r.data === hex)
  let idOrig = data.result[id].topics[1]
  idOrig = idOrig.substring(0, 12)
  return idOrig
}

const wrappedIdToHex = (wrappedId: string): string => {
  const hexWrapped = parseInt(wrappedId).toString(16)
  const hex =
    '0x' +
    `0000000000000000000000000000000000000000000000000000000000000000${hexWrapped}`.slice(-64)
  return hex
}

const getLinks = async (originalId: string, wrappedId: string) => {
  const openSeaResponse = await getOpenSeaAsset(wrappedId)
  const { saleText, priceText } = parseOpenSeaResponse(openSeaResponse.data)
  const link =
    'https://opensea.io/assets/0x7c40c393dc0f283f318791d746d894ddd3693572/' +
    wrappedId +
    '?ref=0x8d489939132bfc1169d71e1c5c58e90eaa1f1122'

  const imgSrc = getOriginalImageSource(originalId)
  return {
    saleText,
    priceText,
    linkText: link,
    imageSource: imgSrc,
  }
}

export default defineComponent({
  props: {
    showing: Boolean,
  },
  setup() {
    const original = ref('')
    const wrapped = ref('')
    const result = ref('')
    const imageSrc = ref<string>()
    const saleRef = ref<string>()
    const priceRef = ref<string>()
    const linkRef = ref<string>()
    const loading = ref(false)

    const handleSubmit = async () => {
      loading.value = true
      if (original.value) {
        const response = await getWrappedId(original.value)
        imageSrc.value = getOriginalImageSource(original.value)

        if (response.status !== 200 || (response.status === 200 && response.data.status === '0')) {
          result.value = 'not found or wrapped'
        } else {
          const data = response.data
          const wrappedId = parseGetWrappedIdResponse(data)
          wrapped.value = wrappedId
          const { saleText, priceText, linkText, imageSource } = await getLinks(
            original.value,
            wrappedId
          )
          saleRef.value = saleText
          priceRef.value = priceText
          linkRef.value = linkText
          imageSrc.value = imageSource
          loading.value = false
        }
      } else if (wrapped.value) {
        const response = await getOriginalId(wrappedIdToHex(wrapped.value))
        if (response.status !== 200 || (response.status === 200 && response.data.status === '0')) {
          result.value = 'not found or wrapped'
        } else {
          const data = response.data
          const block = parseGetOriginalIdResponse(data)
          const blockResponse = await getBlock(block)
          if (
            blockResponse.status !== 200 ||
            (blockResponse.status === 200 && blockResponse.data.status === '0')
          ) {
            result.value = 'not found or wrapped'
          } else {
            const data = blockResponse.data
            const originalId = parseBlockResponse(data, wrappedIdToHex(wrapped.value))
            original.value = originalId
            const { saleText, priceText, linkText, imageSource } = await getLinks(
              originalId,
              wrapped.value
            )
            saleRef.value = saleText
            priceRef.value = priceText
            linkRef.value = linkText
            imageSrc.value = imageSource
            loading.value = false
          }
        }
      } else {
        loading.value = false
      }
    }

    return {
      handleSubmit,
      original,
      wrapped,
      result,
      imageSrc,
      saleRef,
      priceRef,
      linkRef,
      loading,
    }
  },
})
</script>

<style>
.mid-width-300 {
  min-width: 300px;
}
</style>
