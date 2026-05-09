<script setup>
const navLinks = ['Product', 'Solutions', 'Resources', 'Pricing', 'Enterprise']

const summaryStats = [
  { label: 'Tasks Completed', value: '128', change: '+24%', tone: 'success' },
  { label: 'In Progress',     value: '42',  change: '+12%', tone: 'success' },
  { label: 'Overdue',         value: '7',   change: '-8%',  tone: 'danger'  },
  { label: 'Team Efficiency', value: '92%', change: '+18%', tone: 'info'    },
]

const priorityTasks = [
  { title: 'Redesign onboarding flow',  tag: 'High',   date: 'May 21' },
  { title: 'Prepare Q2 marketing plan', tag: 'High',   date: 'May 22' },
  { title: 'Fix authentication bug',    tag: 'Medium', date: 'May 23' },
  { title: 'User research approval',    tag: 'Medium', date: 'May 24' },
  { title: 'Design system updates',     tag: 'Low',    date: 'May 26' },
]

const activities = [
  { name: 'Liam', action: 'completed Fix authentication bug',                time: '2m ago'  },
  { name: 'Emma', action: 'moved Prepare Q2 marketing plan to In Progress',  time: '15m ago' },
  { name: 'Noah', action: 'commented on Redesign onboarding flow',           time: '1h ago'  },
]

const featureCards = [
  { title: 'Plan with Precision',  description: 'Break down goals into actionable tasks and visual roadmaps.',            icon: 'stack' },
  { title: 'Execute with Focus',   description: 'Stay on track with smart priorities, deadlines, and workload insights.', icon: 'bolt'  },
  { title: 'Collaborate in Flow',  description: 'Communicate, share updates, and keep everyone aligned in real time.',   icon: 'team'  },
  { title: 'Measure What Matters', description: 'Beautiful reports that help you improve, iterate, and lead with data.',  icon: 'chart' },
]

const partnerLogos = ['cloudly', 'Acme Corp', 'orbit', 'kanba', 'loomy']

