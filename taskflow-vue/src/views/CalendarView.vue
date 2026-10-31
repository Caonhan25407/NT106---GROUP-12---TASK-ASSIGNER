<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-vue-next'
const store = useAppStore()
const current = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const week = ['T2','T3','T4','T5','T6','T7','CN']
const monthLabel = computed(() => current.value.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }))
const todayKey = new Date().toLocaleDateString('en-CA')
const cells = computed(() => {
  const y = current.value.getFullYear(), m = current.value.getMonth()
  const startOffset = (new Date(y, m, 1).getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, idx) => {
    const date = new Date(y, m, idx - startOffset + 1)
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    return { key, day: date.getDate(), inMonth: date.getMonth() === m, isToday: key === todayKey, tasks: store.tasks.filter(t => t.dueDate.slice(0,10) === key) }
  })
})
function shift(n: number) { current.value = new Date(current.value.getFullYear(), current.value.getMonth()+n, 1) }
function reset() { current.value = new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
</script>
<template>
  <section><div class="page-heading heading-with-action"><div><h1>Lịch công việc</h1><p>Quan sát deadline và sắp xếp kế hoạch của bạn.</p></div><button class="btn btn-primary" @click="store.showTaskModal = true"><Plus :size="17"/> Thêm công việc</button></div><div class="card-panel calendar-panel"><div class="calendar-toolbar"><div class="calendar-month"><CalendarDays :size="21"/><h2>{{ monthLabel }}</h2></div><div class="calendar-nav"><button @click="reset">Hôm nay</button><button aria-label="Tháng trước" @click="shift(-1)"><ChevronLeft :size="20" /></button><button aria-label="Tháng sau" @click="shift(1)"><ChevronRight :size="20" /></button></div></div><div class="calendar-grid"><div v-for="w in week" :key="w" class="weekday">{{ w }}</div><div v-for="day in cells" :key="day.key" class="calendar-cell" :class="{ outside: !day.inMonth, 'is-today': day.isToday }"><span class="calendar-num">{{ day.day }}</span><div class="calendar-events"><div v-for="t in day.tasks.slice(0,3)" :key="t.taskId" class="calendar-event" :class="t.status" :title="t.title">{{ t.title }}</div><span v-if="day.tasks.length > 3" class="event-extra">+{{ day.tasks.length - 3 }} công việc</span></div></div></div></div></section>
</template>
