import { reactive } from 'vue'

export interface TokenRow {
  symbol: string
  balance: string
  rawBalance: string
  name: string
}

interface Wallet {
  address: string
  balance: string
}

interface GlobalState {
  tokenData: Array<TokenRow>
  sortAsc: boolean
  sortIndex: number
  wallet?: Wallet
}

export const globalState = reactive<GlobalState>({
  tokenData: [],
  sortAsc: true,
  sortIndex: -1,
  wallet: undefined,
})
