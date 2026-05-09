<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AuthLayout from '../components/AuthLayout.vue'
import { getGoogleAuthUrl } from '../services/auth'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: true,
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const isProcessingOAuth = ref(false)

const successMessage = ref(
  route.query.registered === '1'
    ? 'Akun berhasil dibuat. Silakan login untuk melanjutkan.'
    : ''
)

function extractEmbeddedToken() {
  if (route.query.token) return { token: route.query.token }
  if (route.query.access_token) return { token: route.query.access_token }

  const redirectValue = route.query.redirect

  if (typeof redirectValue === 'string' && redirectValue.includes('?')) {
    const embeddedSearch = redirectValue.slice(redirectValue.indexOf('?'))
    const params = Object.fromEntries(new URLSearchParams(embeddedSearch))

    if (params.token || params.access_token) {
      return params
    }
  }

  return null
}

function resolveRedirectTarget() {
  const redirectValue = route.query.redirect

  if (typeof redirectValue === 'string' && redirectValue) {
    const cleanPath = redirectValue.includes('?')
      ? redirectValue.slice(0, redirectValue.indexOf('?'))
      : redirectValue

    if (cleanPath && cleanPath.startsWith('/')) {
      return cleanPath
    }
  }

  return '/workspaces'
}

onMounted(async () => {
  const embeddedPayload = extractEmbeddedToken()

  if (embeddedPayload) {
    isProcessingOAuth.value = true

    try {
      authStore.captureTokenLogin(embeddedPayload)

      const target = resolveRedirectTarget()

      await router.replace(target)
    } catch (error) {
      errorMessage.value =
        error instanceof Error
          ? error.message
          : 'Login Google gagal diproses.'

      isProcessingOAuth.value = false
    }
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember,
    })

    await router.push(resolveRedirectTarget())
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Login gagal. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

function continueWithGoogle() {
  window.location.href = getGoogleAuthUrl()
}
</script>

<template>
  <!-- OAuth Processing -->
  <main v-if="isProcessingOAuth" class="flex min-h-screen items-center justify-center bg-[#030712] px-4 sm:px-6">
    <div
      class="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div v-if="errorMessage" class="space-y-4">
        <h1 class="text-xl sm:text-2xl font-semibold text-white">
          Login Google gagal
        </h1>

        <p class="text-sm leading-6 text-rose-200">
          {{ errorMessage }}
        </p>

        <RouterLink to="/login"
          class="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950">
          Kembali ke login
        </RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-cyan-300"></div>

        <h1 class="text-xl sm:text-2xl font-semibold text-white">
          Memproses login Google
        </h1>

        <p class="text-sm leading-6 text-slate-300">
          Token sedang ditangkap dan sesi login kamu sedang disiapkan.
        </p>
      </div>
    </div>
  </main>

  <!-- Login Form -->
  <AuthLayout v-else active-tab="login" title="Welcome back" subtitle="Sign in to continue to Nexora.">
    <div class="mt-6 sm:mt-8 space-y-4 sm:space-y-6">

      <!-- Success Message -->
      <div v-if="successMessage"
        class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base text-emerald-200">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage"
        class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base text-rose-200">
        {{ errorMessage }}
      </div>

      <!-- Google Login -->
      <button type="button" @click="continueWithGoogle"
        class="flex w-full items-center justify-center gap-3 rounded-[12px] sm:rounded-[14px] bg-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-[15px] font-semibold text-slate-900 transition duration-200 hover:bg-slate-100 hover:scale-[1.01]">
        <svg viewBox="0 0 48 48" class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
          <path fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
          <path fill="#FF3D00"
            d="M6.3 14.7 12.9 19.5C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
          <path fill="#4CAF50"
            d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
          <path fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.2 5.2-4 5.8l6.2 5.2C37.1 38.7 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
        </svg>

        <span>Continue with Google</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-3 text-xs sm:text-[13px] font-medium text-slate-500">
        <span class="h-px flex-1 bg-white/10"></span>
        <span>or</span>
        <span class="h-px flex-1 bg-white/10"></span>
      </div>

      <!-- Form -->
      <form class="space-y-4 sm:space-y-5" @submit.prevent="handleSubmit">

        <!-- Email -->
        <div class="space-y-1.5 sm:space-y-2">
          <label class="block text-xs sm:text-[13px] font-medium text-slate-300">
            Email address
          </label>

          <div
            class="flex items-center gap-2 sm:gap-3 rounded-[12px] sm:rounded-[14px] border border-white/10 bg-[rgba(15,23,42,0.6)] px-3 py-2 sm:px-4 sm:py-3 focus-within:border-[#2563eb]/50 focus-within:bg-[rgba(15,23,42,0.8)] transition-all">
            <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor"
              stroke-width="1.8">
              <path d="M3 5h18v14H3z" />
              <path d="m3 7 9 6 9-6" />
            </svg>

            <input v-model="form.email" type="email" required autocomplete="email" placeholder="you@company.com"
              class="w-full border-0 bg-transparent text-sm sm:text-[15px] text-white outline-none placeholder:text-slate-500">
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-1.5 sm:space-y-2">
          <label class="block text-xs sm:text-[13px] font-medium text-slate-300">
            Password
          </label>

          <div
            class="flex items-center gap-2 sm:gap-3 rounded-[12px] sm:rounded-[14px] border border-white/10 bg-[rgba(15,23,42,0.6)] px-3 py-2 sm:px-4 sm:py-3 focus-within:border-[#2563eb]/50 focus-within:bg-[rgba(15,23,42,0.8)] transition-all">
            <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor"
              stroke-width="1.8">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>

            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
              autocomplete="current-password" placeholder="Enter your password"
              class="w-full border-0 bg-transparent text-sm sm:text-[15px] text-white outline-none placeholder:text-slate-500">

            <button type="button" class="text-slate-400 transition hover:text-white"
              @click="showPassword = !showPassword">
              <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember -->
        <div class="flex flex-row items-center justify-between text-xs sm:text-[13px] text-slate-300">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative flex items-center justify-center">
              <input v-model="form.remember" type="checkbox"
                class="peer h-4 w-4 appearance-none rounded-[4px] border border-white/20 bg-white/5 transition-all checked:border-[#2563eb] checked:bg-[#2563eb] hover:border-white/30">
              <svg viewBox="0 0 14 14" fill="none" class="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7"></path>
              </svg>
            </div>
            <span class="group-hover:text-white transition-colors">Remember me</span>
          </label>

          <span class="text-[#3b82f6] font-medium cursor-pointer hover:text-[#60a5fa] transition-colors">
            Forgot password?
          </span>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="isSubmitting"
          class="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] sm:rounded-[14px] bg-[#2563eb] hover:bg-[#1d4ed8] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
          <span>
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </span>

          <span aria-hidden="true">→</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="pt-2 sm:pt-4 text-center text-xs sm:text-[13px] text-slate-400">
        Don't have an account?

        <RouterLink to="/register" class="ml-1 font-medium text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
          Create account →
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>