<script setup>
import { computed, ref } from 'vue'
import IconGlyph from '../dashboard/IconGlyph.vue'
import InlineLabelCreator from '../label/InlineLabelCreator.vue'
import { useWorkspaceDashboardStore } from '@/stores/workspaceDashboard'

const props = defineProps({
  boardId: { type: [Number, String], required: true },
  cardId: { type: [Number, String], required: true },
  currentLabels: { type: Array, default: () => [] },
})

const dashboardStore = useWorkspaceDashboardStore()
const showPicker = ref(false)
const isAttaching = ref(null)
const isDetaching = ref(null)
const showCreateForm = ref(false)

const allLabels = computed(() => dashboardStore.labels)

const availableLabels = computed(() => {
  const currentIds = new Set(props.currentLabels.map((l) => String(l.id)))
  return allLabels.value.filter((l) => !currentIds.has(String(l.id)))
})

async function attach(labelId) {
  isAttaching.value = labelId
  try {
    await dashboardStore.attachLabelToCard(props.boardId, props.cardId, labelId)
    showPicker.value = false
  } catch (error) {
    console.error('Failed to attach label:', error)
  } finally {
    isAttaching.value = null
  }
}

async function detach(labelId) {
  isDetaching.value = labelId
  try {
    await dashboardStore.detachLabelFromCard(props.boardId, props.cardId, labelId)
  } catch (error) {
    console.error('Failed to detach label:', error)
  } finally {
    isDetaching.value = null
  }
}

async function onLabelCreated(label) {
  showCreateForm.value = false
  await attach(String(label.id))
}
</script>

<template>
  <div id="section-labels">
    <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Labels</p>

    <TransitionGroup name="label-fade" tag="div" class="flex flex-wrap gap-2" appear>
      <span
        v-for="label in currentLabels"
        :key="label.id || label.name"
        class="group relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold text-white cursor-pointer"
        :style="{ backgroundColor: label.color }"
        :class="{ 'pointer-events-none opacity-60': isDetaching === label.id }"
        @click="detach(label.id)"
        title="Click to remove"
      >
        <svg v-if="isDetaching === label.id" class="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-linecap="round" />
        </svg>
        {{ label.name }}
        <span class="opacity-0 transition group-hover:opacity-100">x</span>
      </span>
    </TransitionGroup>

    <div class="relative mt-2">
      <button
        class="inline-flex h-7 items-center gap-1 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-2 text-xs font-semibold text-slate-400 transition hover:border-blue-500/40 hover:text-blue-200"
        type="button"
        @click="showPicker = !showPicker"
      >
        <IconGlyph name="plus" class="h-3.5 w-3.5" />
        Attach
      </button>

      <Transition name="fade-slide">
        <div
          v-if="showPicker"
          class="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-white/10 bg-[#0c142b] p-2 shadow-xl"
        >
          <div class="mb-1 flex items-center justify-between">
            <p class="px-1 text-xs font-semibold text-slate-400">
              {{ showCreateForm ? 'New Label' : 'Labels' }}
            </p>
            <button
              v-if="showCreateForm"
              class="grid h-5 w-5 place-items-center rounded text-xs text-slate-500 hover:text-white"
              type="button"
              @click="showCreateForm = false"
            >
              x
            </button>
          </div>

          <template v-if="showCreateForm">
            <InlineLabelCreator @created="onLabelCreated" />
          </template>

          <template v-else>
            <p v-if="!availableLabels.length" class="px-2 py-3 text-xs text-slate-400 text-center">
              No labels available
            </p>
            <button
              v-for="label in availableLabels"
              :key="label.id"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-white transition hover:bg-white/[0.06]"
              :class="{ 'pointer-events-none opacity-60': isAttaching === label.id }"
              type="button"
              :disabled="isAttaching === label.id"
              @click="attach(label.id)"
            >
              <span class="grid h-4 w-4 shrink-0 place-items-center rounded-sm" :style="{ backgroundColor: label.color }">
                <svg v-if="isAttaching === label.id" class="h-3 w-3 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-linecap="round" />
                </svg>
              </span>
              {{ label.name }}
            </button>

            <button
              class="mt-1 flex w-full items-center gap-2 rounded-md border border-dashed border-white/10 px-2 py-1.5 text-left text-xs font-semibold text-blue-300 transition hover:bg-blue-500/10"
              type="button"
              @click="showCreateForm = true"
            >
              <IconGlyph name="plus" class="h-3.5 w-3.5" />
              Create new label
            </button>
          </template>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.label-fade-enter-active,
.label-fade-leave-active {
  transition: all 0.2s ease;
}
.label-fade-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.label-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
