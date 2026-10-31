<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Bot, Sparkles, Send, UserRound, AlertCircle } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
interface ChatItem { id: number; role: 'assistant' | 'user'; content: string }
const messages = ref<ChatItem[]>([{ id: 1, role: 'assistant', content: 'Xin chào! Mình là giao diện mô phỏng trợ lý TaskFlow. Bạn có thể hỏi về số công việc, các dự án hoặc deadline để xem dữ liệu demo được tổng hợp như thế nào.' }])
const draft = ref('')
const scroll = ref<HTMLElement | null>(null)
const suggestions = ['Hôm nay tôi cần làm gì?', 'Tổng hợp tiến độ dự án', 'Công việc nào đang quá hạn?']
const today = computed(() => new Date().toLocaleDateString('en-CA'))
function respond(text: string): string {
  const s = text.toLowerCase()
  if (s.includes('quá hạn') || s.includes('deadline') || s.includes('hạn')) {
    const late = store.tasks.filter(t => t.status !== 'done' && t.dueDate < today.value)
    return late.length ? `Có ${late.length} việc quá hạn: ${late.map(t => t.title).join('; ')}.` : 'Hiện không có công việc quá hạn trong dữ liệu demo.'
  }
  if (s.includes('dự án') || s.includes('tiến độ')) return `Bạn đang theo dõi ${store.projects.length} dự án: ${store.projects.map(p => p.projectName).join(', ')}. Đã hoàn thành ${store.completedCount}/${store.tasks.length} công việc (${store.donePercentage}%).`
  if (s.includes('hôm nay') || s.includes('cần làm') || s.includes('công việc')) {
    const active = store.tasks.filter(t => t.status !== 'done').slice(0, 5)
    return active.length ? `Bạn còn ${store.pendingCount} công việc chưa hoàn thành. Ưu tiên: ${active.map(t => t.title).join('; ')}.` : 'Mọi công việc đều đã hoàn thành!'
  }
  return 'Đây là câu trả lời mẫu từ logic frontend, chưa phải AI thật. Khi kết nối ASP.NET Core API và nhà cung cấp AI, phần này sẽ nhận câu trả lời từ backend.'
}
async function send(value = draft.value) {
  const text = value.trim()
  if (!text) return
  messages.value.push({ id: Date.now(), role: 'user', content: text })
  messages.value.push({ id: Date.now() + 1, role: 'assistant', content: respond(text) })
  draft.value = ''
  await nextTick()
  scroll.value?.scrollTo({ top: scroll.value.scrollHeight, behavior: 'smooth' })
}
</script>
<template><section class="ai-page"><div class="page-heading"><div><h1>Trợ lý AI</h1><p>Không gian trò chuyện hỗ trợ quản lý công việc.</p></div></div><div class="ai-shell card-panel"><div class="ai-chat-head"><div class="ai-icon"><Bot :size="22"/></div><div><strong>TaskFlow Assistant</strong><span>Trình mô phỏng · Chưa kết nối AI thật</span></div><span class="ai-head-spark"><Sparkles :size="17"/></span></div><div ref="scroll" class="ai-chat-messages"><div v-for="m in messages" :key="m.id" class="chat-line" :class="m.role"><div class="chat-avatar"><Bot v-if="m.role === 'assistant'" :size="18"/><UserRound v-else :size="18"/></div><div class="chat-bubble">{{ m.content }}</div></div></div><div class="chat-suggestions"><button v-for="s in suggestions" :key="s" @click="send(s)">{{ s }}</button></div><form class="chat-compose" @submit.prevent="send()"><input v-model="draft" placeholder="Nhập câu hỏi về công việc..." maxlength="500" aria-label="Tin nhắn AI"/><button type="submit" aria-label="Gửi tin nhắn"><Send :size="18"/></button></form><div class="chat-note"><AlertCircle :size="13"/> Chỉ là bản mô phỏng offline. Không gửi dữ liệu đến dịch vụ AI.</div></div></section></template>
