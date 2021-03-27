import Axios from 'axios'

const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY
const wrappedMoonCatsTokenAddress = '0x7c40c393dc0f283f318791d746d894ddd3693572'

export const getWrappedId = (originalId: string) => {
  const url = 'https://api.etherscan.io/api'

  const params = {
    module: 'logs',
    action: 'getLogs',
    fromBlock: '1',
    toBlock: 'latest',
    address: wrappedMoonCatsTokenAddress,
    topic1: originalId + '000000000000000000000000000000000000000000000000000000',
    apikey: apiKey,
  }

  return Axios.get(url, { params })
}

export const getOriginalId = (hex: string) => {
  const url = 'https://api.etherscan.io/api'
  const params = {
    module: 'logs',
    action: 'getLogs',
    fromBlock: '1',
    toBlock: 'latest',
    address: wrappedMoonCatsTokenAddress,
    topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    topic1: '0x0000000000000000000000000000000000000000000000000000000000000000',
    topic3: hex,
    apiKey: apiKey,
  }

  return Axios.get(url, { params })
}

export const getBlock = (block: string) => {
  const url = 'https://api.etherscan.io/api'
  const params = {
    module: 'logs',
    action: 'getLogs',
    fromBlock: block,
    toBlock: block,
    address: wrappedMoonCatsTokenAddress,
    topic0: '0x82db4ed538dc0007cca5910a46d167b9ada30509d730f441f8fd8e426b1dbecb',
    apikey: apiKey,
  }

  return Axios.get(url, { params })
}

export const getOpenSeaAsset = (wrappedId: string) => {
  const url = `https://api.opensea.io/api/v1/asset/${wrappedMoonCatsTokenAddress}/${wrappedId}`
  return Axios.get(url)
}
