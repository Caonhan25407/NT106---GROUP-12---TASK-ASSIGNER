<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { Plus, Search, LayoutList, LayoutGrid, Trash2, CalendarDays, CheckCheck } from 'lucide-vue-next'
import { statusLabels, priorityLabels } from '@/types'
import type { TaskStatus } from '@/types'
const store = useAppStore()
const tab = ref<TaskStatus | 'all'>('all')
const view = ref<'list' | 'board'>('list')
const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']
const filtered = computed(() => store.tasks.filter(t =>
  (tab.value === 'all' || t.status === tab.value) &&
  (store.activeProjectId === null || store.activeProjectId === t.projectId) &&
  (!store.search || [t.title, t.description, store.projects.find(p => p.projectId === t.projectId)?.projectName].join(' ').toLowerCase().includes(store.search.toLowerCase()))
))
const currentProject = computed(() => store.projects.find(p => p.projectId === store.activeProjectId))
const formatDate = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString('vi-VN')
</script>
<template>
  <section class="tasks-view"><div class="page-heading heading-with-action"><div><h1>{{ currentProject?.projectName || 'Quản lý công việc' }}</h1><p>{{ currentProject?.description || 'Theo dõi công việc, thời hạn và tiến độ trong tất cả dự án.' }}</p></div><button class="btn btn-primary" @click="store.showTaskModal = true"><Plus :size="17" /> Tạo công việc</button></div>
    <div class="task-toolbar card-panel"><div class="task-tabs"><button :class="{ active: tab === 'all' }" @click="tab = 'all'">Tất cả <span>{{ store.tasks.filter(t => store.activeProjectId === null || store.activeProjectId === t.projectId).length }}</span></button><button v-for="s in statuses" :key="s" :class="{ active: tab === s }" @click="tab = s">{{ statusLabels[s] }}</button></div><div class="view-toggle"><button title="Danh sách" :class="{ active: view === 'list' }" @click="view = 'list'"><LayoutList :size="18"/></button><button title="Bảng Kanban" :class="{ active: view === 'board' }" @click="view = 'board'"><LayoutGrid :size="18"/></button></div></div>
    <div v-if="view === 'list'" class="card-panel task-list"><div class="task-list-header"><span>CÔNG VIỆC</span><span>DỰ ÁN</span><span>HẠN CHÓT</span><span>TRẠNG THÁI</span><span></span></div><div v-for="task in filtered" :key="task.taskId" class="task-item"><div class="task-main"><button title="Hoàn thành / Làm lại" class="task-checkbox" :class="{ checked: task.status === 'done' }" @click="store.setTaskStatus(task.taskId, task.status === 'done' ? 'todo' : 'done')"><CheckCheck v-if="task.status === 'done'" :size="14" /></button><div><strong :class="{ completed: task.status === 'done' }">{{ task.title }}</strong><small>{{ task.description || 'Chưa có mô tả' }}</small></div></div><span class="task-project"><span class="project-dot" :style="{ background: store.projects.find(p => p.projectId === task.projectId)?.color }"></span>{{ store.projects.find(p => p.projectId === task.projectId)?.projectName }}</span><span class="task-due"><CalendarDays :size="14" /> {{ formatDate(task.dueDate) }}</span><select :value="task.status" class="status-select" :class="task.status" @change="store.setTaskStatus(task.taskId, ($event.target as HTMLSelectElement).value as TaskStatus)"><option v-for="s in statuses" :key="s" :value="s">{{ statusLabels[s] }}</option></select><button class="icon-button danger-hover" title="Xóa công việc" @click="store.removeTask(task.taskId)"><Trash2 :size="16"/></button></div><div v-if="filtered.length === 0" class="empty-state"><Search :size="25"/><p>Không tìm thấy công việc phù hợp.</p></div></div>
    <div v-else class="kanban-grid"><div v-for="s in statuses" :key="s" class="kanban-column"><div class="kanban-heading"><span class="kanban-status-dot" :class="s"></span><strong>{{ statusLabels[s] }}</strong><span>{{ filtered.filter(t => t.status === s).length }}</span></div><div v-for="task in filtered.filter(t => t.status === s)" :key="task.taskId" class="kanban-card"><span class="priority-text" :class="task.priority">● {{ priorityLabels[task.priority] }}</span><h3>{{ task.title }}</h3><p>{{ task.description }}</p><div><span><CalendarDays :size="13"/> {{ formatDate(task.dueDate) }}</span><select :value="task.status" aria-label="Đổi trạng thái" @change="store.setTaskStatus(task.taskId, ($event.target as HTMLSelectElement).value as TaskStatus)"><option v-for="v in statuses" :value="v" :key="v">{{ statusLabels[v] }}</option></select></div></div><button class="kanban-add" @click="store.showTaskModal = true"><Plus :size="15"/> Thêm công việc</button></div></div>
  </section>
</template>
