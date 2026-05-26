<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import IconGlyph from '../components/dashboard/IconGlyph.vue'
import TopNavbar from '../components/dashboard/TopNavbar.vue'
import UserProfilePanel from '../components/UserProfilePanel.vue'
import LabelList from './labels/LabelList.vue'
import { useAuthStore } from '../stores/auth'
import { useWorkspaceDashboardStore } from '../stores/workspaceDashboard'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useWorkspaceDashboardStore()

const showMobileSidebar = ref(false)
const showProfilePanel = ref(false)
const showWorkspaceModal = ref(false)
const activePanel = ref('workspaces')
const showDeleteConfirm = ref(false)
const workspaceModalMode = ref('create')
const selectedWorkspaceCard = ref(null)
const formError = ref('')
const successMessage = ref('')
const isSavingWorkspace = ref(false)
const isDeletingWorkspace = ref(false)
const bannerImageInput = ref(null)
const bannerImagePreview = ref('')
const existingBannerImage = ref('')

const workspaceForm = reactive({
  title: '',
  description: '',
  banner_image: null,
  banner_image_public_id: '',
  visibility: 'private',
})

const workspace = computed(() => dashboardStore.normalizedWorkspace)
const workspaceCards = computed(() => dashboardStore.workspaceCards)

function resetWorkspaceForm(card = null) {
  workspaceForm.title = card?.raw?.title || card?.name || ''
  workspaceForm.description = card?.description === 'Manage boards, tasks, and team collaboration.' ? '' : card?.description || ''
  workspaceForm.banner_image = null
  workspaceForm.banner_image_public_id = card?.raw?.banner_image_public_id || card?.bannerImagePublicId || ''
  workspaceForm.visibility = card?.visibility || 'private'
  existingBannerImage.value = card?.raw?.banner_image || card?.bannerImage || ''
  bannerImagePreview.value = existingBannerImage.value
  if (bannerImageInput.value) bannerImageInput.value.value = ''
  formError.value = ''
}

function handleBannerImageChange(event) {
  const file = event.target.files?.[0] || null
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (!file) {
    workspaceForm.banner_image = null
    bannerImagePreview.value = existingBannerImage.value
    return
  }

  if (!allowedTypes.includes(file.type)) {
    workspaceForm.banner_image = null
    bannerImagePreview.value = existingBannerImage.value
    event.target.value = ''
    formError.value = 'Banner image harus berupa file JPG, JPEG, atau PNG.'
    return
  }

  workspaceForm.banner_image = file
  bannerImagePreview.value = URL.createObjectURL(file)
  formError.value = ''
}

function openCreateWorkspace() {
  workspaceModalMode.value = 'create'
  selectedWorkspaceCard.value = null
  resetWorkspaceForm()
  showWorkspaceModal.value = true
}

function openEditWorkspace(card) {
  workspaceModalMode.value = 'edit'
  selectedWorkspaceCard.value = card
  resetWorkspaceForm(card)
  showWorkspaceModal.value = true
}

async function openWorkspace(card) {
  if (!card?.slug) return
  await router.push({ name: 'workspace.show', params: { slug: card.slug } })
}

