<script setup>
import { computed, ref } from 'vue'
import IconGlyph from '../dashboard/IconGlyph.vue'
import { useWorkspaceDashboardStore } from '@/stores/workspaceDashboard'
import { getInitials } from '@/utils/helpers'

const props = defineProps({
  boardId: { type: [Number, String], required: true },
  cardId: { type: [Number, String], required: true },
  currentAssignees: { type: Array, default: () => [] },
  boardMembers: { type: Array, default: () => [] },
})

const dashboardStore = useWorkspaceDashboardStore()
const showPicker = ref(false)

const currentIds = computed(() => new Set(props.currentAssignees.map((a) => String(a.id ?? a.user_id))))

const availableMembers = computed(() =>
  props.boardMembers.filter((m) => !currentIds.value.has(String(m.id)))
)

function memberName(member) {
  return member?.name || member?.email || 'Member'
}

function memberInitials(member) {
  return member?.initials || getInitials(member?.name, 'ME')
}

function memberAvatar(member) {
  return member?.avatar || null
}

async function assign(userId) {
  try {
    await dashboardStore.assignUserToCard(props.boardId, props.cardId, userId)
    showPicker.value = false
  } catch (error) {
    console.error('Failed to assign user:', error)
  }
}

async function remove(userId) {
  try {
    await dashboardStore.removeAssigneeFromCard(props.boardId, props.cardId, userId)
  } catch (error) {
    console.error('Failed to remove assignee:', error)
  }
}
</script>

<template>
  <div>
    <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Assignees</p>
    <div class="flex flex-wrap items-center gap-2">
      <span
        v-for="member in currentAssignees"
        :key="member.id || member.user_id || member.email || member.name"
        class="group relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-cyan-300 to-blue-800 text-[10px] font-black text-white cursor-pointer"
        @click="remove(member.id ?? member.user_id)"
        title="Click to remove"
      >
        <img v-if="memberAvatar(member)" :src="memberAvatar(member)" :alt="memberName(member)" class="h-full w-full object-cover" />
        <span v-else>{{ memberInitials(member) }}</span>
        <span class="absolute inset-0 grid place-items-center bg-black/60 text-xs opacity-0 transition group-hover:opacity-100">x</span>
      </span>

      <div class="relative">
        <button
          class="grid h-8 w-8 place-items-center rounded-full border border-dashed border-blue-400/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition"
          type="button"
          @click="showPicker = !showPicker"
        >
          <IconGlyph name="plus" class="h-4 w-4" />
        </button>
        <div
          v-if="showPicker"
          class="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-white/10 bg-[#0c142b] p-2 shadow-xl"
        >
          <p v-if="!availableMembers.length" class="px-2 py-3 text-xs text-slate-400 text-center">No members available</p>
          <button
            v-for="member in availableMembers"
            :key="member.id"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-white transition hover:bg-white/[0.06]"
            type="button"
            @click="assign(member.id)"
          >
            <span class="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-300 to-blue-700 text-[8px] font-bold text-white">
              <img v-if="memberAvatar(member)" :src="memberAvatar(member)" :alt="memberName(member)" class="h-full w-full object-cover" />
              <span v-else>{{ memberInitials(member) }}</span>
            </span>
            {{ memberName(member) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
