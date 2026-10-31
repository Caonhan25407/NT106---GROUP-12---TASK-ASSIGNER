<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { Pencil, Camera, X, Check, BarChart3, Clock3, Flame } from 'lucide-vue-next'
import type { User } from '@/types'
const store = useAppStore()
const editing = ref(false)
const temp = ref<User>({ ...store.user })
const fileInput = ref<HTMLInputElement | null>(null)
const initials = computed(() => store.user.fullName.split(/\s+/).filter(Boolean).slice(-1)[0]?.[0]?.toUpperCase() || 'U')
const completedThisMonth = computed(() => store.tasks.filter(t => t.status === 'done' && t.finishedAt && new Date(t.finishedAt).getMonth() === new Date().getMonth()).length)
const inProgress = computed(() => store.tasks.filter(t => t.status === 'in_progress').length)
function openEdit() { temp.value = { ...store.user }; editing.value = true }
function save() { if (!temp.value.fullName.trim() || !temp.value.email.trim() || !temp.value.username.trim()) return; store.updateProfile(temp.value); editing.value = false }
function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { store.announce('Chỉ chấp nhận tệp ảnh'); return }
  if (file.size > 1_500_000) { store.announce('Vui lòng chọn ảnh nhỏ hơn 1.5 MB'); return }
  const reader = new FileReader()
  reader.onload = () => { temp.value.avatarPath = String(reader.result) }
  reader.readAsDataURL(file)
}
</script>
<template>
  <section class="profile-view">
    <div class="page-heading"><div><h1>Hồ sơ cá nhân</h1><p>Quản lý thông tin cá nhân và hoạt động của bạn.</p></div></div>
    <div class="profile-hero card-panel"><div class="profile-cover"></div><div class="profile-identity"><div class="profile-avatar"><img v-if="store.user.avatarPath" :src="store.user.avatarPath" alt="Ảnh đại diện"/><span v-else>{{ initials }}</span></div><div class="profile-bio"><div class="profile-name-line"><h2>{{ store.user.fullName }}</h2><span class="pro-label">{{ store.user.roleLabel }}</span></div><p>{{ store.user.email }} <span class="bio-divider">·</span> {{ store.user.bio }}</p></div><button class="btn btn-primary edit-profile-btn" @click="openEdit"><Pencil :size="15"/> Chỉnh sửa hồ sơ</button></div></div>
    <div class="profile-bottom-grid"><section class="card-panel profile-info"><div class="card-heading"><h2>Thông tin cá nhân</h2><p>Thông tin được hiển thị trong không gian làm việc.</p></div><div class="profile-detail-list"><div><span>Họ và tên</span><strong>{{ store.user.fullName }}</strong></div><div><span>Tên người dùng</span><strong>{{ store.user.username }}</strong></div><div><span>Email</span><strong>{{ store.user.email }}</strong></div><div><span>Múi giờ</span><strong>{{ store.user.timezone }}</strong></div></div></section>
      <section class="card-panel profile-activity"><div class="card-heading"><h2>Tổng quan hoạt động</h2><p>Năng suất và các thành tích gần đây.</p></div><div class="profile-stats-grid"><div class="profile-stat"><div class="stat-icon"><BarChart3 :size="18"/></div><span>Đã hoàn thành</span><strong>{{ completedThisMonth }}</strong><small>Trong tháng</small></div><div class="profile-stat"><div class="stat-icon"><Clock3 :size="18"/></div><span>Đang thực hiện</span><strong>{{ inProgress }}</strong><small>Hiện tại</small></div><div class="profile-stat"><div class="stat-icon"><Flame :size="18"/></div><span>Tiến độ tổng thể</span><strong>{{ store.donePercentage }}%</strong><small>Tất cả công việc</small></div></div><div class="profile-since">Tài khoản demo — số liệu lấy từ công việc hiện có.</div></section>
    </div>
    <div v-if="editing" class="modal-overlay" @click.self="editing = false"><form class="modal-card edit-modal" @submit.prevent="save"><div class="modal-header"><div><h2>Chỉnh sửa hồ sơ</h2><p>Cập nhật thông tin cá nhân của bạn.</p></div><button class="icon-button" type="button" aria-label="Đóng" @click="editing = false"><X :size="20"/></button></div><div class="edit-avatar-row"><div class="edit-avatar"><img v-if="temp.avatarPath" :src="temp.avatarPath" alt="Ảnh đại diện"/><span v-else>{{ initials }}</span></div><div><button class="btn btn-outline" type="button" @click="fileInput?.click()"><Camera :size="16" /> Thay ảnh đại diện</button><p>JPG, PNG, WebP — tối đa 1.5 MB</p><input ref="fileInput" type="file" accept="image/*" hidden @change="upload" /></div></div><div class="modal-fields"><div class="two-columns"><label class="form-label">Họ và tên<input v-model="temp.fullName" class="field-input" required maxlength="100"/></label><label class="form-label">Tên người dùng<input v-model="temp.username" class="field-input" required maxlength="100" /></label></div><label class="form-label">Email<input v-model="temp.email" type="email" class="field-input" required maxlength="100"/></label><label class="form-label">Giới thiệu<input v-model="temp.bio" class="field-input" maxlength="200" placeholder="Công việc, sở thích..." /></label><label class="form-label">Múi giờ<select v-model="temp.timezone" class="field-input"><option>Asia/Ho_Chi_Minh (UTC+07:00)</option><option>Asia/Bangkok (UTC+07:00)</option><option>Asia/Tokyo (UTC+09:00)</option><option>UTC (UTC+00:00)</option></select></label></div><div class="modal-footer"><button class="btn btn-ghost" type="button" @click="editing = false">Hủy bỏ</button><button class="btn btn-primary" type="submit"><Check :size="16"/> Lưu thay đổi</button></div></form></div>
  </section>
</template>