async function submitWorkspace() {
  formError.value = ''
  successMessage.value = ''
  isSavingWorkspace.value = true

  try {
    const payload = {
      title: workspaceForm.title,
      description: workspaceForm.description || null,
      banner_image: workspaceForm.banner_image,
      banner_image_public_id: workspaceForm.banner_image_public_id || null,
      visibility: workspaceForm.visibility,
      owner_id: authStore.user?.id,
    }

    const workspaceKey = selectedWorkspaceCard.value?.id
    const workspace =
      workspaceModalMode.value === 'create'
        ? await dashboardStore.createWorkspace(payload)
        : await dashboardStore.updateWorkspace(workspaceKey, payload)

    showWorkspaceModal.value = false
    successMessage.value = workspaceModalMode.value === 'create'
      ? 'Workspace berhasil dibuat.'
      : 'Workspace berhasil diperbarui.'

    if (workspace?.slug) {
      const card = dashboardStore.workspaceCards.find((item) => String(item.slug) === String(workspace.slug))
      selectedWorkspaceCard.value = card || {
        id: workspace.id,
        slug: workspace.slug,
        name: workspace.title || workspace.name,
        description: workspace.description || '',
        bannerImage: workspace.banner_image || '',
        bannerImagePublicId: workspace.banner_image_public_id || '',
        visibility: workspace.visibility || 'private',
      }
      await router.push({ name: 'workspace.show', params: { slug: workspace.slug } })
    }
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Workspace gagal disimpan.'
  } finally {
    isSavingWorkspace.value = false
  }
}

function askDeleteWorkspace(card = selectedWorkspaceCard.value) {
  selectedWorkspaceCard.value = card
  showDeleteConfirm.value = true
}

async function confirmDeleteWorkspace() {
  const workspaceKey = selectedWorkspaceCard.value?.id
  if (!workspaceKey) return
  formError.value = ''
  successMessage.value = ''
  isDeletingWorkspace.value = true

  try {
    await dashboardStore.deleteWorkspace(workspaceKey)
    selectedWorkspaceCard.value = null
    showDeleteConfirm.value = false
    successMessage.value = 'Workspace berhasil dihapus.'
    await router.push({ name: 'workspaces.index' })
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Workspace gagal dihapus.'
  } finally {
    isDeletingWorkspace.value = false
  }
}

