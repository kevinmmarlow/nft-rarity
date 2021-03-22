<template>
  <table class="table-auto">
    <thead>
      <tr>
        <th class="px-4 py-2 cursor-pointer" @click="sortByTitle">
          Symbol {{ sortIndex === 0 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
        <th class="px-4 py-2 cursor-pointer" @click="sortByAuthor">
          Balance {{ sortIndex === 1 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" class="table-row">
        <td class="border px-4 py-2">{{ row.symbol }}</td>
        <td class="border px-4 py-2">{{ row.balance }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { globalState } from '../store'

const sortByString = (a: string, b: string, sortAsc: boolean) => {
  const fa = a.toLowerCase(),
    fb = b.toLowerCase()

  if (fa < fb) return sortAsc ? -1 : 1
  if (fa > fb) return sortAsc ? 1 : -1
  return 0
}

// const sortByNumber = (a: number, b: number, sortAsc: boolean) => {
//   return sortAsc ? a - b : b - a
// }

const useSorting = () => {
  const sortAsc = toRef(globalState, 'sortAsc')

  const sortByTitle = () => {
    globalState.tokenData.sort((a, b) => sortByString(a.symbol, b.symbol, sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 0
  }

  const sortByAuthor = () => {
    globalState.tokenData.sort((a, b) => sortByString(a.amount, b.amount, sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 1
  }

  return {
    sortAsc,
    sortByTitle,
    sortByAuthor,
  }
}

export default defineComponent({
  setup() {
    const data = toRef(globalState, 'tokenData')
    const sortIndex = toRef(globalState, 'sortIndex')
    const { sortAsc, sortByTitle, sortByAuthor } = useSorting()

    return {
      data,
      sortAsc,
      sortIndex,
      sortByTitle,
      sortByAuthor,
    }
  },
})
</script>

<style>
.table-row:nth-child(odd) {
  @apply bg-gray-100;
}
</style>
