import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AuthView from '@/views/AuthView.vue'
import MainLayout from '@/components/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import TasksView from '@/views/TasksView.vue'
import CalendarView from '@/views/CalendarView.vue'
import TeamView from '@/views/TeamView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import AIView from '@/views/AIView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: AuthView, meta: { guest: true } },
    { path: '/', component: MainLayout, children: [
      { path: '', redirect: '/overview' },
      { path: 'overview', name: 'overview', component: DashboardView },
      { path: 'tasks', name: 'tasks', component: TasksView },
      { path: 'calendar', name: 'calendar', component: CalendarView },
      { path: 'team', name: 'team', component: TeamView },
      { path: 'statistics', name: 'statistics', component: StatisticsView },
      { path: 'assistant', name: 'assistant', component: AIView },
      { path: 'profile', name: 'profile', component: ProfileView }
    ] },
    { path: '/:pathMatch(.*)*', redirect: '/overview' }
  ]
})
router.beforeEach(to => {
  const store = useAppStore()
  if (!store.loggedIn && !to.meta.guest) return { name: 'login' }
  if (store.loggedIn && to.meta.guest) return { name: 'overview' }
})
export default router
