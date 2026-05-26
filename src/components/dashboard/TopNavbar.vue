<script setup>
import IconGlyph from './IconGlyph.vue'

defineProps({
  user: {
    type: Object,
    default: null,
  },
})

defineEmits(['open-sidebar', 'toggle-profile'])
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-white/10 bg-[rgba(5,10,24,0.82)] px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-center gap-3">
      <button class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-sky-400/40 hover:text-sky-300 lg:hidden" aria-label="Open sidebar" @click="$emit('open-sidebar')">
        <IconGlyph name="grid" />
      </button>

      <label class="group flex h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-slate-400 transition focus-within:border-[#6d5dfc]/50 focus-within:bg-[#6d5dfc]/10 sm:max-w-[460px]">
        <IconGlyph name="search" class="h-5 w-5" />
        <input class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search workspaces..." />
        <span class="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400 sm:inline">⌘ K</span>
      </label>

      <div class="ml-auto flex items-center gap-2 sm:gap-4">
        <button class="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition hover:border-[#6d5dfc]/45 hover:text-white" aria-label="Theme">
          <IconGlyph name="sun" class="h-5 w-5" />
        </button>
        <button class="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition hover:border-[#6d5dfc]/45 hover:text-white" aria-label="Notifications">
          <IconGlyph name="bell" />
          <span class="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#6d5dfc] text-[10px] font-bold text-white">8</span>
        </button>
        <button class="flex items-center gap-2" type="button" aria-label="Open profile" @click="$emit('toggle-profile')">
          <span class="relative h-11 w-11 rounded-full border border-white/10 bg-gradient-to-br from-orange-200 to-slate-700 transition hover:border-sky-400/40">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user?.name || 'Profile'" class="h-full w-full rounded-full object-cover" />
            <span v-else class="grid h-full w-full place-items-center text-sm font-black text-white">
              {{ (user?.name || 'Jackson Lee').split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase() }}
            </span>
          </span>
          <IconGlyph name="chevron" class="hidden h-4 w-4 text-slate-300 sm:block" />
        </button>
      </div>
    </div>
  </header>
</template>
