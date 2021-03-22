import { reactive } from 'vue'

export interface Erc20Token {
  symbol: string
  balance: string
  rawBalance: string
  name: string
}

export interface Erc721Token {
  name: string
  totalSupply: string
  balance: string
}

interface Wallet {
  address: string
  balance: string
}

interface GlobalState {
  erc20Tokens: Array<Erc20Token>
  erc721Tokens: Array<Erc721Token>
  sortAsc: boolean
  sortIndex: number
  wallet?: Wallet
}

export const globalState = reactive<GlobalState>({
  erc20Tokens: [],
  erc721Tokens: [],
  sortAsc: true,
  sortIndex: -1,
  wallet: undefined,
})
