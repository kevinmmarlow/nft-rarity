import { reactive } from 'vue'

export interface RarityRow {
  title: string
  author: string
  views: number
}

const fakeData: Array<RarityRow> = [
  {
    title: 'Intro to CSS',
    author: 'Adam',
    views: 858,
  },
  {
    title:
      'A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design',
    author: 'Adam',
    views: 112,
  },
  {
    title: 'Intro to JavaScript',
    author: 'Chris',
    views: 1280,
  },
]

export const globalState = reactive({
  count: 0,
  rarityData: fakeData,
  sortAsc: true,
  sortIndex: -1,
})