const statToneClass = { success: 'text-emerald-400', danger: 'text-rose-400', info: 'text-cyan-400' }
const badgeToneClass = {
  High:   'bg-rose-500/15   text-rose-300   ring-1 ring-inset ring-rose-500/20',
  Medium: 'bg-amber-500/15  text-amber-300  ring-1 ring-inset ring-amber-500/20',
  Low:    'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/20',
}
const iconPaths = {
  stack: 'M4 12.75 12 8l8 4.75L12 17.5 4 12.75Zm0 4.75L12 13l8 4.5L12 22 4 17.5ZM12 2l8 4.75L12 11.5 4 6.75 12 2Z',
  bolt:  'M13 2 5 13h5l-1 9 8-11h-5l1-9Z',
  team:  'M16 11a4 4 0 1 0-3.999-4A4 4 0 0 0 16 11ZM8 13a4 4 0 1 0-4-4 4 4 0 0 0 8 13Zm8 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 15c-.29 0-.62.02-.97.05C4.67 15.24 0 16.39 0 19v3h6v-3c0-1.13.44-2.16 1.17-3.02A13.32 13.32 0 0 1 8 15Z',
  chart: 'M3 3h2v18H3V3Zm16 18H7v-2h12v2ZM9 15l3-3 2 2 5-6 1.5 1.3-6.4 7.7-2.1-2.1-2.6 2.6L9 15Z',
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[#020611] text-white">
    <div class="page-glow"></div>
    <div class="page-grid"></div>

    <!-- ══ HEADER ══════════════════════════════════════════════════════ -->
    <header class="relative z-20">
      <div class="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur sm:h-10 sm:w-10">
            <svg viewBox="0 0 40 40" class="h-5 w-5 text-[#3b6cff] sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 9h7.2l9.2 12.44V9H32v22h-7.2L15.6 18.56V31H8V9Z" />
            </svg>
          </div>
          <p class="text-xl font-semibold tracking-[0.16em] text-white sm:text-2xl">NEXORA</p>
        </div>

        <nav class="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          <a v-for="item in navLinks" :key="item" href="#" class="transition-colors hover:text-white">{{ item }}</a>
        </nav>

        <div class="flex items-center gap-3">
          <a href="#" class="hidden text-sm text-slate-300 transition-colors hover:text-white md:inline-flex">Sign in</a>
          <a href="#" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3f6bff] to-[#4f46e5] px-4 py-2 text-xs font-medium text-white shadow-[0_8px_30px_rgba(59,108,255,0.4)] transition-transform hover:scale-[1.02] sm:rounded-2xl sm:px-5 sm:py-2.5 sm:text-sm">
            Start for free
          </a>
        </div>
      </div>
    </header>

    <main class="relative z-10">

      <!-- ══ HERO ═════════════════════════════════════════════════════ -->
      <section class="mx-auto max-w-[1480px] px-4 pb-6 pt-2 sm:px-6 sm:pb-8 sm:pt-3 lg:px-10 lg:pb-10 lg:pt-4">
        <!--
          mobile  → 1 col stacked
          lg 1024 → 2 col: copy | dashboard
        -->
        <div class="hero-shell grid gap-5 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.82)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]
                    sm:gap-6 sm:rounded-[28px] sm:p-6
                    lg:grid-cols-[1fr_1.15fr] lg:gap-7 lg:rounded-[32px] lg:p-8
                    xl:gap-8 xl:p-10">

          <!-- Left: copy -->
          <div class="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/6 p-3
                      sm:rounded-2xl sm:p-4
                      lg:rounded-[24px] lg:p-6">
            <div>
              <div class="mb-5 inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.38em] text-slate-400 sm:mb-6 sm:text-[11px] lg:mb-8">
                <span class="h-2 w-2 rounded-full bg-[#4b7bff] shadow-[0_0_16px_rgba(75,123,255,0.9)]"></span>
                Built for teams that move fast
              </div>

              <!-- Headline responsive sizes -->
              <h1 class="headline font-black uppercase leading-[0.9] tracking-[-0.04em] text-white
                          text-[2.6rem]
                          sm:text-[3.8rem]
                          md:text-[4.6rem]
                          lg:text-[3.8rem]
                          xl:text-[5rem]
                          2xl:text-[6.4rem]">
                Clarity today.
                <span class="block bg-gradient-to-r from-[#2b6dff] to-[#5a7cff] bg-clip-text text-transparent">Impact</span>
                always.
              </h1>

              <p class="mt-5 max-w-lg text-base leading-7 text-slate-300
                         sm:mt-7 sm:text-lg
                         lg:mt-7 lg:max-w-sm lg:text-base lg:leading-7
                         xl:max-w-md xl:text-lg">
                Nexora is the task management platform that turns chaos into momentum.
                Plan smarter, execute faster, and ship what matters.
              </p>

              <div class="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4 lg:mt-8">
                <a href="#" class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3f6bff] to-[#4f46e5] px-6 py-3.5 text-sm font-medium text-white shadow-[0_14px_40px_rgba(59,108,255,0.45)] transition-transform hover:scale-[1.02] sm:rounded-2xl sm:px-7 sm:py-4 sm:text-base lg:px-6 lg:py-3.5 lg:text-sm xl:px-7 xl:py-4 xl:text-base">
                  Start for free <span aria-hidden="true">→</span>
                </a>
                <a href="#" class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06] sm:rounded-2xl sm:px-7 sm:py-4 sm:text-base lg:px-6 lg:py-3.5 lg:text-sm xl:px-7 xl:py-4 xl:text-base">
                  Book a demo <span aria-hidden="true">›</span>
                </a>
              </div>
            </div>

            <div class="mt-10 sm:mt-12 lg:mt-10">
              <p class="text-[10px] uppercase tracking-[0.38em] text-slate-500 sm:text-[11px]">Trusted by innovative teams</p>
              <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-slate-400 sm:gap-x-6">
                <div v-for="logo in partnerLogos" :key="logo" class="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <span class="h-2 w-2 rounded-full border border-slate-500/60"></span>
                  <span>{{ logo }}</span>
                </div>
              </div>
            </div>

            <div class="hero-orbit hidden lg:block"></div>
            <div class="hero-prism hidden lg:block"><div class="hero-prism-face"></div></div>
          </div>

          <!-- Right: Dashboard preview -->
          <div class="relative min-w-0">
            <div class="dashboard-panel rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,28,46,0.96),rgba(7,12,24,0.96))] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.55)]
                        sm:rounded-[28px] sm:p-4
                        lg:rounded-[32px] lg:p-4
                        xl:p-5">

              <!-- Window chrome -->
              <div class="mb-3 flex items-center justify-between px-1 sm:mb-4 sm:px-2">
                <div class="flex gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                  <span class="h-2.5 w-2.5 rounded-full bg-white/12"></span>
                  <span class="h-2.5 w-2.5 rounded-full bg-white/10"></span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="rounded-full border border-white/10 px-3 py-1">May 20 – May 26</span>
                  <span class="rounded-full border border-white/10 px-2 py-1">NE</span>
                </div>
              </div>

              <!--
                Dashboard inner:
                <md        → 1 col (no sidebar)
                md 768+    → sidebar 170px + main
                lg 1024+   → sidebar 190px + main
                xl 1280+   → sidebar 210px + main
              -->
              <div class="grid gap-3 md:grid-cols-[170px_1fr] lg:grid-cols-[190px_1fr] xl:grid-cols-[210px_1fr]">

                <!-- Sidebar -->
                <aside class="hidden flex-col rounded-xl border border-white/8 bg-[rgba(12,18,34,0.88)] p-3 md:flex md:rounded-2xl lg:p-3.5">
                  <div class="flex items-center gap-2.5 border-b border-white/8 pb-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b6cff]/20">
                      <svg viewBox="0 0 40 40" class="h-5 w-5 text-[#4f78ff]" fill="currentColor" aria-hidden="true">
                        <path d="M8 9h7.2l9.2 12.44V9H32v22h-7.2L15.6 18.56V31H8V9Z" />
                      </svg>
                    </div>
                    <p class="text-sm font-semibold text-white">NEXORA</p>
                  </div>

                  <nav class="mt-3 flex-1 space-y-1 text-sm text-slate-300">
                    <div class="rounded-xl bg-[#23345f] px-3 py-2 text-white">Overview</div>
                    <div v-for="item in ['My Tasks','Projects','Calendar','Team','Reports']" :key="item"
                         class="rounded-xl px-3 py-2 transition-colors hover:bg-white/5">{{ item }}</div>
                    <div class="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white/5">
                      <span>Inbox</span>
                      <span class="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">3</span>
                    </div>
                    <div class="rounded-xl px-3 py-2 transition-colors hover:bg-white/5">Settings</div>
                  </nav>

                  <div class="mt-4 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
                    <div class="h-8 w-8 flex-shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f0c39f,#6d4638_78%)]"></div>
                    <div class="min-w-0">
                      <p class="truncate text-xs font-medium text-white">Olivia Rhye</p>
                      <p class="truncate text-[10px] text-slate-400">Product Designer</p>
                    </div>
                  </div>
                </aside>

                <!-- Main dashboard area -->
                <div class="min-w-0 space-y-3 rounded-xl border border-white/8 bg-[rgba(7,12,24,0.8)] p-3 sm:rounded-2xl sm:p-3.5 lg:p-4">

                  <!-- Greeting -->
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 class="text-base font-semibold text-white sm:text-xl lg:text-xl xl:text-2xl">Good morning, Olivia!</h2>
                      <p class="mt-0.5 text-[11px] text-slate-400 sm:text-xs">Here's what's happening with your team today.</p>
                    </div>
                    <div class="flex -space-x-2">
                      <span class="h-7 w-7 rounded-full border-2 border-[#0a1020] bg-white/10 sm:h-8 sm:w-8"></span>
                      <span class="h-7 w-7 rounded-full border-2 border-[#0a1020] bg-white/10 sm:h-8 sm:w-8"></span>
                      <span class="h-7 w-7 rounded-full border-2 border-[#0a1020] bg-[radial-gradient(circle_at_35%_30%,#f4d6c2,#7a5141_78%)] sm:h-8 sm:w-8"></span>
                    </div>
                  </div>

                  <!-- Stat cards: 2×2 → 4×1 at lg -->
                  <div class="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    <div v-for="stat in summaryStats" :key="stat.label"
                         class="rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(18,24,40,0.97),rgba(10,15,28,0.97))] p-2.5 sm:rounded-2xl sm:p-3">
                      <p class="text-[10px] text-slate-400 sm:text-xs">{{ stat.label }}</p>
                      <p class="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl lg:text-2xl xl:text-3xl">{{ stat.value }}</p>
                      <p class="mt-1 text-[10px] sm:text-xs" :class="statToneClass[stat.tone]">{{ stat.change }} vs last week</p>
                    </div>
                  </div>

                  <!-- Priority tasks | Progress + Activity -->
                  <div class="grid gap-3 lg:grid-cols-[1.2fr_0.85fr]">

                    <!-- Tasks -->
                    <div class="rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,33,0.98),rgba(8,12,24,0.98))] p-3 sm:rounded-2xl sm:p-3.5">
                      <div class="flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-white">Priority Tasks</h3>
                        <span class="text-[10px] text-slate-500">This week</span>
                      </div>
                      <div class="mt-2.5 space-y-2">
                        <div v-for="task in priorityTasks" :key="task.title"
                             class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
                          <span class="h-3 w-3 rounded-full border border-amber-400/70"></span>
                          <span class="truncate text-[11px] text-slate-100">{{ task.title }}</span>
                          <span class="rounded-full px-1.5 py-0.5 text-[9px]" :class="badgeToneClass[task.tag]">{{ task.tag }}</span>
                          <span class="text-[10px] text-slate-500">{{ task.date }}</span>
                        </div>
                      </div>
                      <a href="#" class="mt-3 inline-flex items-center gap-1 text-[11px] text-[#4f78ff]">View all →</a>
                    </div>

                    <!-- Progress + Activity -->
                    <div class="grid gap-3">

                      <div class="rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,33,0.98),rgba(8,12,24,0.98))] p-3 sm:rounded-2xl sm:p-3.5">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <h3 class="text-xs font-semibold text-white">Project Progress</h3>
                            <p class="mt-0.5 text-[10px] text-slate-400">Sprint delivery</p>
                          </div>
                          <div class="space-y-1 text-[9px] text-slate-400">
                            <div class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-[#3b82f6]"></span>Done</div>
                            <div class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-[#64748b]"></span>WIP</div>
                            <div class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-[#1e293b]"></span>Plan</div>
                          </div>
                        </div>
                        <div class="mt-3 flex items-center gap-3">
                          <div class="progress-ring flex-shrink-0">
                            <div class="progress-ring__inner">
                              <span class="text-lg font-semibold text-white">72%</span>
                              <span class="text-[9px] text-slate-400">On Track</span>
                            </div>
                          </div>
                          <div class="space-y-1.5 text-[10px] text-slate-300">
                            <div class="flex justify-between gap-3"><span>Completed</span><span>72%</span></div>
                            <div class="flex justify-between gap-3"><span>In Progress</span><span>18%</span></div>
                            <div class="flex justify-between gap-3"><span>Planned</span><span>10%</span></div>
                          </div>
                        </div>
                      </div>

                      <div class="rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,33,0.98),rgba(8,12,24,0.98))] p-3 sm:rounded-2xl sm:p-3.5">
                        <div class="flex items-center justify-between">
                          <h3 class="text-xs font-semibold text-white">Team Activity</h3>
                          <span class="text-[9px] text-slate-500">Live</span>
                        </div>
                        <div class="mt-2.5 space-y-2.5">
                          <div v-for="item in activities" :key="item.name" class="flex items-start gap-2">
                            <div class="h-6 w-6 flex-shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f3cfb4,#7d5546_78%)]"></div>
                            <p class="min-w-0 flex-1 text-[10px] leading-relaxed text-slate-300">
                              <span class="font-medium text-white">{{ item.name }}</span>{{ ' ' + item.action }}
                            </p>
                            <span class="flex-shrink-0 text-[9px] text-slate-500">{{ item.time }}</span>
                          </div>
                        </div>
                        <a href="#" class="mt-2.5 inline-flex items-center gap-1 text-[11px] text-[#4f78ff]">View all →</a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      <!-- ══ FEATURES + STATS ═════════════════════════════════════════ -->
      <section class="mx-auto max-w-[1480px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <!--
          <lg  → 1 col stacked
          lg+  → 2 equal columns side by side
        -->
        <div class="grid gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-6 xl:gap-7">

          <!-- ── Feature cards (left col) ── -->
          <!--
            <sm  → 1 col
            sm+  → 2 col
            The "together" + testimonial cards span full width within their col
          -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:gap-4 xl:gap-5">

            <article v-for="card in featureCards" :key="card.title"
                     class="relative overflow-hidden rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                            sm:rounded-[24px] sm:p-6
                            lg:p-5 xl:p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(180deg,rgba(62,102,255,0.45),rgba(74,65,229,0.22))] ring-1 ring-white/10">
                <svg viewBox="0 0 24 24" class="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
                  <path :d="iconPaths[card.icon]" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold tracking-[-0.03em] text-white lg:text-lg xl:text-xl">{{ card.title }}</h3>
              <p class="mt-2.5 text-sm leading-6 text-slate-300">{{ card.description }}</p>
              <div v-if="card.icon === 'stack'" class="stack-visual">
                <span></span><span></span><span></span>
              </div>
            </article>

            <!-- Together card — 2 col span -->
            <article class="relative col-span-1 overflow-hidden rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                            sm:col-span-2 sm:rounded-[24px] sm:p-8
                            lg:p-6 xl:p-8">
              <div class="floating-cube"><div class="floating-cube__inner"></div></div>
              <div class="mt-44 sm:mt-52 lg:mt-44">
                <p class="text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-2xl xl:text-4xl">
                  Everything your team needs to ship brilliant work,
                  <span class="text-[#4f78ff]">together.</span>
                </p>
              </div>
            </article>

            <!-- Testimonial — 2 col span -->
            <article class="col-span-1 rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                            sm:col-span-2 sm:rounded-[24px] sm:p-7
                            lg:p-5 xl:p-7">
              <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <div class="text-5xl text-[#4f78ff]">"</div>
                  <p class="mt-1 text-lg leading-relaxed text-slate-100 sm:text-2xl lg:text-lg xl:text-2xl">
                    Nexora gave us the clarity we were missing. Our team is faster,
                    more focused, and actually enjoys the way we work now.
                  </p>
                </div>
                <div class="flex flex-shrink-0 items-center gap-3 sm:gap-4">
                  <div class="h-14 w-14 flex-shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f3cfb4,#7d5546_78%)] sm:h-18 sm:w-18 lg:h-16 lg:w-16 xl:h-20 xl:w-20"></div>
                  <div>
                    <p class="text-lg font-medium text-white sm:text-2xl lg:text-xl xl:text-2xl">Jackson Lee</p>
                    <p class="mt-0.5 text-xs text-slate-400 sm:text-sm">Head of Product, Orbit</p>
                    <p class="mt-2 text-base font-semibold text-slate-200 sm:text-xl">orbit</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- ── Stats (right col) ── -->
          <div class="flex flex-col gap-5 sm:gap-5 lg:gap-4 xl:gap-5">

            <!-- Row 1: big metric + 2 mini -->
            <div class="grid gap-5 sm:grid-cols-[1.1fr_0.9fr] sm:gap-5 lg:gap-4 xl:gap-5">
              <article class="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                              sm:rounded-[24px] sm:p-6
                              lg:p-5 xl:p-7">
                <p class="text-[10px] uppercase tracking-[0.38em] text-slate-500">Productivity at a glance</p>
                <p class="mt-5 text-base text-slate-200 sm:mt-6 sm:text-xl lg:text-base xl:text-xl">Tasks Completed</p>
                <p class="mt-1 text-5xl font-semibold tracking-[-0.05em] text-white lg:text-4xl xl:text-5xl">1,286</p>
                <p class="mt-2 text-sm text-emerald-400">+28% vs last month</p>
                <svg viewBox="0 0 420 150" class="mt-5 h-24 w-full sm:h-32 lg:h-24 xl:h-32">
                  <defs>
                    <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#3b82f6" />
                      <stop offset="100%" stop-color="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <path d="M10 120 C 45 70, 65 130, 100 95 S 155 115, 185 80 S 250 130, 285 72 S 350 104, 410 38"
                        fill="none" stroke="url(#chartLine)" stroke-linecap="round" stroke-width="6" />
                </svg>
              </article>

              <div class="grid grid-rows-2 gap-5 sm:gap-5 lg:gap-4 xl:gap-5">
                <article class="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                                sm:rounded-[24px] sm:p-5
                                lg:p-4 xl:p-5">
                  <p class="text-sm text-slate-200">On-time Completion</p>
                  <p class="mt-1.5 text-4xl font-semibold tracking-[-0.05em] text-white lg:text-3xl xl:text-4xl">89%</p>
                  <p class="mt-1.5 text-sm text-emerald-400">+14%</p>
                  <svg viewBox="0 0 180 60" class="mt-3 h-10 w-full">
                    <path d="M5 46 Q 20 30, 35 42 T 65 24 T 95 36 T 125 16 T 175 8" fill="none" stroke="#7c3aed" stroke-linecap="round" stroke-width="4" />
                  </svg>
                </article>
                <article class="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                                sm:rounded-[24px] sm:p-5
                                lg:p-4 xl:p-5">
                  <p class="text-sm text-slate-200">Avg Cycle Time</p>
                  <p class="mt-1.5 text-4xl font-semibold tracking-[-0.05em] text-white lg:text-3xl xl:text-4xl">2.4<span class="ml-1 text-lg xl:text-xl">days</span></p>
                  <p class="mt-1.5 text-sm text-amber-400">-8%</p>
                  <svg viewBox="0 0 180 60" class="mt-3 h-10 w-full">
                    <path d="M5 42 Q 26 18, 48 34 T 84 28 T 120 14 T 175 30" fill="none" stroke="#22c55e" stroke-linecap="round" stroke-width="4" />
                  </svg>
                </article>
              </div>
            </div>

            <!-- Row 2: Workload + CTA -->
            <div class="grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-5 lg:gap-4 xl:gap-5">

              <article class="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(11,17,31,0.95),rgba(6,10,21,0.95))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                              sm:rounded-[24px] sm:p-6
                              lg:p-5 xl:p-6">
                <p class="text-base text-slate-200">Workload Balance</p>
                <div class="orbit-board mt-5">
                  <div class="orbit-board__ring orbit-board__ring--lg"></div>
                  <div class="orbit-board__ring orbit-board__ring--md"></div>
                  <div class="orbit-board__ring orbit-board__ring--sm"></div>
                  <div class="orbit-board__node orbit-board__node--one"></div>
                  <div class="orbit-board__node orbit-board__node--two"></div>
                  <div class="orbit-board__node orbit-board__node--three"></div>
                  <div class="orbit-board__node orbit-board__node--four"></div>
                </div>
                <p class="mt-5 text-emerald-400">Balanced</p>
                <p class="mt-1.5 text-sm leading-6 text-slate-400">Great job! Workload is evenly distributed.</p>
              </article>

              <article class="relative overflow-hidden rounded-2xl border border-white/8 p-6 shadow-[0_24px_80px_rgba(33,53,166,0.38)]
                              sm:rounded-[28px] sm:p-8
                              lg:p-6 xl:p-8">
                <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(47,87,255,0.95),rgba(44,39,139,0.95))]"></div>
                <div class="absolute inset-0 opacity-20" style="background-image:linear-gradient(120deg,transparent 0%,rgba(255,255,255,0.35) 50%,transparent 100%);background-size:240px 240px;"></div>
                <div class="relative flex h-full flex-col justify-between gap-6">
                  <div>
                    <h3 class="text-2xl font-semibold leading-snug tracking-[-0.04em] text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                      Ready to turn your plans into progress?
                    </h3>
                    <p class="mt-3 text-sm leading-7 text-blue-50/80 sm:mt-4 sm:text-base">
                      Join thousands of teams who trust Nexora to get work done.
                    </p>
                  </div>
                  <div class="flex flex-col gap-3">
                    <a href="#" class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-950 transition-transform hover:scale-[1.02]">
                      Start for free <span aria-hidden="true">→</span>
                    </a>
                    <a href="#" class="inline-flex items-center justify-center gap-2 text-sm text-white/85">
                      Or book a demo <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </article>
            </div>

          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* ── Backgrounds ──────────────────────────────── */
.headline { text-shadow: 0 0 22px rgba(255,255,255,0.08); }

.page-glow {
  position: fixed; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 18% 18%, rgba(53,105,255,0.14), transparent 28%),
    radial-gradient(circle at 76% 14%, rgba(60,101,255,0.12), transparent 24%),
    radial-gradient(circle at 58% 72%, rgba(31,57,134,0.14), transparent 26%);
}
.page-grid {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.12;
  background-image:
    linear-gradient(rgba(88,111,173,0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88,111,173,0.16) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, rgba(0,0,0,0.45), transparent 80%);
}

