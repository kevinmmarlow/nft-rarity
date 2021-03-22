import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export const hasConnectableWallet = () => {
  if (window.ethereum) {
    return true
  }
  return false
}

export const enableProvider = async (): Promise<ethers.providers.BaseProvider> => {
  if (window.ethereum) {
    await window.ethereum.enable()
    return new ethers.providers.Web3Provider(window.ethereum)
  } else if (window.web3) {
    return new ethers.providers.Web3Provider(window.web3.currentProvider)
  } else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }

  return ethers.getDefaultProvider()
}

export const readAddress = async (
  provider: ethers.providers.JsonRpcProvider
): Promise<string | undefined> => {
  try {
    const addresses = await provider.listAccounts()
    if (addresses.length === 0) {
      throw 'No addresses'
    }
    return addresses[0]
  } catch (err) {
    return window.ethereum ? window.ethereum.selectedAddress : undefined
  }
}

export const readBalance = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<string | undefined> => {
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

export const lookupAddress = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<string | undefined> => {
  try {
    return await provider.lookupAddress(address)
  } catch (err) {
    // No-op, doesn't support ENS
  }
}
