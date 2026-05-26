<script setup>
import { computed } from 'vue'
import IconGlyph from './IconGlyph.vue'

const props = defineProps({
  board: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['back', 'card-click', 'add-card'])

const fallbackLabels = [
  { id: 'todo', name: 'To Do', color: '#64748b', description: 'Ready to start' },
  { id: 'in-progress', name: 'In Progress', color: '#3b82f6', description: 'Work in progress' },
  { id: 'complete', name: 'Complete', color: '#10b981', description: 'Finished work' },
  { id: 'urgent', name: 'Urgent', color: '#ef4444', description: 'Critical path items' },
  { id: 'review', name: 'In Review', color: '#6d5dfc', description: 'Pending QA approval' },
]

function cardName(card, index = 0) {
  return card?.title || card?.name || card?.card_name || `Task ${index + 1}`
}

function cardText(card) {
  return card?.description || card?.content || card?.body || 'Detail pekerjaan belum ditambahkan.'
}

function cardAssignees(card) {
  const assignees = card?.assignees || card?.users || card?.members || []
  return Array.isArray(assignees) ? assignees : []
}

function cardLabelList(card, board, index) {
  const labels = Array.isArray(card?.labels) ? card.labels : []
  if (labels.length) {
    return labels.map((label) => ({
      id: label?.id ?? label?.name,
      name: label?.name || label?.title || 'Label',
      color: label?.color || board.color || '#3b82f6',
      description: label?.description || '',
    }))
  }

  const status = String(card?.status || card?.state || card?.label || '').toLowerCase().replace(/\s+/g, '-')
  const statusLabel = fallbackLabels.find((label) => label.id === status || label.name.toLowerCase().replace(/\s+/g, '-') === status)
  return [statusLabel || fallbackLabels[index % fallbackLabels.length]]
}

function normalizeKanbanCard(card, board, index = 0) {
  const assignees = cardAssignees(card)
  return {
    id: card?.id ?? `${board.id}-card-${index}`,
    title: cardName(card, index),
    description: cardText(card),
    labels: cardLabelList(card, board, index),
    assignees,
    comments: Array.isArray(card?.comments) ? card.comments.length : Number(card?.comments_count || 0),
    checklistDone: Number(card?.checklist_done ?? card?.completed_items ?? (index % 2)),
    checklistTotal: Number(card?.checklist_total ?? card?.checklist_items_count ?? 3),
    due: card?.due_date || card?.deadline || card?.reminder_at || card?.due_at || null,
    priority: card?.priority || card?.level || (index % 3 === 0 ? 'high' : 'normal'),
    raw: card,
  }
}

const selectedBoardCards = computed(() => {
  const cards = Array.isArray(props.board.cards) ? props.board.cards : []
  return cards.map((card, cardIndex) => normalizeKanbanCard(card, props.board, cardIndex))
})

const boardCardColumns = computed(() => fallbackLabels.map((label) => ({
  ...label,
  title: props.board?.title || '',
  columnLabel: label.name,
  rawMembers: props.board?.rawMembers || [],
  cards: selectedBoardCards.value.filter((card) => card.labels.some((cardLabel) => {
    const labelKey = String(label.id || label.name).toLowerCase()
    const cardLabelKey = String(cardLabel.id || cardLabel.name).toLowerCase().replace(/\s+/g, '-')
    return cardLabelKey === labelKey || String(cardLabel.name).toLowerCase() === String(label.name).toLowerCase()
  })),
})).filter((column) => column.cards.length || ['todo', 'in-progress', 'complete', 'urgent'].includes(column.id)))

const boardCardsCount = computed(() => selectedBoardCards.value.length)

function initialsFromMember(member) {
  return (member.initials || member.name || member.email || 'ME').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0c142b]/50 py-16">
    <div class="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
    <p class="mt-4 text-sm text-slate-400">Loading board cards...</p>
  </div>

  <div v-else-if="!selectedBoardCards.length" class="-mx-4 overflow-x-auto px-4 pb-4">
    <div class="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
      <h2 class="text-lg font-semibold text-white">Belum ada card</h2>
      <p class="mt-2 text-sm text-slate-400">Card dari board ini akan tampil di sini ketika tersedia dari API.</p>
      <button class="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-white/15 px-4 text-sm font-semibold text-slate-300 hover:border-blue-500/40 hover:text-blue-200" type="button" @click="emit('add-card')">
        <IconGlyph name="plus" class="h-4 w-4" />
        Add Card
      </button>
    </div>
  </div>

  <div v-else class="-mx-4 overflow-x-auto px-4 pb-4">
    <div class="flex min-w-max gap-5">
      <section
        v-for="column in boardCardColumns"
        :key="column.id"
        class="w-[300px] shrink-0"
      >
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: column.color }" />
            <h2 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">{{ column.name }}</h2>
            <span class="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-200">{{ column.cards.length }}</span>
          </div>
          <button class="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white" type="button" title="Column options">
            <IconGlyph name="dots" class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-3">
          <article
            v-for="card in column.cards"
            :key="card.id"
            class="group rounded-lg border border-white/10 bg-[#0c142b]/90 p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-blue-400/35 hover:bg-[#111c38]"
          >
            <button class="block w-full text-left" type="button" @click="emit('card-click', card, column)">
              <div class="mb-3 flex flex-wrap gap-1.5">
                <span
                  v-for="label in card.labels"
                  :key="label.id || label.name"
                  class="rounded-md px-2 py-0.5 text-[10px] font-bold text-white/95"
                  :style="{ backgroundColor: label.color }"
                >
                  {{ label.name }}
                </span>
              </div>
              <h3 class="text-sm font-semibold leading-5 text-white group-hover:text-blue-200">{{ card.title }}</h3>
              <p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{{ card.description }}</p>
              <div class="mt-4 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 text-[11px] text-slate-400">
                  <span v-if="card.comments" class="inline-flex items-center gap-1">
                    <IconGlyph name="template" class="h-3.5 w-3.5" />
                    {{ card.comments }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <IconGlyph name="check" class="h-3.5 w-3.5" />
                    {{ card.checklistDone }}/{{ card.checklistTotal }}
                  </span>
                </div>
                <div class="flex -space-x-2">
                  <span
                    v-for="member in (card.assignees.length ? card.assignees : column.rawMembers).slice(0, 2)"
                    :key="member.id || member.email || member.name"
                    class="grid h-6 w-6 place-items-center overflow-hidden rounded-full border border-[#0c142b] bg-gradient-to-br from-cyan-300 to-slate-700 text-[8px] font-black text-white"
                    :title="member.name || member.email"
                  >
                    <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
                    <span v-else>{{ initialsFromMember(member) }}</span>
                  </span>
                </div>
              </div>
            </button>
          </article>

          <button class="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-sm font-semibold text-slate-400 transition hover:border-blue-500/40 hover:text-blue-200" type="button" @click="emit('add-card')">
            <IconGlyph name="plus" class="h-4 w-4" />
            Add Card
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
