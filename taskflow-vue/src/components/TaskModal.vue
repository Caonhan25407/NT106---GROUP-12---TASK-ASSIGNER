<script setup lang="ts">
import { ref } from 'vue'
import { X, Plus } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import type { TaskPriority, TaskStatus } from '@/types'
const emit = defineEmits<{ close: [] }>()
const store = useAppStore()
const today = new Date().toLocaleDateString('en-CA')
const title = ref('')
const description = ref('')
const projectId = ref(store.activeProjectId ?? store.projects[0]?.projectId ?? 1)
const status = ref<TaskStatus>('todo')
const priority = ref<TaskPriority>('medium')
const startDate = ref(today)
const dueDate = ref(today)
function submit() {
  if (!title.value.trim()) return
  if (dueDate.value < startDate.value) { store.announce('Hạn hoàn thành không thể trước ngày bắt đầu'); return }
  store.addTask({ projectId: projectId.value, title: title.value.trim(), description: description.value.trim(), status: status.value, priority: priority.value, startDate: startDate.value, dueDate: dueDate.value, createdByUser: store.user.userId, assignedToUser: store.user.userId })
  emit('close')
}
</script>
<template>
  <div class="modal-overlay" @click.self="emit('close')"><form class="modal-card" @submit.prevent="submit"><div class="modal-header"><div><div class="modal-label"><Plus :size="15"/> CÔNG VIỆC MỚI</div><h2>Tạo công việc</h2><p>Thêm nhiệm vụ và thời hạn cho dự án.</p></div><button type="button" class="icon-button" aria-label="Đóng" @click="emit('close')"><X :size="20"/></button></div>
    <div class="modal-fields"><label class="form-label">Tên công việc <span>*</span><input v-model="title" required maxlength="100" class="field-input" placeholder="Nhập tên công việc..." autofocus /></label><label class="form-label">Mô tả<textarea v-model="description" maxlength="500" rows="3" class="field-input" placeholder="Mô tả ngắn..."/></label>
    <div class="two-columns"><label class="form-label">Dự án<select v-model.number="projectId" class="field-input"><option v-for="project in store.projects" :key="project.projectId" :value="project.projectId">{{ project.projectName }}</option></select></label><label class="form-label">Trạng thái<select v-model="status" class="field-input"><option value="todo">Cần làm</option><option value="in_progress">Đang thực hiện</option><option value="review">Chờ duyệt</option><option value="done">Hoàn thành</option></select></label></div>
    <div class="two-columns"><label class="form-label">Ngày bắt đầu<input v-model="startDate" class="field-input" required type="date" /></label><label class="form-label">Hạn hoàn thành<input v-model="dueDate" class="field-input" required type="date" /></label></div><label class="form-label">Độ ưu tiên<select v-model="priority" class="field-input"><option value="low">Thấp</option><option value="medium">Trung bình</option><option value="high">Cao</option></select></label></div>
    <div class="modal-footer"><button class="btn btn-ghost" type="button" @click="emit('close')">Hủy bỏ</button><button class="btn btn-primary" type="submit"><Plus :size="16"/> Tạo công việc</button></div></form></div>
</template>
