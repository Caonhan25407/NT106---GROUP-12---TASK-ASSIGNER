import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { User, Project, Task, Notification, TaskStatus } from '@/types'

const now = new Date()
const day = (offset: number) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const safeLoad = <T>(key: string, initial: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : initial
  } catch { return initial }
}
const initialUser: User = {
  userId: 1, username: 'nhancao', fullName: 'Nhân Cao', email: 'nhan.cao@example.com',
  avatarPath: '', timezone: 'Asia/Ho_Chi_Minh (UTC+07:00)',
  bio: 'Thiết kế và phát triển phần mềm', roleLabel: 'THÀNH VIÊN PRO'
}
const initialProjects: Project[] = [
  { projectId: 1, projectName: 'Ra mắt sản phẩm', description: 'Chuẩn bị cho đợt phát hành sản phẩm mới', status: 'In progress', startDate: day(-26), dueDate: day(18), createdAt: day(-27), finishedAt: null, color: '#806cff' },
  { projectId: 2, projectName: 'Thiết kế UI/UX', description: 'Nâng cấp trải nghiệm người dùng', status: 'In progress', startDate: day(-16), dueDate: day(24), createdAt: day(-18), finishedAt: null, color: '#aa84ff' },
  { projectId: 3, projectName: 'Cá nhân', description: 'Các công việc và mục tiêu cá nhân', status: 'In progress', startDate: day(-8), dueDate: day(35), createdAt: day(-10), finishedAt: null, color: '#f3c66d' }
]
const initialTasks: Task[] = [
  { taskId: 1, projectId: 1, title: 'Hoàn thiện landing page', description: 'Rà soát nội dung và các breakpoint', status: 'in_progress', startDate: day(-2), dueDate: day(2), createdByUser: 1, assignedToUser: 1, createdAt: day(-5), finishedAt: null, priority: 'high' },
  { taskId: 2, projectId: 2, title: 'Thiết kế trang hồ sơ cá nhân', description: 'UI theo bộ nhận diện TaskFlow', status: 'done', startDate: day(-5), dueDate: day(-1), createdByUser: 1, assignedToUser: 1, createdAt: day(-6), finishedAt: day(-1), priority: 'medium' },
  { taskId: 3, projectId: 1, title: 'Kiểm thử chức năng đăng nhập', description: 'Kiểm tra các trường hợp hợp lệ và ngoại lệ', status: 'review', startDate: day(-1), dueDate: day(1), createdByUser: 1, assignedToUser: 2, createdAt: day(-6), finishedAt: null, priority: 'high' },
  { taskId: 4, projectId: 2, title: 'Chuẩn hóa component button', description: 'Xây dựng design system', status: 'in_progress', startDate: day(-1), dueDate: day(4), createdByUser: 1, assignedToUser: 3, createdAt: day(-4), finishedAt: null, priority: 'medium' },
  { taskId: 5, projectId: 3, title: 'Lập kế hoạch tuần mới', description: 'Sắp xếp mục tiêu và deadline', status: 'todo', startDate: day(0), dueDate: day(3), createdByUser: 1, assignedToUser: 1, createdAt: day(-2), finishedAt: null, priority: 'low' },
  { taskId: 6, projectId: 1, title: 'Chuẩn bị tài liệu bàn giao', description: 'README, checklist và release note', status: 'todo', startDate: day(2), dueDate: day(7), createdByUser: 1, assignedToUser: 2, createdAt: day(-3), finishedAt: null, priority: 'medium' },
  { taskId: 7, projectId: 2, title: 'Nghiên cứu luồng onboarding', description: 'Phân tích UX và cập nhật wireframe', status: 'done', startDate: day(-6), dueDate: day(-3), createdByUser: 1, assignedToUser: 3, createdAt: day(-8), finishedAt: day(-3), priority: 'low' },
  { taskId: 8, projectId: 3, title: 'Ôn tập Vue 3 Composition API', description: 'Ôn ref, computed, watch và Vue Router', status: 'in_progress', startDate: day(-1), dueDate: day(5), createdByUser: 1, assignedToUser: 1, createdAt: day(-2), finishedAt: null, priority: 'medium' }
]
const initialNotifications: Notification[] = [
  { notiId: 1, userReceive: 1, title: 'Công việc sắp đến hạn', content: 'Kiểm thử chức năng đăng nhập có deadline ngày mai.', createdAt: new Date().toISOString(), isRead: false },
  { notiId: 2, userReceive: 1, title: 'Chào mừng đến TaskFlow', content: 'Bạn có thể quản lý công việc, dự án và hồ sơ tại đây.', createdAt: new Date().toISOString(), isRead: false },
  { notiId: 3, userReceive: 1, title: 'Cập nhật dự án', content: 'Thiết kế UI/UX có hoạt động mới.', createdAt: new Date().toISOString(), isRead: true }
]

