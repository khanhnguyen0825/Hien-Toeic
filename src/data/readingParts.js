import { part5Sets } from './part5Sets'

// Reading part registry. Add each new part's data here when it becomes available.
export const readingParts = [
  {
    id: 'part-5',
    label: 'Part 5',
    title: 'Incomplete Sentences',
    description: 'Từ vựng, từ loại và ngữ pháp trong câu đơn.',
    available: true,
    sets: part5Sets,
  },
  {
    id: 'part-6',
    label: 'Part 6',
    title: 'Text Completion',
    description: 'Hoàn thành đoạn văn theo ngữ cảnh.',
    available: false,
    sets: [],
  },
  {
    id: 'part-7',
    label: 'Part 7',
    title: 'Reading Comprehension',
    description: 'Đọc hiểu văn bản đơn và đa văn bản.',
    available: false,
    sets: [],
  },
]
