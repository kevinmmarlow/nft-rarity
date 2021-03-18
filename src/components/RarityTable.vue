<template>
  <table class="table-auto">
    <thead>
      <tr>
        <th class="px-4 py-2 cursor-pointer" @click="sortByTitle">
          Title {{ sortIndex === 0 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
        <th class="px-4 py-2 cursor-pointer" @click="sortByAuthor">
          Author {{ sortIndex === 1 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
        <th class="px-4 py-2 cursor-pointer" @click="sortByViews">
          Views {{ sortIndex === 2 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" class="table-row">
        <td class="border px-4 py-2">{{ row.title }}</td>
        <td class="border px-4 py-2">{{ row.author }}</td>
        <td class="border px-4 py-2">{{ row.views }}</td>
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

const sortByNumber = (a: number, b: number, sortAsc: boolean) => {
  return sortAsc ? a - b : b - a
}

const useSorting = () => {
  const sortAsc = toRef(globalState, 'sortAsc')

  const sortByTitle = () => {
    globalState.rarityData.sort((a, b) => sortByString(a.title, b.title, sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 0
  }

  const sortByAuthor = () => {
    globalState.rarityData.sort((a, b) => sortByString(a.author, b.author, sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 1
  }

  const sortByViews = () => {
    globalState.rarityData.sort((a, b) => sortByNumber(a.views, b.views, sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 2
  }

  return {
    sortAsc,
    sortByTitle,
    sortByAuthor,
    sortByViews,
  }
}

export default defineComponent({
  setup() {
    const data = toRef(globalState, 'rarityData')
    const sortIndex = toRef(globalState, 'sortIndex')
    const { sortAsc, sortByTitle, sortByAuthor, sortByViews } = useSorting()

    return {
      data,
      sortAsc,
      sortIndex,
      sortByTitle,
      sortByAuthor,
      sortByViews,
    }
  },
})
</script>

<style>
.table-row:nth-child(odd) {
  @apply bg-gray-100;
}
</style>