onMounted(() => {
  dashboardStore.setCurrentUser(authStore.user)
  dashboardStore.loadWorkspaceList()
})
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-[#020611] text-white">
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(109,93,252,0.14),transparent_24%),linear-gradient(180deg,rgba(5,10,24,0.96),rgba(2,6,17,1))]" />
    <div class="pointer-events-none fixed inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:56px_56px]" />

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showMobileSidebar" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" @click.self="showMobileSidebar = false">
        <DashboardSidebar
          mobile
          :user="authStore.user"
          :workspace="workspace"
          :active-panel="activePanel"
          @navigate="activePanel = $event; showMobileSidebar = false"
          @close="showMobileSidebar = false"
          @open-profile="showProfilePanel = true; showMobileSidebar = false"
        />
      </div>
    </transition>

    <div class="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden rounded-none border-x border-white/10 bg-[rgba(5,10,24,0.82)] shadow-[0_0_100px_rgba(0,0,0,0.35)] xl:rounded-2xl">
      <div class="flex min-h-screen">
        <DashboardSidebar
          :user="authStore.user"
          :workspace="workspace"
          :active-panel="activePanel"
          @navigate="activePanel = $event"
          @open-profile="showProfilePanel = true"
        />

        <main class="min-w-0 flex-1">
          <TopNavbar
            :user="authStore.user"
            @open-sidebar="showMobileSidebar = true"
            @toggle-profile="showProfilePanel = !showProfilePanel"
          />

          <div v-if="activePanel === 'workspaces'" class="px-4 py-8 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">My Workspaces</h1>
                <p class="mt-3 text-sm text-slate-400">All workspaces you own or are a member of.</p>
              </div>
              <button class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6d5dfc] to-[#3b6cff] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(59,108,255,0.38)]" type="button" @click="openCreateWorkspace">
                <IconGlyph name="plus" class="h-5 w-5" />
                Create Workspace
              </button>
            </div>

            <div v-if="successMessage" class="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
              {{ successMessage }}
            </div>
            <div v-if="formError" class="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
              {{ formError }}
            </div>

            <div v-if="dashboardStore.isLoading" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <div v-for="item in 8" :key="item" class="h-[288px] animate-pulse rounded-lg border border-white/10 bg-white/[0.035]" />
            </div>

            <div v-else-if="workspaceCards.length" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <article
                v-for="(card, index) in workspaceCards"
                :key="card.id"
                class="group relative flex min-h-[288px] overflow-hidden rounded-lg border border-white/10 bg-[#071124]/80 p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-[#6d5dfc]/40 hover:shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
              >
                <span class="pointer-events-none absolute inset-0 opacity-90" :style="{ background: `radial-gradient(circle at 74% 18%, ${card.accent}33, transparent 25%), linear-gradient(135deg, ${card.accent}18, rgba(7,17,36,0.38) 45%, rgba(4,9,22,0.86))` }" />
                <span class="pointer-events-none absolute -right-14 top-10 h-40 w-40 rotate-45 rounded-[2rem] border border-white/8 opacity-35 transition group-hover:scale-110" :style="{ borderColor: `${card.accent}55` }" />
                <span class="pointer-events-none absolute right-10 top-16 h-24 w-24 rounded-full border border-white/8 opacity-30" :style="{ borderColor: `${card.accent}55` }" />

                <button class="relative flex w-full flex-col text-left" type="button" @click="openWorkspace(card)">
                  <span class="flex items-start justify-between gap-4">
                    <span class="grid h-14 w-14 place-items-center rounded-lg text-2xl font-semibold text-white shadow-[0_14px_32px_rgba(0,0,0,0.26)]" :style="{ background: `linear-gradient(135deg, ${card.accent}, rgba(255,255,255,0.08))` }">
                      {{ card.initial }}
                    </span>
                  </span>

                  <span class="mt-6 block">
                    <span class="flex flex-wrap items-center gap-2">
                      <span class="text-lg font-semibold text-white">{{ card.name }}</span>
                    </span>
                    <span class="mt-2 line-clamp-2 block text-sm leading-6 text-slate-300">{{ card.description }}</span>
                  </span>

                  <span class="mt-auto">
                    <span class="flex items-center">
                      <span
                        v-for="member in card.membersList.slice(0, 5)"
                        :key="member.id || member.email || member.name"
                        class="-ml-1 first:ml-0 grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-[#071124] bg-gradient-to-br from-sky-300 to-blue-700 text-[10px] font-bold text-white"
                      >
                        <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
                        <span v-else>{{ member.name.split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase() }}</span>
                      </span>
                      <span v-if="card.members > 5" class="ml-2 rounded-full bg-white/7 px-3 py-1 text-xs text-slate-300">+{{ card.members - 5 }}</span>
                    </span>

                    <span class="mt-5 flex items-center gap-2 text-sm text-slate-300">
                      <IconGlyph name="grid" class="h-4 w-4" />
                      {{ card.boards }} Boards
                    </span>
                  </span>
                </button>

                <span class="absolute right-4 top-4 z-10 flex items-center gap-2">
                  <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-200 transition hover:border-[#6d5dfc]/45 hover:text-white" type="button" title="Edit workspace" @click="openEditWorkspace(card)">
                    <IconGlyph name="template" class="h-4 w-4" />
                  </button>
                  <button class="grid h-8 w-8 place-items-center rounded-lg border border-rose-400/20 bg-rose-500/10 text-rose-200 transition hover:border-rose-300/45 hover:bg-rose-500/20" type="button" title="Delete workspace" @click="askDeleteWorkspace(card)">
                    x
                  </button>
                </span>
              </article>

              <button class="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-[#6d5dfc]/50 hover:bg-[#6d5dfc]/10" type="button" @click="openCreateWorkspace">
                <span class="grid h-14 w-14 place-items-center rounded-full border border-[#6d5dfc] text-[#8b7cff]">
                  <IconGlyph name="plus" class="h-7 w-7" />
                </span>
                <span class="mt-5 text-sm font-semibold text-[#8b7cff]">Create New Workspace</span>
                <span class="mt-2 max-w-44 text-sm leading-6 text-slate-400">Start a new workspace and invite your team.</span>
              </button>
            </div>

            <div v-else class="mt-8 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
              <h2 class="text-xl font-semibold text-white">Belum ada workspace</h2>
              <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Buat workspace pertama untuk mulai mengatur board, task, dan anggota tim.
              </p>
              <button class="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6d5dfc] to-[#3b6cff] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5" type="button" @click="openCreateWorkspace">
                <IconGlyph name="plus" class="h-5 w-5" />
                Create Workspace
              </button>
            </div>
          </div>

          <div v-else-if="activePanel === 'labels'" class="px-4 py-8 sm:px-6 lg:px-8">
            <LabelList />
          </div>
        </main>
      </div>

      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-6"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-6"
      >
        <aside v-if="showProfilePanel" class="fixed bottom-4 right-4 top-20 z-30 w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.92)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:w-96">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Profile</h2>
            <button type="button" class="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" @click="showProfilePanel = false">
              x
            </button>
          </div>
          <UserProfilePanel />
        </aside>
      </transition>
    </div>

    <teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showWorkspaceModal" class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/60 px-4 py-4 backdrop-blur-sm sm:py-6" @click.self="showWorkspaceModal = false">
          <form class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.95)] shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl" @submit.prevent="submitWorkspace">
            <div class="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-sky-300/70">Workspace</p>
                <h2 class="mt-2 text-xl font-semibold text-white">{{ workspaceModalMode === 'create' ? 'Create Workspace' : 'Update Workspace' }}</h2>
              </div>
              <button class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" type="button" @click="showWorkspaceModal = false">x</button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-5">
              <div v-if="formError" class="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {{ formError }}
              </div>

              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm text-slate-300">Title</label>
                  <input v-model="workspaceForm.title" required type="text" class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#6d5dfc]/60 focus:ring-2 focus:ring-[#6d5dfc]/20" placeholder="Marketing Team" />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-slate-300">Description</label>
                  <textarea v-model="workspaceForm.description" rows="4" class="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#6d5dfc]/60 focus:ring-2 focus:ring-[#6d5dfc]/20" placeholder="Describe this workspace"></textarea>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-slate-300">Banner Image</label>
                  <input ref="bannerImageInput" accept=".jpg,.jpeg,.png,image/jpeg,image/png" type="file" class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-[#6d5dfc] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white outline-none transition focus:border-[#6d5dfc]/60 focus:ring-2 focus:ring-[#6d5dfc]/20" @change="handleBannerImageChange" />
                  <p class="mt-2 text-xs text-slate-500">Format yang didukung: JPG, JPEG, PNG.</p>
                  <div v-if="bannerImagePreview" class="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <img :src="bannerImagePreview" alt="Banner preview" class="h-32 w-full object-cover" />
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-slate-300">Visibility</label>
                  <select v-model="workspaceForm.visibility" class="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6d5dfc]/60 focus:ring-2 focus:ring-[#6d5dfc]/20">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="shrink-0 border-t border-white/10 p-5">
              <button class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5dfc] to-[#3b6cff] px-5 text-sm font-medium text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(79,70,229,0.45)] disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="isSavingWorkspace">
              <IconGlyph name="plus" class="h-4 w-4" />
              {{ isSavingWorkspace ? 'Saving...' : workspaceModalMode === 'create' ? 'Create Workspace' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </teleport>

    <teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" @click.self="showDeleteConfirm = false">
          <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.95)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.48)]">
            <h2 class="text-xl font-semibold text-white">Delete Workspace</h2>
            <p class="mt-3 text-sm leading-6 text-slate-400">
              Workspace "{{ selectedWorkspaceCard?.name }}" akan dihapus. Aksi ini memakai soft delete di API.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button class="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]" type="button" @click="showDeleteConfirm = false">
                Cancel
              </button>
              <button class="h-10 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60" type="button" :disabled="isDeletingWorkspace" @click="confirmDeleteWorkspace">
                {{ isDeletingWorkspace ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>
