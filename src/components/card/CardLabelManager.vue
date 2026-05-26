<script setup>
import { computed, ref } from 'vue'
import IconGlyph from '../dashboard/IconGlyph.vue'
import { useWorkspaceDashboardStore } from '../../stores/workspaceDashboard'

const props = defineProps({
  boardId: { type: [Number, String], required: true },
  cardId: { type: [Number, String], required: true },
  currentLabels: { type: Array, default: () => [] },
})

const dashboardStore = useWorkspaceDashboardStore()
const showPicker = ref(false)

const allLabels = computed(() => dashboardStore.labels)

const availableLabels = computed(() => {
  const currentIds = new Set(props.currentLabels.map((l) => String(l.id)))
  return allLabels.value.filter((l) => !currentIds.has(String(l.id)))
})

async function attach(labelId) {
  try {
    await dashboardStore.attachLabelToCard(props.boardId, props.cardId, labelId)
    showPicker.value = false
  } catch { }
}

async function detach(labelId) {
  try {
    await dashboardStore.detachLabelFromCard(props.boardId, props.cardId, labelId)
  } catch { }
}
</script>

<template>
  <div>
    <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Labels</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="label in currentLabels"
        :key="label.id || label.name"
        class="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold text-white cursor-pointer"
        :style="{ backgroundColor: label.color }"
        @click="detach(label.id)"
        title="Click to remove"
      >
        {{ label.name }}
        <span class="opacity-0 transition group-hover:opacity-100">x</span>
      </span>
      <div class="relative">
        <button
          class="inline-flex h-7 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
          type="button"
          @click="showPicker = !showPicker"
        >
          <IconGlyph name="plus" class="h-3.5 w-3.5" />
          Attach
        </button>
        <div
          v-if="showPicker"
          class="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-white/10 bg-[#0c142b] p-2 shadow-xl"
        >
          <p v-if="!availableLabels.length" class="px-2 py-3 text-xs text-slate-400 text-center">No labels available</p>
          <button
            v-for="label in availableLabels"
            :key="label.id"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-white transition hover:bg-white/[0.06]"
            type="button"
            @click="attach(label.id)"
          >
            <span class="h-4 w-4 shrink-0 rounded-sm" :style="{ backgroundColor: label.color }" />
            {{ label.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