/* ── Hero shell ───────────────────────────────── */
.hero-shell { position: relative; }
.hero-shell::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background:
    radial-gradient(circle at left center, rgba(19,35,71,0.75), transparent 36%),
    linear-gradient(180deg, rgba(255,255,255,0.02), transparent 20%);
}

/* ── Decorative orbit + prism (desktop only) ─── */
.hero-orbit {
  position: absolute; right: 2%; bottom: -10%;
  width: 60%; aspect-ratio: 1; border-radius: 9999px; pointer-events: none;
  border: 1px solid rgba(113,145,255,0.35);
  box-shadow: 0 0 0 16px rgba(32,48,89,0.12), 0 0 60px rgba(67,108,255,0.32);
}
.hero-orbit::before {
  content: ''; position: absolute; inset: -15%;
  border-radius: inherit; border: 1px solid rgba(64,90,165,0.16);
}
.hero-prism {
  position: absolute; right: 16%; bottom: 8%; pointer-events: none;
  width: 170px; height: 114px;
  transform: skewX(-24deg) rotate(-10deg);
  background: linear-gradient(180deg, rgba(128,139,170,0.75), rgba(44,49,59,0.92));
  clip-path: polygon(0 76%, 80% 0, 100% 100%);
  box-shadow: 0 26px 80px rgba(0,0,0,0.45);
}
.hero-prism-face {
  position: absolute; inset: 0; clip-path: inherit;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.45), transparent 22%),
    linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.42));
}

