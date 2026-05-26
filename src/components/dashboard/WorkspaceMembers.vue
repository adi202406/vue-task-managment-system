<script setup>
import DashboardCard from './DashboardCard.vue'
import IconGlyph from './IconGlyph.vue'

defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  canManage: {
    type: Boolean,
    default: false,
  },
  removingId: {
    type: [String, Number],
    default: null,
  },
})

defineEmits(['invite', 'remove'])

function initials(name) {
  return (name || 'Member').split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase()
}

function joinedDate(value) {
  if (!value || value === 'No activity yet') return '-'
  return value
}

function statusClass(status) {
  if (status === 'pending') return 'border-amber-400/25 bg-amber-400/10 text-amber-200'
  if (status === 'removed') return 'border-rose-400/25 bg-rose-400/10 text-rose-200'
  return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
}
</script>

<template>
  <DashboardCard class="p-4 sm:p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-white">Workspace Members</h2>
      <button class="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50" type="button" :disabled="!canManage" @click="$emit('invite')">
        <IconGlyph name="invite" class="h-4 w-4" />
        Invite
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="index in 4" :key="index" class="flex items-center gap-3 rounded-2xl p-2">
        <div class="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-4 w-32 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-3 w-40 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!members.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <p class="text-sm font-medium text-white">No members found</p>
      <p class="mt-1 text-sm text-slate-400">Invite teammates to collaborate in this workspace.</p>
    </div>

    <div v-else class="space-y-3">
      <article v-for="member in members" :key="member.id || member.email" class="flex flex-wrap items-center gap-3 rounded-2xl p-2 transition hover:bg-white/[0.05] sm:flex-nowrap">
        <div class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-300 to-blue-700 text-xs font-black text-white">
          <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
          <span v-else>{{ initials(member.name) }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-medium text-white">{{ member.name }}</h3>
          <p class="truncate text-xs text-slate-400">{{ member.email }}</p>
          <p class="mt-1 text-[11px] text-slate-500">Joined {{ joinedDate(member.joinedDate) }}</p>
        </div>
        <span class="rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-[10px] uppercase text-sky-200">{{ member.role }}</span>
        <span class="rounded-full border px-2.5 py-1 text-[10px] uppercase" :class="statusClass(member.status)">{{ member.status || 'active' }}</span>
        <button class="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40" type="button" aria-label="Remove member" :disabled="!canManage || member.isOwner || removingId === member.id" @click="$emit('remove', member)">
          {{ removingId === member.id ? '...' : 'x' }}
        </button>
      </article>
    </div>
  </DashboardCard>
</template>
