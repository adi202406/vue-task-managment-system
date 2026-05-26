<script setup>
defineProps({
  name: {
    type: String,
    default: 'grid',
  },
})
</script>

<template>
  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'grid'">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </template>
    <template v-else-if="name === 'monitor'">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="M20 7 10 17l-5-5" />
      <circle cx="12" cy="12" r="9" />
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16M8 14h3M13 14h3M8 17h3" />
    </template>
    <template v-else-if="name === 'users'">
      <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 19c0-1.9-1.3-3.4-3-3.9M15 5.3a3 3 0 0 1 0 5.4" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </template>
    <template v-else-if="name === 'dots'">
      <path d="M12 6h.01M12 12h.01M12 18h.01" />
    </template>
    <template v-else-if="name === 'invite'">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M19 8v6M16 11h6" />
    </template>
    <template v-else-if="name === 'home'">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </template>
    <template v-else-if="name === 'template'">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h4M14 12h2M8 16h8" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </template>
    <template v-else-if="name === 'crown'">
      <path d="m3 8 4 4 5-7 5 7 4-4-2 11H5L3 8Z" />
      <path d="M5 19h14" />
    </template>
    <template v-else-if="name === 'chevron'">
      <path d="m6 9 6 6 6-6" />
    </template>
    <template v-else>
      <path d="M4 12h16M12 4v16" />
    </template>
  </svg>
</template>