/* ── Dashboard perspective (lg only) ─────────── */
@media (min-width: 1024px) {
  .dashboard-panel {
    transform: perspective(2000px) rotateY(-8deg) rotateX(2.5deg);
    transform-origin: center center;
  }
}

/* ── Progress ring ────────────────────────────── */
.progress-ring {
  position: relative; display: grid; place-items: center; flex-shrink: 0;
  width: 82px; height: 82px; border-radius: 9999px;
  background: conic-gradient(#3b82f6 0deg 259deg, #7c8ab5 259deg 324deg, #1e293b 324deg 360deg);
}
@media (min-width: 640px) { .progress-ring { width: 110px; height: 110px; } }
.progress-ring::before {
  content: ''; position: absolute; inset: 11px; border-radius: 9999px;
  background: #0a1020; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
}
@media (min-width: 640px) { .progress-ring::before { inset: 14px; } }
.progress-ring__inner {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 1px;
}

/* ── Stack visual ─────────────────────────────── */
.stack-visual { position: relative; height: 90px; margin-top: 20px; }
.stack-visual span {
  position: absolute; left: 50%;
  transform: translateX(-50%) skewX(-32deg);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(110,133,255,0.92), rgba(39,80,255,0.26));
  border: 1px solid rgba(154,171,255,0.28);
  box-shadow: 0 12px 32px rgba(34,78,255,0.18);
  width: 82px; height: 48px;
}
.stack-visual span:nth-child(1) { bottom: 0; }
.stack-visual span:nth-child(2) { bottom: 20px; width: 68px; }
.stack-visual span:nth-child(3) {
  bottom: 40px; width: 54px;
  background: linear-gradient(180deg, rgba(235,237,248,0.92), rgba(107,112,132,0.4));
}

