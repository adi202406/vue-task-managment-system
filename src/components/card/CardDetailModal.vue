<script setup>
import { computed, nextTick, reactive, watch } from 'vue'
import IconGlyph from '../dashboard/IconGlyph.vue'
import CardLabelManager from './CardLabelManager.vue'
import CardAssigneeManager from './CardAssigneeManager.vue'
import CardChecklistManager from './CardChecklistManager.vue'
import { useWorkspaceDashboardStore } from '@/stores/workspaceDashboard'

const SECTION_IDS = {
  Members: 'section-members',
  Labels: 'section-labels',
  Checklist: 'section-checklist',
  Dates: 'section-dates',
}

const props = defineProps({
  show: { type: Boolean, default: false },
  card: { type: Object, default: null },
  board: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
  cardDetailError: { type: String, default: '' },
})

const emit = defineEmits(['close', 'update', 'delete'])

const dashboardStore = useWorkspaceDashboardStore()

const form = reactive({
  title: '',
  description: '',
  due_date: '',
  position: 0,
  status_id: null,
})

const statusName = computed(() => {
  const found = dashboardStore.statuses.find((s) => String(s.id) === String(form.status_id))
  return found?.name || 'Uncategorized'
})

function dateValue(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

function fillForm(card) {
  if (!card) return
  form.title = card?.title || ''
  form.description = card?.description === 'Detail pekerjaan belum ditambahkan.' ? '' : card?.description || ''
  form.due_date = dateValue(card?.due || card?.raw?.due_date || '')
  form.position = Number(card?.raw?.position ?? card?.position ?? 0)
  form.status_id = card?.raw?.status_id ?? card?.status_id ?? null
}

watch(() => props.card, (card) => {
  fillForm(card)
}, { immediate: true })

function getCurrentLabels() {
  return props.card?.labels || []
}

function getCurrentAssignees() {
  return props.card?.assignees || []
}

function getBoardMembers() {
  return props.board?.rawMembers || []
}

function scrollToSection(sectionId) {
  nextTick(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function handleSidebarClick(action) {
  const id = SECTION_IDS[action]
  if (id) scrollToSection(id)
}

function handleClose() {
  emit('close')
}

async function handleSave() {
  if (!form.title.trim()) return
  emit('update', {
    title: form.title.trim(),
    description: form.description || null,
    due_date: form.due_date || null,
    position: form.position,
    status_id: form.status_id || null,
  })
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 grid place-items-center bg-[#020611]/70 px-4 py-6 backdrop-blur-md" @click.self="handleClose">
        <div class="flex max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#071124] shadow-[0_34px_100px_rgba(0,0,0,0.55)]">
          <section class="min-w-0 flex-1 overflow-y-auto bg-[#071124] p-5 sm:p-7">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2 text-slate-400">
                  <IconGlyph name="template" class="h-4 w-4 mt-1" />
                  <input
                    v-model="form.title"
                    class="-mt-1 w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-lg font-bold leading-6 text-white outline-none transition focus:border-blue-500/40 focus:bg-blue-500/10"
                    type="text"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-400">
                  in list <span class="font-semibold text-blue-300">{{ statusName || board?.title }}</span>
                </p>
              </div>
              <button class="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white" type="button" @click="handleClose">
                x
              </button>
            </div>

            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <div id="section-members">
                <CardAssigneeManager
                  :board-id="board?.id"
                  :card-id="card?.id"
                  :current-assignees="getCurrentAssignees()"
                  :board-members="getBoardMembers()"
                />
              </div>
              <CardLabelManager
                :board-id="board?.id"
                :card-id="card?.id"
                :current-labels="getCurrentLabels()"
              />
            </div>

            <div v-if="cardDetailError" class="mt-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {{ cardDetailError }}
            </div>

            <div v-if="isLoading" class="mt-5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              Loading card detail...
            </div>

            <div id="section-dates" class="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500" for="card-detail-status">Status</label>
                <select
                  v-model="form.status_id"
                  id="card-detail-status"
                  class="w-full rounded-lg border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500"
                >
                  <option :value="null">Uncategorized</option>
                  <option
                    v-for="status in dashboardStore.statuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500" for="card-detail-due-date">Due Date</label>
                <input
                  v-model="form.due_date"
                  id="card-detail-due-date"
                  type="date"
                  class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500" for="card-detail-position">Position</label>
                <input
                  v-model.number="form.position"
                  id="card-detail-position"
                  min="0"
                  type="number"
                  class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <section class="mt-7">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="flex items-center gap-2 text-sm font-bold text-white">
                  <IconGlyph name="template" class="h-4 w-4 text-slate-400" />
                  Description
                </h3>
              </div>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full resize-none rounded-lg border border-white/8 bg-blue-500/10 p-4 text-sm leading-6 text-slate-300 outline-none transition focus:border-blue-500/50"
                placeholder="Tambahkan deskripsi card..."
              ></textarea>
            </section>

            <div id="section-checklist">
              <CardChecklistManager
                :board-id="board?.id"
                :card-id="card?.id"
              />
            </div>
          </section>

          <aside class="hidden w-48 shrink-0 border-l border-white/10 bg-blue-500/10 p-4 sm:block">
            <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Add to Card</p>
            <div class="space-y-2">
              <button
                v-for="action in ['Members', 'Labels', 'Checklist', 'Dates']"
                :key="action"
                class="flex h-9 w-full items-center gap-2 rounded-lg bg-blue-500/10 px-3 text-xs font-semibold text-slate-200 transition hover:bg-blue-500/20"
                type="button"
                @click="handleSidebarClick(action)"
              >
                <IconGlyph :name="action === 'Members' ? 'users' : action === 'Dates' ? 'calendar' : 'template'" class="h-4 w-4" />
                {{ action }}
              </button>
            </div>
            <p class="mb-3 mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Actions</p>
            <div class="space-y-2">
              <button v-for="action in ['Move', 'Copy', 'Archive']" :key="action" class="flex h-9 w-full items-center gap-2 rounded-lg bg-blue-500/10 px-3 text-xs font-semibold text-slate-200 transition hover:bg-blue-500/20" type="button">
                <IconGlyph name="chevron" class="h-4 w-4" />
                {{ action }}
              </button>
              <button class="flex h-9 w-full items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-500" type="button" @click="handleSave">
                <IconGlyph name="check" class="h-4 w-4" />
                Save
              </button>
              <button class="flex h-9 w-full items-center gap-2 rounded-lg bg-rose-500/15 px-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25" type="button" @click="handleDelete">
                x
                Delete
              </button>
            </div>
          </aside>
        </div>
      </div>
    </transition>
  </teleport>
</template>
