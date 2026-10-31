<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { UsersRound, Mail, ShieldCheck, BriefcaseBusiness, Circle } from 'lucide-vue-next'
const store = useAppStore()
const members = computed(() => [
  { id: 1, name: store.user.fullName, email: store.user.email, role: 'Quản trị dự án', initials: store.user.fullName[0]?.toUpperCase() ?? 'U', color: '#8675ff', avatar: store.user.avatarPath },
  { id: 2, name: 'Minh Anh', email: 'minh.anh@example.com', role: 'Lập trình viên', initials: 'M', color: '#56b6ac', avatar: '' },
  { id: 3, name: 'Hà Linh', email: 'ha.linh@example.com', role: 'UI/UX Designer', initials: 'H', color: '#d9a66d', avatar: '' }
])
</script>
<template><section><div class="page-heading"><h1>Thành viên nhóm</h1><p>Những người đang cộng tác cùng bạn trong các dự án.</p></div><div class="team-summary"><div class="card-panel team-summary-card"><div class="overview-icon purple"><UsersRound :size="21"/></div><div><strong>{{ members.length }}</strong><span>Thành viên demo</span></div></div><div class="card-panel team-summary-card"><div class="overview-icon green"><BriefcaseBusiness :size="21"/></div><div><strong>{{ store.projects.length }}</strong><span>Dự án đang theo dõi</span></div></div></div><section class="card-panel team-card"><div class="content-section-title"><div><h2>Danh sách thành viên</h2><p>Thông tin minh họa cho bảng Users và ProjectMembers.</p></div></div><div class="members-grid"><div v-for="m in members" :key="m.id" class="member-card"><div class="member-big-avatar" :style="{ background: m.color }"><img v-if="m.avatar" :src="m.avatar" alt=""/><template v-else>{{ m.initials }}</template></div><h3>{{ m.name }}</h3><p>{{ m.role }}</p><div class="member-email"><Mail :size="14"/> {{ m.email }}</div><div class="member-bottom"><span><Circle :size="9" fill="#45c8a5" stroke="#45c8a5" /> Đang hoạt động</span><ShieldCheck :size="16"/></div></div></div></section></section></template>
