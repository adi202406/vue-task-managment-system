<script setup>
import { computed, ref } from 'vue'
import IconGlyph from '@/components/dashboard/IconGlyph.vue'
import { useWorkspaceDashboardStore } from '@/stores/workspaceDashboard'
import LabelFormModal from './LabelFormModal.vue'
import LabelDeleteConfirm from './LabelDeleteConfirm.vue'

const dashboardStore = useWorkspaceDashboardStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedLabel = ref(null)
const successMessage = ref('')

const labels = computed(() => dashboardStore.labels)
const isLoading = computed(() => dashboardStore.isLoadingLabels)

function openCreateModal() {
  selectedLabel.value = null
  showCreateModal.value = true
}

function openEditModal(label) {
  selectedLabel.value = label
  showEditModal.value = true
}

function openDeleteConfirm(label) {
  selectedLabel.value = label
  showDeleteConfirm.value = true
}

async function handleCreate(payload) {
  await dashboardStore.createLabel(payload)
  showCreateModal.value = false
  successMessage.value = `Label "${payload.name}" berhasil dibuat!`
  clearSuccess()
}

async function handleUpdate(payload) {
  if (!selectedLabel.value?.id) return
  await dashboardStore.updateLabel(selectedLabel.value.id, payload)
  showEditModal.value = false
  selectedLabel.value = null
  successMessage.value = `Label berhasil diperbarui!`
  clearSuccess()
}

async function handleDelete() {
  if (!selectedLabel.value?.id) return
  await dashboardStore.deleteLabel(selectedLabel.value.id)
  showDeleteConfirm.value = false
  selectedLabel.value = null
  successMessage.value = 'Label berhasil dihapus.'
  clearSuccess()
}

function clearSuccess() {
  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold text-slate-500">Workspace Settings / Labels</p>
        <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Label Management</h1>
        <p class="mt-1 text-sm text-slate-400">Create and organize labels to categorize your tasks across all boards.</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 cursor-pointer"
        type="button"
      >
        <IconGlyph name="plus" class="h-4 w-4" />
        Create New Label
      </button>
    </div>

    <div v-if="successMessage" class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
      {{ successMessage }}
    </div>

    <div class="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside class="rounded-lg border border-white/10 bg-[#0c142b]/70 p-5">
        <div class="grid h-10 w-10 place-items-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-200">
          <IconGlyph name="template" class="h-5 w-5" />
        </div>
        <p class="mt-5 text-sm font-semibold text-slate-300">Total Labels</p>
        <p class="mt-2 text-5xl font-black tracking-tight text-white">{{ labels.length }}</p>
        <div class="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
          <div class="h-full rounded-full bg-blue-500" :style="{ width: `${Math.min(100, Math.max(8, labels.length * 12))}%` }" />
        </div>
        <div class="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Available labels</span>
          <span>{{ labels.length }} total</span>
        </div>
      </aside>

      <section class="overflow-hidden rounded-lg border border-white/10 bg-[#0c142b]/70">
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-blue-500"></div>
        </div>

        <template v-else-if="!labels.length">
          <div class="px-6 py-16 text-center">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400">
              <IconGlyph name="template" class="h-6 w-6" />
            </div>
            <h2 class="mt-4 text-lg font-semibold text-white">Belum ada label</h2>
            <p class="mt-2 text-sm text-slate-400">Buat label pertama untuk mulai mengkategorikan task.</p>
            <button
              @click="openCreateModal"
              class="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer"
              type="button"
            >
              <IconGlyph name="plus" class="h-4 w-4" />
              Create Label
            </button>
          </div>
        </template>

        <template v-else>
          <div class="grid grid-cols-[1fr_96px] border-b border-white/10 bg-blue-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-100">
            <span>Label Name</span>
            <span class="text-right">Actions</span>
          </div>
          <div class="divide-y divide-white/8">
            <div
              v-for="label in labels"
              :key="label.id"
              class="grid grid-cols-[1fr_96px] items-center gap-3 px-4 py-4"
            >
              <div class="flex min-w-0 items-center gap-3">
                <span class="h-7 w-7 shrink-0 rounded-md" :style="{ backgroundColor: label.color }" />
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-white">{{ label.name }}</p>
                  <p class="truncate text-xs text-slate-400">{{ label.color }} — {{ label.description || 'No description' }}</p>
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <button
                  @click="openEditModal(label)"
                  class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition cursor-pointer"
                  type="button"
                  title="Edit label"
                >
                  <IconGlyph name="template" class="h-4 w-4" />
                </button>
                <button
                  @click="openDeleteConfirm(label)"
                  class="grid h-8 w-8 place-items-center rounded-lg border border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 transition cursor-pointer"
                  type="button"
                  title="Delete label"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>

    <LabelFormModal
      :show="showCreateModal"
      :label="null"
      @close="closeModals"
      @save="handleCreate"
    />

    <LabelFormModal
      :show="showEditModal"
      :label="selectedLabel"
      @close="closeModals"
      @save="handleUpdate"
    />

    <LabelDeleteConfirm
      :show="showDeleteConfirm"
      :label="selectedLabel"
      @close="closeModals"
      @confirm="handleDelete"
    />
  </div>
</template>
