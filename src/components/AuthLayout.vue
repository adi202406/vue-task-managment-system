<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})

const isLogin = computed(() => props.activeTab === 'login')

const featureItems = [
  { label: 'Plan with clarity', icon: 'bolt' },
  { label: 'Execute with focus', icon: 'team' },
  { label: 'Deliver measurable results', icon: 'chart' },
]

const iconPaths = {
  bolt: 'M13 2 5 13h5l-1 9 8-11h-5l1-9Z',
  team: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 2a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 15c-.29 0-.62.02-.97.05C4.67 15.24 0 16.39 0 19v3h6v-3c0-1.13.44-2.16 1.17-3.02A13.32 13.32 0 0 1 8 15Z',
  chart: 'M3 3h2v18H3V3Zm16 18H7v-2h12v2ZM9 15l3-3 2 2 5-6 1.5 1.3-6.4 7.7-2.1-2.1-2.6 2.6L9 15Z',
}
</script>

<template>
  <div class="auth-screen min-h-screen bg-[#030712] px-4 py-5 text-white sm:px-6 lg:px-8">
    <div class="auth-frame mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1540px] overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(3,7,18,0.86)] shadow-[0_24px_120px_rgba(0,0,0,0.55)] lg:grid-cols-[1.05fr_0.95fr]">
      <section class="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col xl:p-16">
        <div class="auth-glow"></div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d4ed8]/20 ring-1 ring-[#3b82f6]/35">
            <svg viewBox="0 0 40 40" class="h-7 w-7 text-[#2f6bff]" fill="currentColor" aria-hidden="true">
              <path d="M8 9h7.2l9.2 12.44V9H32v22h-7.2L15.6 18.56V31H8V9Z" />
            </svg>
          </div>
          <span class="text-4xl font-semibold tracking-[0.08em] text-white">NEXORA</span>
        </div>

        <div class="relative z-10 mt-16 max-w-[720px] xl:mt-20">
          <h1 class="text-[4.6rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white xl:text-[6rem]">
            Focus.
            <span class="block">Execute.</span>
            <span class="block bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-white bg-clip-text text-transparent">
              Deliver Impact.
            </span>
          </h1>

          <p class="mt-8 max-w-xl text-2xl leading-10 text-slate-300">
            Nexora is the task management platform that helps teams plan smarter, execute faster, and ship what matters.
          </p>

          <div class="mt-10 space-y-5">
            <div
              v-for="item in featureItems"
              :key="item.label"
              class="flex items-center gap-4 text-2xl text-slate-200"
            >
              <span class="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-200" fill="currentColor" aria-hidden="true">
                  <path :d="iconPaths[item.icon]" />
                </svg>
              </span>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="auth-planet"></div>
        <div class="auth-prism"></div>
        <div class="auth-dots"></div>

        <div class="relative z-10 mt-auto rounded-[30px] border border-white/10 bg-[rgba(10,16,30,0.8)] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div class="text-7xl font-bold leading-none text-[#2f6bff]">"</div>
          <p class="mt-2 max-w-3xl text-2xl leading-10 text-slate-200">
            Nexora gave us the clarity we were missing. Our team is faster, more focused, and actually enjoys the way we work now.
          </p>

          <div class="mt-8 flex items-end justify-between gap-6">
            <div class="flex items-center gap-5">
              <div class="h-20 w-20 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4d6c2,#7a5141_78%)]"></div>
              <div>
                <p class="text-2xl font-medium text-white">Jackson Lee</p>
                <p class="text-lg text-slate-400">Head of Product, Orbit</p>
                <p class="mt-3 text-2xl font-semibold text-white">orbit</p>
              </div>
            </div>

            <div class="flex gap-3">
              <span class="h-3 w-3 rounded-full bg-[#2563eb]"></span>
              <span class="h-3 w-3 rounded-full bg-white/15"></span>
              <span class="h-3 w-3 rounded-full bg-white/15"></span>
              <span class="h-3 w-3 rounded-full bg-white/15"></span>
            </div>
          </div>
        </div>
      </section>

      <section class="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-10 xl:px-16">
        <div class="panel-noise"></div>

        <div class="relative z-10 w-full max-w-[640px] rounded-[32px] border border-white/8 bg-[rgba(6,11,22,0.66)] p-5 backdrop-blur-xl sm:p-8 xl:p-10">
          <div class="mx-auto flex max-w-[560px] rounded-[22px] border border-white/10 bg-[rgba(10,16,28,0.9)] p-1.5">
            <RouterLink
              to="/login"
              class="flex-1 rounded-[18px] px-6 py-4 text-center text-xl transition"
              :class="isLogin ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_16px_40px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-white'"
            >
              Sign in
            </RouterLink>

            <RouterLink
              to="/register"
              class="flex-1 rounded-[18px] px-6 py-4 text-center text-xl transition"
              :class="!isLogin ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_16px_40px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-white'"
            >
              Create account
            </RouterLink>
          </div>

          <div class="mx-auto mt-12 max-w-[560px]">
            <div class="text-center">
              <h2 class="text-4xl font-semibold text-white sm:text-5xl">{{ title }}</h2>
              <p class="mt-4 text-xl text-slate-400">{{ subtitle }}</p>
            </div>

            <slot />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 24%),
    radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.12), transparent 20%),
    linear-gradient(180deg, #020611 0%, #030712 100%);
}

.auth-frame {
  position: relative;
}

.auth-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 22%, rgba(36, 82, 206, 0.18), transparent 20%),
    radial-gradient(circle at 72% 46%, rgba(30, 64, 175, 0.14), transparent 22%);
  pointer-events: none;
}

.auth-planet {
  position: absolute;
  right: -12%;
  top: 16%;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 42% 40%, rgba(255, 255, 255, 0.08), transparent 28%),
    radial-gradient(circle at 50% 50%, rgba(9, 16, 34, 0.12), rgba(2, 6, 17, 0.98) 60%);
  box-shadow:
    0 0 0 2px rgba(59, 130, 246, 0.12),
    0 0 42px rgba(37, 99, 235, 0.32),
    -28px 0 80px rgba(37, 99, 235, 0.25);
}

.auth-prism {
  position: absolute;
  right: 3%;
  bottom: 16%;
  width: 46%;
  height: 26%;
  background:
    linear-gradient(140deg, rgba(227, 235, 255, 0.82), rgba(84, 104, 148, 0.22) 38%, rgba(8, 14, 28, 0.95) 72%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 40%);
  clip-path: polygon(18% 54%, 96% 8%, 74% 96%, 0 100%);
  opacity: 0.8;
  filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.48));
}

.auth-dots {
  position: absolute;
  right: 16%;
  top: 18%;
  width: 170px;
  height: 150px;
  opacity: 0.36;
  background-image: radial-gradient(circle, rgba(59, 130, 246, 0.85) 1.2px, transparent 1.2px);
  background-size: 16px 16px;
}

.panel-noise {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at center, black, transparent 90%);
  pointer-events: none;
}

@media (max-width: 1279px) {
  .auth-prism {
    right: 1%;
    bottom: 19%;
    width: 50%;
  }
}
</style>