/* ── Floating cube ────────────────────────────── */
.floating-cube {
  position: absolute; left: 50%; top: 60px;
  width: 130px; height: 130px;
  transform: translateX(-50%) rotate(45deg);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 0 0 20px rgba(255,255,255,0.015);
}
@media (min-width: 640px) { .floating-cube { width: 160px; height: 160px; top: 70px; } }
.floating-cube__inner {
  position: absolute; inset: 22px;
  background:
    linear-gradient(135deg, rgba(236,239,248,0.92), rgba(67,71,82,0.32)),
    linear-gradient(180deg, rgba(30,54,128,0.35), transparent 65%);
  box-shadow: 0 20px 48px rgba(0,0,0,0.36);
}
@media (min-width: 640px) { .floating-cube__inner { inset: 26px; } }

/* ── Orbit board (workload) ───────────────────── */
.orbit-board { position: relative; height: 190px; }
.orbit-board__ring {
  position: absolute; inset: 50%; border-radius: 9999px;
  border: 1px solid rgba(102,120,172,0.28);
  transform: translate(-50%, -50%);
}
.orbit-board__ring--lg { width: 186px; height: 186px; }
.orbit-board__ring--md { width: 124px; height: 124px; }
.orbit-board__ring--sm { width: 64px;  height: 64px;  }
.orbit-board__node {
  position: absolute; width: 30px; height: 30px; border-radius: 9999px;
  background: radial-gradient(circle at 35% 30%, #f4d6c2, #7a5141 78%);
  box-shadow: 0 0 0 4px rgba(59,108,255,0.16);
}
.orbit-board__node::after {
  content: ''; position: absolute; inset: 8px;
  border-radius: inherit; background: rgba(8,12,24,0.45);
}
.orbit-board__node--one   { left: 12%; top: 22%; }
.orbit-board__node--two   { left: 40%; top: 52%; }
.orbit-board__node--three { right: 14%; top: 18%; }
.orbit-board__node--four  { right: 10%; bottom: 14%; }
</style>