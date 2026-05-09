<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const errorMessage = ref('')
const workspaces = ref([])

const workspaceCountLabel = computed(() => {
  const total = workspaces.value.length
  return `${total} workspace${total === 1 ? '' : 's'} tersedia`
})

function normalizeWorkspaces(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  return []
}

function getWorkspaceTitle(workspace, index) {
  return (
    workspace?.name ||
    workspace?.title ||
    workspace?.workspace_name ||
    `Workspace ${index + 1}`
  )
}

function getWorkspaceDescription(workspace) {
  return (
    workspace?.description ||
    workspace?.notes ||
    workspace?.summary ||
    'Belum ada deskripsi untuk workspace ini.'
  )
}

function getWorkspaceMeta(workspace) {
  return [
    workspace?.slug ? `Slug: ${workspace.slug}` : null,
    workspace?.owner?.name ? `Owner: ${workspace.owner.name}` : null,
    workspace?.members_count !== undefined ? `${workspace.members_count} members` : null,
  ].filter(Boolean)
}

async function loadWorkspaces() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const payload = await authStore.loadWorkspaces()
    workspaces.value = normalizeWorkspaces(payload)
  } catch (error) {
    if (error instanceof Error && error.status === 401) {
      authStore.logout()
      await router.push('/login')
      return
    }

    errorMessage.value =
      error instanceof Error ? error.message : 'Workspace gagal dimuat. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}

onMounted(() => {
  loadWorkspaces()
})
</script>

<template>
  <main class="min-h-screen bg-[#07111f] px-5 py-6 text-white sm:px-8 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(11,24,44,0.96),rgba(8,14,27,0.98))] px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.32em] text-cyan-300/70">Workspace Hub</p>
          <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Daftar Workspace</h1>
          <p class="mt-2 text-sm text-slate-300 sm:text-base">
            Data diambil dari endpoint <span class="font-medium text-white">`/workspaces`</span> yang dilindungi <span class="font-medium text-white">`auth:sanctum`</span>.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            @click="loadWorkspaces"
          >
            Refresh
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </header>

      <section class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article class="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p class="text-sm text-slate-400">Status</p>
          <p class="mt-3 text-2xl font-semibold text-white">
            {{ isLoading ? 'Memuat...' : 'Terhubung' }}
          </p>
        </article>

        <article class="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p class="text-sm text-slate-400">Workspace</p>
          <p class="mt-3 text-2xl font-semibold text-white">{{ workspaceCountLabel }}</p>
        </article>

        <article class="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p class="text-sm text-slate-400">Auth</p>
          <p class="mt-3 text-2xl font-semibold text-white">Sanctum Protected</p>
        </article>
      </section>

      <section class="rounded-[28px] border border-white/10 bg-[rgba(8,13,24,0.92)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:p-6">
        <div v-if="errorMessage" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {{ errorMessage }}
        </div>

        <div v-else-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="index in 6"
            :key="index"
            class="h-44 animate-pulse rounded-[24px] border border-white/8 bg-white/[0.04]"
          ></div>
        </div>

        <div v-else-if="workspaces.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(workspace, index) in workspaces"
            :key="workspace.id || workspace.uuid || workspace.slug || index"
            class="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,41,0.96),rgba(8,14,26,0.96))] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-cyan-300/75">Workspace</p>
                <h2 class="mt-3 text-2xl font-semibold text-white">
                  {{ getWorkspaceTitle(workspace, index) }}
                </h2>
              </div>
              <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                #{{ workspace.id || index + 1 }}
              </span>
            </div>

            <p class="mt-4 text-sm leading-6 text-slate-300">
              {{ getWorkspaceDescription(workspace) }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="item in getWorkspaceMeta(workspace)"
                :key="item"
                class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
              >
                {{ item }}
              </span>
            </div>
          </article>
        </div>

        <div v-else class="rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
          <h2 class="text-2xl font-semibold text-white">Belum ada workspace</h2>
          <p class="mt-3 text-sm text-slate-400">
            Endpoint berhasil dipanggil, tapi belum mengembalikan data workspace.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
