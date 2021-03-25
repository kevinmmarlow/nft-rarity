<template>
  <table v-if="data.length > 0" class="table-auto mb-16">
    <thead>
      <tr>
        <th
          v-for="(col, index) in headers"
          :key="index"
          class="px-4 py-2 cursor-pointer"
          @click="() => sortByKey(col.key)"
        >
          {{ col.name }} {{ sortIndex === 0 ? (sortAsc ? '▲' : '▼') : '' }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" class="table-row">
        <td v-for="(col, colIdx) in headers" :key="colIdx" class="border px-4 py-2">
          {{ row[col.key] }}
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="py-10 h-screen prose-lg text-center text-gray-700">
    <h4>Connect Wallet to Load Token Table</h4>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, toRefs } from 'vue'
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

const useSorting = (data: Array<any>) => {
  const sortAsc = toRef(globalState, 'sortAsc')

  const sortByKey = (key: string): Array<any> => {
    data.sort((a, b) => sortByString(a[`${key}`], b[`${key}`], sortAsc.value))
    globalState.sortAsc = !sortAsc.value
    globalState.sortIndex = 0

    return data
  }

  return {
    sortAsc,
    sortByKey,
  }
}

export default defineComponent({
  props: {
    data: {
      type: [Array],
      required: true,
    },
    headers: {
      type: [Array],
      required: true,
    },
  },
  setup(props) {
    const sortIndex = toRef(globalState, 'sortIndex')
    const { sortAsc, sortByKey } = useSorting(props.data)
    const { data, headers } = toRefs(props)

    return {
      data,
      headers,
      sortAsc,
      sortIndex,
      sortByKey,
    }
  },
})
</script>

<style>
.table-row:nth-child(odd) {
  @apply bg-gray-100;
}
</style>
