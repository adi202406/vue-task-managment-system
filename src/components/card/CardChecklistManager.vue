<script setup>
import { computed, onMounted, ref } from 'vue'
import IconGlyph from '../dashboard/IconGlyph.vue'
import { useWorkspaceDashboardStore } from '../../stores/workspaceDashboard'

const props = defineProps({
  boardId: { type: [Number, String], required: true },
  cardId: { type: [Number, String], required: true },
})

const dashboardStore = useWorkspaceDashboardStore()

const newChecklistTitle = ref('')
const newItemContent = ref({})
const editingChecklistId = ref(null)
const editingTitle = ref('')

const cardChecklists = computed(() =>
  dashboardStore.checklists.filter((cl) => String(cl.card_id ?? cl.cardId) === String(props.cardId))
)

const totalItems = computed(() => {
  let total = 0
  let done = 0
  cardChecklists.value.forEach((cl) => {
    const items = Array.isArray(cl.items) ? cl.items : []
    total += items.length
    done += items.filter((i) => i.is_completed).length
  })
  return { total, done }
})

const percentDone = computed(() =>
  totalItems.value.total ? Math.round((totalItems.value.done / totalItems.value.total) * 100) : 0
)

onMounted(() => {
  if (!dashboardStore.checklists.length) {
    dashboardStore.loadChecklists()
  }
})

function getItems(checklist) {
  return Array.isArray(checklist.items) ? checklist.items : []
}

async function addChecklist() {
  if (!newChecklistTitle.value.trim()) return
  try {
    await dashboardStore.createChecklist(props.boardId, props.cardId, {
      card_id: props.cardId,
      title: newChecklistTitle.value.trim(),
      position: cardChecklists.value.length + 1,
    })
    newChecklistTitle.value = ''
  } catch { }
}

function startEditChecklist(checklist) {
  editingChecklistId.value = checklist.id
  editingTitle.value = checklist.title || ''
}

async function saveChecklistTitle(checklistId) {
  if (!editingTitle.value.trim()) return
  try {
    await dashboardStore.updateChecklist(props.boardId, props.cardId, checklistId, {
      title: editingTitle.value.trim(),
    })
  } catch { }
  editingChecklistId.value = null
}

function cancelEditChecklist() {
  editingChecklistId.value = null
}

async function deleteChecklist(checklistId) {
  try {
    await dashboardStore.deleteChecklist(props.boardId, props.cardId, checklistId)
  } catch { }
}

function getNewItemRef(checklistId) {
  if (!(checklistId in newItemContent.value)) {
    newItemContent.value[checklistId] = ''
  }
  return newItemContent.value[checklistId]
}

async function addItem(checklistId) {
  const content = newItemContent.value[checklistId]
  if (!content?.trim()) return
  try {
    await dashboardStore.createChecklistItem(props.boardId, props.cardId, checklistId, {
      content: content.trim(),
      position: getItems(cardChecklists.value.find((cl) => cl.id === checklistId) || {}).length + 1,
      is_completed: false,
    })
    newItemContent.value[checklistId] = ''
  } catch { }
}

async function toggleItem(checklistId, item, checked) {
  try {
    await dashboardStore.updateChecklistItem(props.boardId, props.cardId, checklistId, item.id, {
      content: item.content,
      position: item.position,
      is_completed: checked,
    })
  } catch { }
}

async function deleteItem(checklistId, itemId) {
  try {
    await dashboardStore.deleteChecklistItem(props.boardId, props.cardId, checklistId, itemId)
  } catch { }
}
</script>

<template>
  <section class="mt-7">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="flex items-center gap-2 text-sm font-bold text-white">
        <IconGlyph name="check" class="h-4 w-4 text-slate-400" />
        Checklist
      </h3>
    </div>

    <div v-if="cardChecklists.length" class="mb-4 flex items-center gap-3">
      <span class="w-10 text-xs font-bold text-slate-400">{{ percentDone }}%</span>
      <div class="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div class="h-full rounded-full bg-blue-500" :style="{ width: `${percentDone}%` }" />
      </div>
    </div>

    <div v-if="dashboardStore.isLoadingChecklists" class="py-4 text-center text-xs text-slate-400">
      Loading checklists...
    </div>

    <div v-for="checklist in cardChecklists" :key="checklist.id" class="mb-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div class="flex items-center justify-between gap-2">
        <div v-if="editingChecklistId === checklist.id" class="flex flex-1 items-center gap-2">
          <input
            v-model="editingTitle"
            class="flex-1 rounded border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-sm font-semibold text-white outline-none"
            type="text"
            @keyup.enter="saveChecklistTitle(checklist.id)"
            @keyup.escape="cancelEditChecklist"
            @blur="saveChecklistTitle(checklist.id)"
          />
        </div>
        <button
          v-else
          class="flex-1 text-left text-sm font-semibold text-white hover:text-blue-300 transition"
          type="button"
          @click="startEditChecklist(checklist)"
        >
          {{ checklist.title || 'Untitled' }}
        </button>
        <button
          class="grid h-6 w-6 shrink-0 place-items-center rounded text-xs text-slate-500 hover:text-rose-400 transition"
          type="button"
          title="Delete checklist"
          @click="deleteChecklist(checklist.id)"
        >x</button>
      </div>

      <div class="mt-2 space-y-1">
        <label
          v-for="item in getItems(checklist)"
          :key="item.id"
          class="flex items-center gap-2 rounded px-1 py-0.5 text-sm text-slate-300 hover:bg-white/[0.04] transition group"
        >
          <input
            class="h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] text-blue-600 cursor-pointer"
            type="checkbox"
            :checked="item.is_completed"
            @change="toggleItem(checklist.id, item, $event.target.checked)"
          />
          <span :class="item.is_completed ? 'text-slate-500 line-through' : ''" class="flex-1">
            {{ item.content }}
          </span>
          <button
            class="shrink-0 px-1 text-xs text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-400"
            type="button"
            @click="deleteItem(checklist.id, item.id)"
          >x</button>
        </label>
      </div>

      <div class="mt-2 flex items-center gap-2">
        <input
          v-model="newItemContent[checklist.id]"
          class="flex-1 rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
          type="text"
          placeholder="Add item..."
          @keyup.enter="addItem(checklist.id)"
        />
        <button
          class="shrink-0 rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-200 hover:bg-blue-500/20 transition"
          type="button"
          @click="addItem(checklist.id)"
        >Add</button>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="newChecklistTitle"
        class="flex-1 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition"
        type="text"
        placeholder="New checklist title..."
        @keyup.enter="addChecklist"
      />
      <button
        class="shrink-0 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-500/20 transition"
        type="button"
        @click="addChecklist"
      >Add</button>
    </div>
  </section>
</template>
