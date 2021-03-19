import { ethers } from 'ethers'

export const hasConnectableWallet = () => {
  if (window.ethereum) {
    return true
  }
  return false
}

export const readAddress = () => {
  return window.ethereum ? window.ethereum.selectedAddress : undefined
}

export const readBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(address)
    const total = parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
    return total
  } catch (err) {
    // There was an issue!
    // Maybe the name wasn't registered!
    console.error(err)
  }
}

export const lookupAddress = async (provider, address) => {
  return await provider.lookupAddress(address)
}

export const enableProvider = async () => {
  if (window.ethereum) {
    await window.ethereum.enable()
    return new ethers.providers.Web3Provider(window.ethereum)
  }

  return ethers.getDefaultProvider()
}
