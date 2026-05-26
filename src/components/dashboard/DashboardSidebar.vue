<script setup>
import IconGlyph from './IconGlyph.vue'

const props = defineProps({
  favoriteBoards: {
    type: Array,
    default: () => [],
  },
  workspace: {
    type: Object,
    required: true,
  },
  mobile: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
  activePanel: {
    type: String,
    default: 'workspaces',
  },
})

const emit = defineEmits(['close', 'open-profile', 'navigate'])

import { computed } from 'vue'

const navItems = computed(() => [
  { id: 'workspaces', name: 'Workspaces', icon: 'home' },
  { id: 'labels', name: 'Labels', icon: 'template' },
  { id: 'notifications', name: 'Notifications', icon: 'bell', badge: 8 },
])
</script>

<template>
  <aside
    class="min-h-screen w-[280px] shrink-0 border-r border-white/10 bg-[rgba(5,10,24,0.82)] p-5 backdrop-blur-2xl"
    :class="mobile ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'"
  >
    <div class="flex items-center gap-3 px-1">
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#6d5dfc] to-[#3b6cff] shadow-[0_0_26px_rgba(79,70,229,0.55)]">
        <span class="text-lg font-black">T</span>
      </div>
      <span class="text-xl font-semibold tracking-tight text-white">Taskly</span>
      <button v-if="mobile" class="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" type="button" aria-label="Close sidebar" @click="$emit('close')">
        x
      </button>
    </div>

    <nav class="mt-9 space-y-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-left transition"
        :class="activePanel === item.id
          ? 'border border-[#6d5dfc]/25 bg-[#6d5dfc]/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'"
        @click="emit('navigate', item.id)"
      >
        <span class="grid h-6 w-6 place-items-center text-slate-300 transition group-hover:text-sky-300">
          <IconGlyph :name="item.icon" class="h-4 w-4" />
        </span>
        {{ item.name }}
        <span v-if="item.badge" class="ml-auto grid h-6 min-w-6 place-items-center rounded-lg bg-[#6d5dfc] px-2 text-xs font-semibold text-white">{{ item.badge }}</span>
      </button>
    </nav>

    <button class="mt-auto flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left transition hover:border-sky-400/30 hover:bg-white/[0.06]" type="button" @click="$emit('open-profile')">
      <div class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-orange-200 to-slate-700 text-sm font-black text-white">
        <img v-if="user?.avatar" :src="user.avatar" :alt="user?.name || 'Profile'" class="h-full w-full object-cover" />
        <span v-else>{{ (user?.name || workspace.owner || 'JL').split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase() }}</span>
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-white">{{ user?.name || workspace.owner }}</p>
        <p class="truncate text-xs text-slate-400">{{ user?.email || workspace.email }}</p>
      </div>
      <IconGlyph name="dots" class="ml-auto h-5 w-5 text-slate-400" />
    </button>

    <div class="mt-5 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(109,93,252,0.16),rgba(59,108,255,0.06))] p-4">
      <IconGlyph name="crown" class="h-5 w-5 text-amber-300" />
      <h3 class="mt-4 text-sm font-semibold text-white">Upgrade to Pro</h3>
      <p class="mt-2 text-xs leading-5 text-slate-400">Unlock more features and boost your productivity.</p>
      <button class="mt-4 rounded-lg bg-gradient-to-r from-[#6d5dfc] to-[#3b6cff] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_28px_rgba(79,70,229,0.28)]">
        Upgrade Now
      </button>
    </div>
  </aside>
</template>
