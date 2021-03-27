<template>
  <div v-if="showing" class="flex items-center justify-center">
    <div class="w-full border bg-white shadow-lg rounded max-w-xlg">
      <div class="float-right text-gray-300 text-xl">
        <button class="px-6 py-4" @click.prevent="handleClose">X</button>
      </div>
      <div class="flex p-8">
        <form class="flex-none px-8 pt-6 pb-8 mb-4" @submit.prevent="handleSubmit">
          <div class="mb-6 text-gray-600 text-lg font-bold">Fill in the hex or wrapped ID.</div>
          <div class="mb-10">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="mooncat-id">
              MoonCat ID
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mooncat-id"
              v-model="mooncatId"
              type="text"
              placeholder="Ex. 0x00b3dff061 or 1234"
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
              Find that Cat
            </button>
          </div>
        </form>
        <div
          class="flex-grow flex flex-col mid-width-300 space-y-1 items-center justify-center text-gray-800"
        >
          <img v-if="imageSrc" class="mb-10 moon-cat-image" :src="imageSrc" />
          <div
            v-else
            class="moon-cat-image-placeholder rounded rounded-lg border-2 border-gray-100 flex items-center"
          >
            <span class="text-gray-100 text-5xl font-bold text-center w-full">?</span>
          </div>

          <div v-if="original">Original ID: {{ original }}</div>
          <div v-if="wrapped">Wrapped ID: #{{ wrapped }}</div>
          <div v-if="saleRef">{{ saleRef }}</div>
          <div v-if="priceRef">{{ priceRef }}</div>
          <div v-if="linkRef">
            <a
              class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              :href="linkRef"
              target="_blank"
              rel="noopener noreferrer"
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
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { getBlock, getOpenSeaAsset, getOriginalId, getWrappedId } from '../api/etherscan'

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

const parseGetWrappedIdResponse = (data: EtherscanResult): string => {
  if (!data.result || data.result.length === 0) throw 'No result'

  let wrapID = data.result[0].data
  wrapID = wrapID.substring(2)
  wrapID = wrapID.replace(/\b0+/g, '')
  wrapID = parseInt(wrapID, 16).toString()
  return wrapID
}

const parseGetOriginalIdResponse = (data: EtherscanResult): string => {
  if (!data.result || data.result.length === 0) throw 'No result'

  let block = data.result[0].blockNumber
  block = block.substring(2)
  block = parseInt(block, 16).toString()
  return block
}

const parseBlockResponse = (data: EtherscanResult, hex: string) => {
  if (!data.result || data.result.length === 0) throw 'No result'

  const id = data.result.findIndex((r) => r.data === hex)
  const match = data.result[id]
  if (!match.topics || match.topics.length < 2) throw 'No topics'

  let idOrig = match.topics[1]
  idOrig = idOrig.substring(0, 12)
  return idOrig
}

const parseOpenSeaResponse = (data: any) => {
  let saleText = 'Last sale: N/A'

  if (data.last_sale) {
    const price = (parseInt(data.last_sale.total_price) / 10 ** 18).toFixed(2)
    saleText = `Last sale: ${price} ${data.last_sale.payment_token.symbol}`
  }

  let priceText = 'Price: Not on sale'
  if (!data.orders) {
    return { saleText, priceText }
  }

  const ownerData = data.orders.find((order) => order.maker.address === data.owner.address)

  if (ownerData) {
    const currentPrice = (parseInt(ownerData.current_price) / 10 ** 18).toFixed(2)
    priceText = `Price: ${currentPrice} ETH`
  }

  return {
    saleText,
    priceText,
  }
}

const wrappedIdToHex = (wrappedId: string): string => {
  const hexWrapped = parseInt(wrappedId).toString(16)
  const hex =
    '0x' +
    `0000000000000000000000000000000000000000000000000000000000000000${hexWrapped}`.slice(-64)
  return hex
}

const getPriceInfo = async (wrappedId: string) => {
  const openSeaResponse = await getOpenSeaAsset(wrappedId)
  const { saleText, priceText } = parseOpenSeaResponse(openSeaResponse.data)
  const link =
    'https://opensea.io/assets/0x7c40c393dc0f283f318791d746d894ddd3693572/' +
    wrappedId +
    '?ref=0x8d489939132bfc1169d71e1c5c58e90eaa1f1122'

  return {
    saleText,
    priceText,
    linkText: link,
  }
}

const matchesWrappedIdPattern = (value: string) => {
  return value.match(/^[0-9]+$/)
}

const matchesOriginalIdPattern = (value: string) => {
  return value.match(/^0[xX][0-9a-fA-F]+$/)
}

export default defineComponent({
  props: {
    showing: Boolean,
  },
  emits: ['close'],
  setup(_, { emit }) {
    const mooncatId = ref<string>()
    const original = ref<string>()
    const wrapped = ref<string>()
    const result = ref<string>()
    const imageSrc = ref<string>()
    const saleRef = ref<string>()
    const priceRef = ref<string>()
    const linkRef = ref<string>()
    const loading = ref(false)

    const handleSubmit = async () => {
      result.value = ''
      imageSrc.value = undefined
      original.value = undefined
      wrapped.value = undefined
      saleRef.value = undefined
      priceRef.value = undefined
      linkRef.value = undefined

      if (mooncatId.value) {
        loading.value = true
        const currentId = mooncatId.value
        if (matchesWrappedIdPattern(currentId)) {
          const { status, data } = await getOriginalId(wrappedIdToHex(currentId))
          if (status !== 200 || (status === 200 && data.status === '0')) {
            result.value = 'not found or wrapped'
            loading.value = false
          } else {
            const block = parseGetOriginalIdResponse(data)
            const blockResponse = await getBlock(block)
            if (
              blockResponse.status !== 200 ||
              (blockResponse.status === 200 && blockResponse.data.status === '0')
            ) {
              result.value = 'not found or wrapped'
              loading.value = false
            } else {
              const data = blockResponse.data
              const originalId = parseBlockResponse(data, wrappedIdToHex(currentId))
              const { saleText, priceText, linkText } = await getPriceInfo(currentId)

              original.value = originalId
              wrapped.value = currentId
              imageSrc.value = getOriginalImageSource(originalId)
              saleRef.value = saleText
              priceRef.value = priceText
              linkRef.value = linkText
              loading.value = false
            }
          }
        } else if (matchesOriginalIdPattern(currentId)) {
          const { status, data } = await getWrappedId(currentId)

          if (status !== 200 || (status === 200 && data.status === '0')) {
            result.value = 'not found or wrapped'
            loading.value = false
          } else {
            const wrappedId = parseGetWrappedIdResponse(data)
            const { saleText, priceText, linkText } = await getPriceInfo(wrappedId)

            original.value = currentId
            wrapped.value = wrappedId
            imageSrc.value = getOriginalImageSource(currentId)
            saleRef.value = saleText
            priceRef.value = priceText
            linkRef.value = linkText
            loading.value = false
          }
        } else {
          result.value = 'ID does not match an ID format.'
          loading.value = false
        }
      }
    }

    const handleClose = () => {
      // TODO: Stop async calls
      emit('close')
    }

    return {
      mooncatId,
      original,
      wrapped,
      result,
      imageSrc,
      saleRef,
      priceRef,
      linkRef,
      loading,
      handleSubmit,
      handleClose,
    }
  },
})
</script>

<style>
.mid-width-300 {
  min-width: 300px;
}
.moon-cat-image {
  width: 200px;
}
.moon-cat-image-placeholder {
  width: 200px;
  height: 200px;
}
</style>
