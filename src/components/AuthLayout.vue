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
  <div class="auth-screen min-h-[100dvh] w-full bg-[#030712] sm:p-4 text-white flex items-center justify-center">
    <div
      class="auth-frame mx-auto flex w-full min-h-[100dvh] sm:min-h-[calc(100dvh-32px)] sm:max-h-[900px] max-w-[1700px] overflow-hidden sm:rounded-[30px] border-0 sm:border border-white/10 bg-[#030712] sm:bg-[rgba(3,7,18,0.92)] shadow-none sm:shadow-[0_24px_100px_rgba(0,0,0,0.45)]">

      <!-- LEFT -->
      <section
        class="relative hidden w-[54%] overflow-hidden border-r border-white/10 p-4 xl:p-8 2xl:p-10 lg:flex lg:flex-col justify-center">
        <div class="auth-glow"></div>

        <!-- Logo -->
        <div class="relative z-10 flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d4ed8]/20 ring-1 ring-[#3b82f6]/35">
            <svg viewBox="0 0 40 40" class="h-7 w-7 text-[#2f6bff]" fill="currentColor">
              <path d="M8 9h7.2l9.2 12.44V9H32v22h-7.2L15.6 18.56V31H8V9Z" />
            </svg>
          </div>

          <span class="text-3xl xl:text-4xl font-semibold tracking-[0.08em]">
            NEXORA
          </span>
        </div>

        <!-- HERO -->
        <div class="relative z-10 mt-6 xl:mt-8 max-w-[650px]">
          <h1 class="font-black uppercase leading-[0.9] tracking-[-0.06em]
            text-[2.5rem]
            xl:text-[3.5rem]
            2xl:text-[4rem]">
            Focus.
            <span class="block">Execute.</span>

            <span class="block bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-white bg-clip-text text-transparent">
              Deliver Impact.
            </span>
          </h1>

          <p class="mt-4 max-w-[520px] text-base xl:text-lg leading-relaxed text-slate-300">
            Nexora helps teams plan smarter, execute faster, and ship what matters most.
          </p>

          <!-- FEATURES -->
          <div class="mt-5 space-y-3">
            <div v-for="item in featureItems" :key="item.label"
              class="flex items-center gap-3 text-base xl:text-lg text-slate-200">
              <span
                class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <svg viewBox="0 0 24 24" class="h-5 w-5 text-slate-200" fill="currentColor">
                  <path :d="iconPaths[item.icon]" />
                </svg>
              </span>

              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <!-- Background -->
        <div class="auth-planet"></div>
        <div class="auth-prism"></div>
        <div class="auth-dots"></div>

        <!-- TESTIMONIAL -->
        <div class="relative z-10 mt-6 xl:mt-8 rounded-[20px] border border-white/10 bg-[rgba(10,16,30,0.75)] p-4 xl:p-5">
          <div class="text-3xl xl:text-4xl font-bold leading-none text-[#2f6bff]">
            "
          </div>

          <p class="mt-2 text-base xl:text-lg leading-snug text-slate-200">
            Nexora gave us the clarity we were missing. Our team is faster and more focused.
          </p>

          <div class="mt-4 flex items-center justify-between gap-5">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 xl:h-12 xl:w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4d6c2,#7a5141_78%)]">
              </div>

              <div>
                <p class="text-base xl:text-lg font-medium text-white">
                  Jackson Lee
                </p>

                <p class="text-xs xl:text-sm text-slate-400">
                  Head of Product, Orbit
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-[#2563eb]"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-white/15"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-white/15"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT -->
      <section class="relative flex w-full h-full lg:w-[46%] overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 xl:px-8">
        <div class="panel-noise"></div>

        <div
          class="relative z-10 w-full max-w-[460px] m-auto rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[rgba(6,11,22,0.6)] sm:bg-[rgba(6,11,22,0.7)] p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
          <!-- Tabs -->
          <div class="mx-auto flex max-w-[480px] rounded-[14px] sm:rounded-[20px] border border-white/10 bg-[rgba(10,16,28,0.9)] p-1.5">
            <RouterLink to="/login" class="flex-1 rounded-[10px] sm:rounded-[16px] px-3 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base font-medium transition"
              :class="isLogin
                ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white'
                : 'text-slate-400 hover:text-white'">
              Sign in
            </RouterLink>

            <RouterLink to="/register"
              class="flex-1 rounded-[10px] sm:rounded-[16px] px-3 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base font-medium transition" :class="!isLogin
                ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-md'
                : 'text-slate-400 hover:text-white'">
              Create account
            </RouterLink>
          </div>

          <!-- Title -->
          <div class="mx-auto mt-6 sm:mt-8 max-w-[480px] text-center">
            <h2 class="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {{ title }}
            </h2>

            <p class="mt-2 sm:mt-3 text-sm sm:text-base text-slate-400">
              {{ subtitle }}
            </p>
          </div>

          <slot />
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

@media (max-width: 1536px) {
  .auth-planet {
    width: 56%;
  }
}

@media (max-width: 1280px) {
  .auth-prism {
    opacity: 0.45;
  }

  .auth-dots {
    opacity: 0.2;
  }
}
</style>
