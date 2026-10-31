<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Check, Eye, EyeOff, ArrowLeft, ArrowRight, LockKeyhole, Mail } from 'lucide-vue-next'

const router = useRouter()
const store = useAppStore()
const mode = ref<'login' | 'register' | 'forgot'>('login')
const identifier = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const remember = ref(true)
const visible = ref(false)
const error = ref('')
const notice = ref('')
function switchMode(value: 'login' | 'register' | 'forgot') { mode.value = value; error.value = ''; notice.value = '' }
function submit() {
  error.value = ''; notice.value = ''
  if (mode.value === 'forgot') { error.value = 'Chức năng gửi email cần kết nối backend. Đây là bản giao diện demo.'; return }
  if (!identifier.value.trim()) { error.value = 'Vui lòng nhập tên tài khoản hoặc email.'; return }
  if (password.value.length < 6) { error.value = 'Mật khẩu phải có ít nhất 6 ký tự.'; return }
  if (mode.value === 'register') {
    if (!fullName.value.trim()) { error.value = 'Vui lòng nhập họ và tên.'; return }
    if (!/^\S+@\S+\.\S+$/.test(identifier.value)) { error.value = 'Vui lòng nhập email hợp lệ.'; return }
    if (confirmPassword.value !== password.value) { error.value = 'Xác nhận mật khẩu chưa trùng khớp.'; return }
    // This is not a real registration. Never store credentials in browser storage.
    store.updateProfile({ fullName: fullName.value.trim(), email: identifier.value.trim(), username: identifier.value.split('@')[0] })
  }
  if (store.login(identifier.value, password.value)) router.push('/profile')
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-shell">
      <section class="auth-left">
        <div class="auth-brand"><span class="brand-mark brand-mark-light"><Check :size="18" :stroke-width="2.6" /></span><span>TaskFlow</span></div>
        <div class="auth-form-wrap">
          <template v-if="mode === 'login'">
            <h1>ĐĂNG NHẬP</h1>
            <p class="auth-sub">Chưa có tài khoản? <button class="text-button" type="button" @click="switchMode('register')">Đăng kí ngay</button></p>
          </template>
          <template v-else-if="mode === 'register'">
            <h1>ĐĂNG KÍ</h1>
            <p class="auth-sub">Đã có tài khoản? <button class="text-button" type="button" @click="switchMode('login')">Đăng nhập</button></p>
          </template>
          <template v-else>
            <h1>QUÊN MẬT KHẨU</h1>
            <p class="auth-sub">Nhập email để yêu cầu đặt lại mật khẩu.</p>
          </template>
          <form class="auth-form" @submit.prevent="submit">
            <label v-if="mode === 'register'" class="auth-field">Họ và tên<input v-model="fullName" autocomplete="name" placeholder="Tên hiển thị" /></label>
            <label class="auth-field">{{ mode === 'login' ? 'Tên tài khoản' : 'Email' }}
              <input v-model="identifier" :type="mode === 'login' ? 'text' : 'email'" :autocomplete="mode === 'login' ? 'username' : 'email'" :placeholder="mode === 'login' ? 'Tên đăng nhập hoặc email' : 'example@email.com'" />
            </label>
            <label v-if="mode !== 'forgot'" class="auth-field">Mật khẩu
              <span class="password-control"><input v-model="password" :type="visible ? 'text' : 'password'" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" placeholder="Nhập mật khẩu" /><button type="button" aria-label="Hiện hoặc ẩn mật khẩu" class="password-eye" @click="visible = !visible"><EyeOff v-if="visible" :size="18"/><Eye v-else :size="18"/></button></span>
            </label>
            <label v-if="mode === 'register'" class="auth-field">Xác nhận mật khẩu<input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="Nhập lại mật khẩu" /></label>
            <div v-if="mode === 'login'" class="auth-row"><label class="remember-label"><input v-model="remember" type="checkbox" /> Ghi nhớ tôi</label><button class="text-button" type="button" @click="switchMode('forgot')">Quên mật khẩu?</button></div>
            <p v-if="error" class="form-error" role="alert">{{ error }}</p>
            <p v-if="notice" class="form-notice" role="status">{{ notice }}</p>
            <button class="auth-submit" type="submit">{{ mode === 'login' ? 'ĐĂNG NHẬP' : mode === 'register' ? 'TẠO TÀI KHOẢN DEMO' : 'GỬI YÊU CẦU' }}<ArrowRight :size="17" /></button>
            <button v-if="mode === 'login'" class="google-button" type="button" @click="error = 'Google OAuth chưa được kết nối. Bạn có thể dùng đăng nhập demo.'"><span class="google-g">G</span><span>Đăng nhập bằng Google</span></button>
            <button v-if="mode === 'forgot'" class="back-link" type="button" @click="switchMode('login')"><ArrowLeft :size="16"/> Quay lại đăng nhập</button>
          </form>
          <div class="auth-demo-note"><LockKeyhole :size="14" /> Bản demo giao diện — nhập bất kỳ tài khoản và mật khẩu từ 6 ký tự. Không gửi hoặc lưu mật khẩu.</div>
        </div>
        <p class="auth-copyright">© 2026 TaskFlow. Xây dựng để làm việc hiệu quả hơn.</p>
      </section>
      <aside class="auth-right" aria-label="TaskFlow">
        <div class="auth-decor decor-one"></div><div class="auth-decor decor-two"></div>
        <div class="auth-right-content"><div class="auth-right-icon"><Mail :size="26" /></div><p>Biến ý tưởng thành<br/><strong>tiến độ thực tế.</strong></p><span>Tập trung • Cộng tác • Hoàn thành</span><div class="auth-progress-pill"><span></span><span></span><span></span></div></div>
      </aside>
    </div>
  </main>
</template>
