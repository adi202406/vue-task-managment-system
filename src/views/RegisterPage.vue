<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthLayout from '../components/AuthLayout.vue'
import { extractToken, getGoogleAuthUrl } from '../services/auth'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const passwordChecks = computed(() => [
  {
    label: 'At least 8 characters',
    valid: form.value.password.length >= 8,
  },
  {
    label: '1 uppercase letter',
    valid: /[A-Z]/.test(form.value.password),
  },
  {
    label: '1 number',
    valid: /\d/.test(form.value.password),
  },
])

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const payload = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password,
    }, true)

    if (extractToken(payload)) {
      await router.push('/workspaces')
      return
    }

    await router.push({ path: '/login', query: { registered: '1' } })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Registrasi gagal. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

function continueWithGoogle() {
  window.location.href = getGoogleAuthUrl()
}
</script>

<template>
  <AuthLayout
    active-tab="register"
    title="Create your account"
    subtitle="Start your journey with Nexora."
  >
    <div class="mt-10 space-y-7">
      <div v-if="errorMessage" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-base text-rose-200">
        {{ errorMessage }}
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-4 rounded-2xl bg-white px-6 py-4 text-xl font-medium text-slate-950 transition hover:scale-[1.01]"
        @click="continueWithGoogle"
      >
        <svg viewBox="0 0 48 48" class="h-7 w-7" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z"/>
          <path fill="#FF3D00" d="M6.3 14.7 12.9 19.5C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.2 5.2-4 5.8l6.2 5.2C37.1 38.7 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z"/>
        </svg>
        Continue with Google
      </button>

      <div class="flex items-center gap-4 text-base text-slate-500">
        <span class="h-px flex-1 bg-white/10"></span>
        <span>or</span>
        <span class="h-px flex-1 bg-white/10"></span>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-3 block text-lg text-white">Full name</label>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.6)] px-5 py-4">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.6-3.3 4.2-5 8-5s6.4 1.7 8 5" />
            </svg>
            <input
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full border-0 bg-transparent text-xl text-white outline-none placeholder:text-slate-500"
              placeholder="Enter your full name"
            >
          </div>
        </div>

        <div>
          <label class="mb-3 block text-lg text-white">Email address</label>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.6)] px-5 py-4">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M3 5h18v14H3z" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full border-0 bg-transparent text-xl text-white outline-none placeholder:text-slate-500"
              placeholder="you@company.com"
            >
          </div>
        </div>

        <div>
          <label class="mb-3 block text-lg text-white">Password</label>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.6)] px-5 py-4">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="w-full border-0 bg-transparent text-xl text-white outline-none placeholder:text-slate-500"
              placeholder="Create a strong password"
            >
            <button type="button" class="text-slate-400 transition hover:text-white" @click="showPassword = !showPassword">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          <div class="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-base text-slate-400">
            <div
              v-for="check in passwordChecks"
              :key="check.label"
              class="flex items-center gap-2"
            >
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full border text-[11px]"
                :class="check.valid ? 'border-[#2563eb] bg-[#2563eb]/20 text-[#60a5fa]' : 'border-white/12 text-slate-500'"
              >
                <span v-if="check.valid">v</span>
              </span>
              <span>{{ check.label }}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-4 text-2xl font-medium text-white shadow-[0_18px_50px_rgba(37,99,235,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmitting"
        >
          <span>{{ isSubmitting ? 'Creating account...' : 'Create account' }}</span>
          <span aria-hidden="true">-&gt;</span>
        </button>
      </form>

      <p class="text-center text-base leading-7 text-slate-400">
        By creating an account, you agree to our
        <span class="text-[#2f6bff]">Terms of Service</span>
        and
        <span class="text-[#2f6bff]">Privacy Policy</span>.
      </p>

      <p class="text-center text-xl text-slate-400">
        Already have an account?
        <RouterLink to="/login" class="ml-2 text-[#2f6bff]">Sign in -&gt;</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
