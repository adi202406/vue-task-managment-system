<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { useWorkspaceDashboardStore } from '../stores/workspaceDashboard'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useWorkspaceDashboardStore()

const pageState = ref('loading')
const errorMessage = ref('')

async function acceptInvitation() {
  const token = route.query.token || route.params.token
  if (!token) {
    pageState.value = 'error'
    errorMessage.value = 'Token undangan tidak ditemukan. Pastikan link undangan valid.'
    return
  }

  pageState.value = 'loading'
  errorMessage.value = ''

  try {
    const workspace = await dashboardStore.acceptInvitationByToken(token)
    await router.replace({ name: 'workspace.show', params: { slug: workspace.slug } })
  } catch (error) {
    pageState.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memproses undangan.'
  }
}

onMounted(() => {
  dashboardStore.setCurrentUser(authStore.user)
  acceptInvitation()
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
    <div class="w-full max-w-lg rounded-[28px] border border-white/15 bg-white/[0.08] px-8 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm">
      <div v-if="pageState === 'loading'" class="space-y-5">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-300"></div>
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold text-white">Memproses Undangan</h1>
          <p class="text-sm leading-6 text-slate-400">Verifikasi undangan workspace...</p>
        </div>
      </div>

      <div v-else class="space-y-5">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/20 text-3xl text-rose-300">x</div>
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold text-white">Undangan Gagal</h1>
          <p class="text-sm leading-6 text-rose-200">{{ errorMessage }}</p>
        </div>
        <RouterLink
          to="/workspaces"
          class="mt-2 inline-flex items-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-white/90"
        >
          Kembali ke Workspaces
        </RouterLink>
      </div>
    </div>
  </main>
</template>
