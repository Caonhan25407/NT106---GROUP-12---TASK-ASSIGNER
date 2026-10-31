<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { LayoutDashboard, CalendarDays, SquareCheckBig, UsersRound, ChartNoAxesColumnIncreasing, Bot, Settings2, Search, Bell, CircleHelp, ChevronDown, Plus, Menu, X, Check, LogOut, UserRound, Sparkles } from 'lucide-vue-next'
import CreateTaskModal from './TaskModal.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const menuOpen = ref(false)
const notificationOpen = ref(false)
const profileOpen = ref(false)
const projectOpen = ref(false)
const newProjectName = ref('')
const nav = [
  { path: '/overview', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/calendar', label: 'Lịch', icon: CalendarDays },
  { path: '/tasks', label: 'Công việc', icon: SquareCheckBig },
  { path: '/team', label: 'Nhóm', icon: UsersRound },
  { path: '/statistics', label: 'Thống kê', icon: ChartNoAxesColumnIncreasing },
  { path: '/assistant', label: 'Trợ lý AI', icon: Bot },
  { path: '/profile', label: 'Cài đặt', icon: Settings2 }
]
const breadcrumb = computed(() => nav.find(n => n.path === route.path)?.label ?? 'Tổng quan')
const initials = computed(() => store.user.fullName.trim().split(/\s+/).slice(-1).join('').slice(0, 1).toUpperCase() || 'U')
function navigate(path: string) { store.activeProjectId = null; router.push(path); menuOpen.value = false }
function selectProject(id: number) { store.activeProjectId = id; router.push('/tasks'); menuOpen.value = false }
function createProject() { if (newProjectName.value.trim()) { store.addProject(newProjectName.value.trim()); newProjectName.value = ''; projectOpen.value = false } }
function logout() { profileOpen.value = false; store.logout(); router.push('/login') }
</script>

<template>
  <div class="app-layout">
    <button class="mobile-scrim" v-if="menuOpen" aria-label="Đóng menu" @click="menuOpen = false"></button>
    <aside class="sidebar" :class="{ 'sidebar-show': menuOpen }">
      <div class="sidebar-logo"><span class="brand-mark"><Check :size="18" :stroke-width="2.6" /></span><span>TaskFlow</span><button class="mobile-close" aria-label="Đóng menu" @click="menuOpen = false"><X :size="18" /></button></div>
      <div class="sidebar-sect-title">KHÔNG GIAN AI</div>
      <div class="sidebar-sect-title sidebar-space">KHÔNG GIAN LÀM VIỆC</div>
      <nav class="sidebar-nav" aria-label="Điều hướng chính">
        <button v-for="item in nav" :key="item.path" class="sidebar-nav-item" :class="{ selected: route.path === item.path }" @click="navigate(item.path)">
          <component :is="item.icon" :size="18" :stroke-width="1.9"/><span>{{ item.label }}</span><span v-if="item.path === '/tasks' && store.pendingCount" class="nav-count">{{ store.pendingCount }}</span>
        </button>
      </nav>
      <div class="sidebar-project-header"><span>DỰ ÁN CỦA TÔI</span><button title="Thêm dự án" aria-label="Thêm dự án" @click="projectOpen = true"><Plus :size="17" /></button></div>
      <div class="sidebar-projects">
        <button v-for="p in store.projects" :key="p.projectId" class="project-nav-item" :class="{ 'project-selected': store.activeProjectId === p.projectId && route.path === '/tasks' }" @click="selectProject(p.projectId)"><span class="project-dot" :style="{ background: p.color }"></span><span class="project-nav-label">{{ p.projectName }}</span><span class="project-nav-count">{{ store.tasks.filter(t => t.projectId === p.projectId).length.toString().padStart(2, '0') }}</span></button>
      </div>
      <button class="sidebar-bottom-account" @click="navigate('/profile')"><span class="mini-avatar"><img v-if="store.user.avatarPath" :src="store.user.avatarPath" alt="" /><template v-else>{{ initials }}</template></span><span class="mini-account-info"><strong>{{ store.user.fullName }}</strong><small>Không gian cá nhân</small></span></button>
    </aside>
    <div class="workspace">
      <header class="topbar">
        <div class="topbar-crumb"><button class="mobile-menu icon-button" aria-label="Mở menu" @click="menuOpen = true"><Menu :size="20"/></button><span class="muted-crumb">Trang chủ</span><span class="crumb-slash">/</span><strong>{{ route.path === '/profile' ? 'Hồ sơ cá nhân' : breadcrumb }}</strong></div>
        <label class="topbar-search"><Search :size="18"/><input v-model="store.search" placeholder="Tìm việc, dự án hoặc thành viên..." aria-label="Tìm kiếm" @keydown.enter="router.push('/tasks')" /></label>
        <div class="topbar-actions">
          <div class="popover-anchor"><button class="topbar-icon-btn" title="Thông báo" aria-label="Thông báo" @click="notificationOpen = !notificationOpen; profileOpen = false"><Bell :size="18"/><span v-if="store.unreadCount" class="notif-indicator"></span></button><div v-if="notificationOpen" class="popover notification-popover"><div class="popover-title"><strong>Thông báo</strong><button @click="store.markNotificationsRead()">Đánh dấu đã đọc</button></div><div v-for="n in store.notifications" :key="n.notiId" class="notif-item" :class="{ unread: !n.isRead }"><div class="notif-dot"/><div><strong>{{ n.title }}</strong><p>{{ n.content }}</p></div></div></div></div>
          <button class="topbar-icon-btn help-btn" title="Trợ giúp" aria-label="Trợ giúp" @click="store.announce('Đây là bản demo. Xem README.md để tích hợp backend.')"><CircleHelp :size="19"/></button>
          <div class="popover-anchor"><button class="topbar-user" @click="profileOpen = !profileOpen; notificationOpen = false"><span class="mini-avatar"><img v-if="store.user.avatarPath" :src="store.user.avatarPath" alt="" /><template v-else>{{ initials }}</template></span><span class="topbar-user-text"><strong>{{ store.user.fullName }}</strong><small>Gói Pro</small></span><ChevronDown class="user-chevron" :size="15" /></button><div v-if="profileOpen" class="popover profile-popover"><button @click="navigate('/profile'); profileOpen = false"><UserRound :size="16"/> Hồ sơ cá nhân</button><button @click="navigate('/assistant'); profileOpen = false"><Sparkles :size="16"/> Trợ lý AI</button><button @click="logout"><LogOut :size="16"/> Đăng xuất</button></div></div>
        </div>
      </header>
      <main class="workspace-content"><RouterView /></main>
    </div>
    <CreateTaskModal v-if="store.showTaskModal" @close="store.showTaskModal = false" />
    <div v-if="projectOpen" class="modal-overlay" @click.self="projectOpen = false"><form class="modal-card small-modal" @submit.prevent="createProject"><div class="modal-header"><div><h2>Thêm dự án</h2><p>Tạo một không gian công việc mới.</p></div><button type="button" class="icon-button" @click="projectOpen = false"><X :size="20"/></button></div><label class="form-label">Tên dự án<input v-model="newProjectName" class="field-input" required maxlength="100" placeholder="Ví dụ: Website thương mại điện tử" autofocus/></label><div class="modal-footer"><button class="btn btn-ghost" type="button" @click="projectOpen = false">Hủy</button><button class="btn btn-primary" type="submit">Tạo dự án</button></div></form></div>
  </div>
</template>