export const useAppStore = defineStore('app', () => {
  const loggedIn = ref(safeLoad('tf_logged_in_v1', false))
  const user = ref<User>(safeLoad('tf_profile_v1', initialUser))
  const projects = ref<Project[]>(safeLoad('tf_projects_v1', initialProjects))
  const tasks = ref<Task[]>(safeLoad('tf_tasks_v1', initialTasks))
  const notifications = ref<Notification[]>(safeLoad('tf_notifications_v1', initialNotifications))
  const activeProjectId = ref<number | null>(null)
  const showTaskModal = ref(false)
  const search = ref('')
  const toast = ref('')
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
  const completedCount = computed(() => tasks.value.filter(t => t.status === 'done').length)
  const donePercentage = computed(() => tasks.value.length ? Math.round(completedCount.value / tasks.value.length * 100) : 0)
  const pendingCount = computed(() => tasks.value.filter(t => t.status !== 'done').length)

  watch(loggedIn, v => localStorage.setItem('tf_logged_in_v1', JSON.stringify(v)))
  watch(user, v => localStorage.setItem('tf_profile_v1', JSON.stringify(v)), { deep: true })
  watch(projects, v => localStorage.setItem('tf_projects_v1', JSON.stringify(v)), { deep: true })
  watch(tasks, v => localStorage.setItem('tf_tasks_v1', JSON.stringify(v)), { deep: true })
  watch(notifications, v => localStorage.setItem('tf_notifications_v1', JSON.stringify(v)), { deep: true })

  function login(identifier: string, password: string) {
    // UI prototype only. No real credentials, sessions or password storage.
    if (!identifier.trim() || password.length < 6) return false
    loggedIn.value = true
    return true
  }
  function logout() { loggedIn.value = false; activeProjectId.value = null }
  function updateProfile(data: Partial<User>) { user.value = { ...user.value, ...data }; announce('Đã lưu thay đổi hồ sơ') }
  function addTask(data: Omit<Task, 'taskId' | 'createdAt' | 'finishedAt'>) {
    const newId = Math.max(0, ...tasks.value.map(t => t.taskId)) + 1
    tasks.value.unshift({ ...data, taskId: newId, createdAt: new Date().toISOString(), finishedAt: data.status === 'done' ? new Date().toISOString() : null })
    announce('Đã tạo công việc mới')
  }
  function setTaskStatus(id: number, status: TaskStatus) {
    const task = tasks.value.find(t => t.taskId === id)
    if (task) { task.status = status; task.finishedAt = status === 'done' ? new Date().toISOString() : null; announce('Đã cập nhật trạng thái công việc') }
  }
  function removeTask(id: number) { tasks.value = tasks.value.filter(t => t.taskId !== id); announce('Đã xóa công việc') }
  function addProject(name: string, description = '') {
    const projectId = Math.max(0, ...projects.value.map(p => p.projectId)) + 1
    projects.value.push({ projectId, projectName: name, description, status: 'In progress', startDate: day(0), dueDate: day(30), createdAt: day(0), finishedAt: null, color: ['#806cff', '#aa84ff', '#f3c66d', '#59c9be'][projectId % 4] })
    announce('Đã tạo dự án mới')
  }
  function markNotificationsRead() { notifications.value.forEach(n => { n.isRead = true }) }
  function announce(message: string) { toast.value = message }
  return { loggedIn, user, projects, tasks, notifications, activeProjectId, showTaskModal, search, toast, unreadCount, completedCount, donePercentage, pendingCount, login, logout, updateProfile, addTask, setTaskStatus, removeTask, addProject, markNotificationsRead, announce }
})
