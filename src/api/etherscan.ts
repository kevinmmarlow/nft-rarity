import Axios from 'axios'

export const getWrappedId = (originalId: string) => {
  const url = 'https://api.etherscan.io/api'

  const params = {
    module: 'logs',
    action: 'getLogs',
    fromBlock: '1',
    toBlock: 'latest',
    address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
    topic1: originalId + '000000000000000000000000000000000000000000000000000000',
    apikey: '8IGPJFDKW255KIQZKYNQ3Z4WFEPJ3PXTRH',
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
    address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
    topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    topic1: '0x0000000000000000000000000000000000000000000000000000000000000000',
    topic3: hex,
    apiKey: '8IGPJFDKW255KIQZKYNQ3Z4WFEPJ3PXTRH',
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
    address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
    topic0: '0x82db4ed538dc0007cca5910a46d167b9ada30509d730f441f8fd8e426b1dbecb',
    apikey: 'JAE544SPUKRNM5Q6Y67WX41TX3EMGPRC3P',
  }

  return Axios.get(url, { params })
}

export const getOpenSeaAsset = (wrappedId: string) => {
  const url =
    'https://api.opensea.io/api/v1/asset/0x7c40c393dc0f283f318791d746d894ddd3693572/' + wrappedId
  return Axios.get(url)
}

export const parseOpenSeaResponse = (data: any) => {
  let saleText = 'Last sale: NA'

  if (data.last_sale) {
    const price = (parseInt(data.last_sale.total_price) / 10 ** 18).toFixed(2)
    saleText = `Last sale: ${price} ${data.last_sale.payment_token.symbol}`
  }

  let priceText = '- not on sale -'
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
