<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ForbiddenPage from '../../components/ForbiddenPage.vue'
import NotFoundPage from '../../components/NotFoundPage.vue'
import IconGlyph from '../../components/dashboard/IconGlyph.vue'
import UserProfilePanel from '../../components/UserProfilePanel.vue'
import BoardShowView from '../../components/dashboard/BoardShowView.vue'
import CardDetailModal from '../../components/card/CardDetailModal.vue'
import LabelList from '../labels/LabelList.vue'
import { useAuthStore } from '../../stores/auth'
import { useWorkspaceDashboardStore } from '../../stores/workspaceDashboard'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useWorkspaceDashboardStore()

const pageError = ref('')
const pageState = ref('loading')
const isReadOnly = ref(false)

const workspace = computed(() => dashboardStore.normalizedWorkspace)
const boards = computed(() => dashboardStore.normalizedBoards)
const activities = computed(() => dashboardStore.activities)

const activeTab = ref('boards') // 'boards', 'labels', 'members', 'settings', 'views', 'analytics'
const searchQuery = ref('')
const selectedBoardId = ref(null)
const selectedCard = ref(null)
const selectedCardBoard = ref(null)
const isLoadingBoardCards = ref(false)
const isLoadingCardDetail = ref(false)
const draggedBoardId = ref(null)
const dragOverBoardId = ref(null)
const isReorderingBoard = ref(false)
const isBoardShowRoute = computed(() => route.name === 'workspace.board.show')

// Filter boards by search input
const filteredBoards = computed(() => {
  const sortedBoards = [...boards.value].sort((a, b) => a.position - b.position)
  if (!searchQuery.value) return sortedBoards
  return sortedBoards.filter((b) => b.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const fallbackLabels = [
  { id: 'todo', name: 'To Do', color: '#64748b', description: 'Ready to start' },
  { id: 'in-progress', name: 'In Progress', color: '#3b82f6', description: 'Work in progress' },
  { id: 'complete', name: 'Complete', color: '#10b981', description: 'Finished work' },
  { id: 'urgent', name: 'Urgent', color: '#ef4444', description: 'Critical path items' },
  { id: 'review', name: 'In Review', color: '#6d5dfc', description: 'Pending QA approval' },
]

const selectedBoard = computed(() => {
  if (!isBoardShowRoute.value) return null
  return boards.value.find((board) => String(board.id) === String(selectedBoardId.value)) || null
})

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

const boardCardsCount = computed(() => {
  if (!selectedBoard.value) return 0
  const cards = Array.isArray(selectedBoard.value.cards) ? selectedBoard.value.cards : []
  return cards.length
})
const selectedBoardCards = computed(() => {
  if (!selectedBoard.value) return []
  return Array.isArray(selectedBoard.value.cards) ? selectedBoard.value.cards : []
})


async function openBoard(board) {
  if (!board?.id) return
  await router.push({
    name: 'workspace.board.show',
    params: {
      slug: route.params.slug,
      boardId: board.id,
    },
  })
}

async function closeBoard() {
  selectedBoardId.value = null
  selectedCard.value = null
  selectedCardBoard.value = null
  await router.push({ name: 'workspace.show', params: { slug: route.params.slug } })
}

function normalizeCardForDetail(card, fallback = {}) {
  return {
    ...fallback,
    id: card?.id ?? fallback.id,
    title: card?.title || card?.name || fallback.title || 'Untitled card',
    description: card?.description || fallback.description || 'Detail pekerjaan belum ditambahkan.',
    due: card?.due_date || card?.due || fallback.due || '',
    assignees: Array.isArray(card?.assignees) ? card.assignees : fallback.assignees || [],
    labels: cardLabelList(card || fallback.raw || fallback, selectedBoard.value || {}, Number(card?.position ?? fallback.raw?.position ?? 0)),
    checklistDone: fallback.checklistDone ?? 0,
    checklistTotal: fallback.checklistTotal ?? 3,
    raw: {
      ...(fallback.raw || {}),
      ...(card || {}),
    },
  }
}

function resetNewCardForm() {
  newCardForm.title = ''
  newCardForm.description = ''
  newCardForm.due_date = ''
  newCardForm.position = selectedBoardCards.value.length + 1
  cardFormError.value = ''
}

function openCreateCard() {
  resetNewCardForm()
  showCreateCardModal.value = true
}

async function openCardDetail(card, board) {
  selectedCard.value = card
  selectedCardBoard.value = board
  cardDetailError.value = ''
  isLoadingCardDetail.value = true
  dashboardStore.loadChecklists()
  try {
    const detail = await dashboardStore.loadCard(selectedBoard.value?.id, card.id)
    if (detail) {
      selectedCard.value = normalizeCardForDetail(detail, card)
    }
  } catch (error) {
    cardDetailError.value = error instanceof Error ? error.message : 'Card detail gagal dimuat.'
  } finally {
    isLoadingCardDetail.value = false
  }
}

function closeCardDetail() {
  selectedCard.value = null
  selectedCardBoard.value = null
  cardDetailError.value = ''
}

// Create Board Modal State
const showCreateBoardModal = ref(false)
const showEditBoardModal = ref(false)
const showCreateCardModal = ref(false)
const isCreatingBoard = ref(false)
const isUpdatingBoard = ref(false)
const isCreatingCard = ref(false)
const isUpdatingCard = ref(false)
const isDeletingCard = ref(false)
const boardFormError = ref('')
const editBoardFormError = ref('')
const cardFormError = ref('')
const cardDetailError = ref('')
const successMessage = ref('')
const newBoardForm = reactive({
  title: '',
  color: '#3b82f6',
  is_favorite: false,
})
const newCardForm = reactive({
  title: '',
  description: '',
  due_date: '',
  position: '',
})
const editBoardForm = reactive({
  id: null,
  name: '',
  position: 0,
})


// Create Board function
async function handleCreateBoard() {
  if (!newBoardForm.title.trim()) {
    boardFormError.value = 'Board title is required.'
    return
  }
  isCreatingBoard.value = true
  boardFormError.value = ''
  try {
    const boardTitle = newBoardForm.title.trim()
    await dashboardStore.createBoard({
      name: boardTitle,
      color: newBoardForm.color,
      is_favorite: newBoardForm.is_favorite,
      position: boards.value.length + 1,
    })
    showCreateBoardModal.value = false
    
    successMessage.value = `Board "${boardTitle}" berhasil dibuat!`
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    newBoardForm.title = ''
    newBoardForm.color = '#3b82f6'
    newBoardForm.is_favorite = false
  } catch (error) {
    boardFormError.value = error instanceof Error ? error.message : 'Failed to create board.'
  } finally {
    isCreatingBoard.value = false
  }
}

async function handleCreateCard() {
  if (!selectedBoard.value?.id) return
  if (!newCardForm.title.trim()) {
    cardFormError.value = 'Card title is required.'
    return
  }

  isCreatingCard.value = true
  cardFormError.value = ''
  try {
    await dashboardStore.createCard(selectedBoard.value.id, {
      title: newCardForm.title,
      description: newCardForm.description,
      due_date: newCardForm.due_date,
      position: newCardForm.position,
    })
    showCreateCardModal.value = false
    resetNewCardForm()
    successMessage.value = 'Card berhasil dibuat.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    cardFormError.value = error instanceof Error ? error.message : 'Failed to create card.'
  } finally {
    isCreatingCard.value = false
  }
}

async function handleUpdateCard(formData) {
  if (!selectedBoard.value?.id || !selectedCard.value?.id) return
  if (!formData.title?.trim()) {
    cardDetailError.value = 'Card title is required.'
    return
  }

  isUpdatingCard.value = true
  cardDetailError.value = ''
  try {
    const card = await dashboardStore.updateCard(selectedBoard.value.id, selectedCard.value.id, formData)
    if (card) {
      selectedCard.value = normalizeCardForDetail(card, selectedCard.value)
    }
    successMessage.value = 'Card berhasil diperbarui.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    cardDetailError.value = error instanceof Error ? error.message : 'Failed to update card.'
  } finally {
    isUpdatingCard.value = false
  }
}

async function handleDeleteCard() {
  if (!selectedBoard.value?.id || !selectedCard.value?.id) return
  isDeletingCard.value = true
  cardDetailError.value = ''
  try {
    await dashboardStore.deleteCard(selectedBoard.value.id, selectedCard.value.id)
    closeCardDetail()
    successMessage.value = 'Card berhasil dihapus.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    cardDetailError.value = error instanceof Error ? error.message : 'Failed to delete card.'
  } finally {
    isDeletingCard.value = false
  }
}

function openEditBoard(board) {
  editBoardForm.id = board.id
  editBoardForm.name = board.title
  editBoardForm.position = board.position
  editBoardFormError.value = ''
  showEditBoardModal.value = true
}

async function handleUpdateBoard() {
  if (!editBoardForm.name.trim()) {
    editBoardFormError.value = 'Board name is required.'
    return
  }
  isUpdatingBoard.value = true
  editBoardFormError.value = ''
  try {
    await dashboardStore.updateBoard(editBoardForm.id, {
      name: editBoardForm.name,
      position: editBoardForm.position,
    })
    showEditBoardModal.value = false
    successMessage.value = 'Board berhasil diperbarui.'
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (error) {
    editBoardFormError.value = error instanceof Error ? error.message : 'Failed to update board.'
  } finally {
    isUpdatingBoard.value = false
  }
}

function handleBoardDragStart(event, board) {
  draggedBoardId.value = board.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(board.id))
}

function handleBoardDragOver(event, board) {
  if (String(draggedBoardId.value) === String(board.id)) return
  event.preventDefault()
  dragOverBoardId.value = board.id
}

function handleBoardDragEnd() {
  draggedBoardId.value = null
  dragOverBoardId.value = null
}

async function handleBoardDrop(event, targetBoard, targetIndex) {
  event.preventDefault()
  const boardId = draggedBoardId.value || event.dataTransfer.getData('text/plain')
  if (!boardId || String(boardId) === String(targetBoard.id)) {
    handleBoardDragEnd()
    return
  }

  isReorderingBoard.value = true
  try {
    await dashboardStore.reorderBoard(boardId, targetIndex)
    successMessage.value = 'Posisi board berhasil diperbarui.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : 'Board position failed to update.'
  } finally {
    isReorderingBoard.value = false
    handleBoardDragEnd()
  }
}

// Favorite Toggle
async function toggleFavorite(boardId) {
  try {
    await dashboardStore.toggleFavoriteBoard(boardId)
  } catch (error) {
    console.error('Failed to toggle favorite', error)
  }
}

// Workspace edit form
const showEditWorkspaceModal = ref(false)
const showDeleteConfirm = ref(false)
const isSavingWorkspace = ref(false)
const isDeletingWorkspace = ref(false)
const formError = ref('')
const workspaceForm = reactive({
  title: '',
  description: '',
  visibility: 'private',
})

function initWorkspaceForm() {
  workspaceForm.title = workspace.value.name || ''
  workspaceForm.description = workspace.value.description === 'No workspace description yet.' ? '' : workspace.value.description || ''
  workspaceForm.visibility = workspace.value.visibility || 'private'
  formError.value = ''
}

async function handleUpdateWorkspace() {
  formError.value = ''
  isSavingWorkspace.value = true
  try {
    await dashboardStore.updateWorkspace(workspace.value.id, {
      title: workspaceForm.title,
      description: workspaceForm.description || null,
      visibility: workspaceForm.visibility,
    })
    initWorkspaceForm()
    activeTab.value = 'boards' // Switch back to boards view after editing settings
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Workspace failed to save.'
  } finally {
    isSavingWorkspace.value = false
  }
}

async function handleDeleteWorkspace() {
  isDeletingWorkspace.value = true
  try {
    await dashboardStore.deleteWorkspace(workspace.value.id)
    showDeleteConfirm.value = false
    await router.push({ name: 'workspaces.index' })
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Workspace failed to delete.'
  } finally {
    isDeletingWorkspace.value = false
  }
}

// Invite Member State
const showInviteModal = ref(false)
const inviteForm = reactive({ email: '', role: 'viewer' })
const isInviting = ref(false)
const inviteError = ref('')

async function handleInviteMember() {
  if (!inviteForm.email.trim()) return
  isInviting.value = true
  inviteError.value = ''
  try {
    await dashboardStore.inviteMember({
      email: inviteForm.email,
      role: inviteForm.role,
    })
    showInviteModal.value = false
    inviteForm.email = ''
    inviteForm.role = 'viewer'
  } catch (error) {
    inviteError.value = error instanceof Error ? error.message : 'Failed to invite member.'
  } finally {
    isInviting.value = false
  }
}

async function handleRemoveMember(userId) {
  try {
    await dashboardStore.removeMember(userId)
  } catch (error) {
    console.error('Failed to remove member', error)
  }
}

// Notifications toggle / Profile panel
const showProfilePanel = ref(false)
const showMobileSidebar = ref(false)

// Toast message for board click
const showBoardComingSoon = ref(false)
const clickedBoardName = ref('')
function clickBoard(board) {
  clickedBoardName.value = board.title
  showBoardComingSoon.value = true
  setTimeout(() => {
    showBoardComingSoon.value = false
  }, 3000)
}

// Load workspace data
async function loadWorkspace() {
  const slug = route.params.slug
  if (!slug) {
    await router.replace({ name: 'workspaces.index' })
    return
  }

  pageError.value = ''
  pageState.value = 'loading'
  dashboardStore.isLoading = true
  try {
    await dashboardStore.loadWorkspace(slug)
    const userId = authStore.user?.id
    const isActiveMember = userId && workspace.value.membersList.some((m) => String(m.id) === String(userId) && m.status === 'active')
    const isPublic = workspace.value.visibility === 'public'
    isReadOnly.value = isPublic && !isActiveMember
    pageState.value = (isActiveMember || isPublic) ? 'ready' : 'denied'
    selectedBoardId.value = isBoardShowRoute.value ? route.params.boardId : null
    if (isBoardShowRoute.value && selectedBoardId.value && pageState.value === 'ready') {
      isLoadingBoardCards.value = true
      await dashboardStore.loadBoardCards(selectedBoardId.value)
      isLoadingBoardCards.value = false
    }
    initWorkspaceForm()
  } catch (error) {
    if (error?.status === 403) {
      pageState.value = 'denied'
    } else if (error?.status === 404) {
      pageState.value = 'not-found'
    } else {
      pageState.value = 'denied'
      pageError.value = error instanceof Error ? error.message : 'Workspace gagal dimuat.'
    }
  } finally {
    isLoadingBoardCards.value = false
    dashboardStore.isLoading = false
  }
}

onMounted(() => {
  dashboardStore.setCurrentUser(authStore.user)
  loadWorkspace()
})

watch(() => [route.params.slug, route.params.boardId], loadWorkspace)
</script>

<template>
  <NotFoundPage v-if="pageState === 'not-found'" />

  <ForbiddenPage v-else-if="pageState === 'denied'" message="Anda tidak memiliki akses ke workspace ini. Hanya owner dan member yang diundang yang dapat mengakses halaman ini." />

  <main v-else-if="pageState === 'loading'" class="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
    <div class="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.08] px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-300"></div>
      <h2 class="mt-6 text-2xl font-semibold">Memuat Workspace</h2>
      <p class="mt-3 text-sm leading-6 text-slate-400">Menyiapkan data workspace...</p>
    </div>
  </main>

  <template v-else>
    <div class="min-h-screen bg-[#020611] text-slate-100 flex flex-col font-sans relative">
      <!-- Glow decoration backgrounds -->
      <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(109,93,252,0.1),transparent_25%),linear-gradient(180deg,rgba(5,10,24,0.96),rgba(2,6,17,1))]" />
      <div class="pointer-events-none fixed inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:56px_56px]" />

      <!-- Top Navbar (matching Trello/ProManage dashboard style) -->
      <header class="relative z-20 shrink-0 border-b border-white/10 bg-[rgba(5,10,24,0.85)] backdrop-blur-md px-4 py-3 flex items-center justify-between sm:px-6 lg:px-8">
        <div class="flex items-center gap-8">
          <!-- Logo -->
          <div class="flex items-center gap-2.5 cursor-pointer" @click="router.push({ name: 'workspaces.index' })">
            <div class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#3b6cff] to-[#6d5dfc] text-white shadow-md">
              <span class="text-sm font-black">PM</span>
            </div>
            <span class="text-lg font-bold tracking-tight text-white">ProManage</span>
          </div>

          <!-- Nav Tabs -->
          <nav class="hidden md:flex items-center gap-1">
            <button
              class="px-4 py-1.5 text-sm font-medium rounded-md transition cursor-pointer"
              :class="activeTab === 'boards' || activeTab === 'labels' || activeTab === 'members' || activeTab === 'settings' ? 'text-white border-b-2 border-blue-500 rounded-none font-semibold' : 'text-slate-400 hover:text-white'"
              @click="activeTab = 'boards'"
            >
              Workspaces
            </button>
            <button class="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer" @click="activeTab = 'views'">Recent</button>
            <button class="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer" @click="activeTab = 'views'">Starred</button>
            <button class="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer" @click="activeTab = 'views'">Templates</button>
          </nav>
        </div>

        <!-- Right Side Nav Actions -->
        <div class="flex items-center gap-3">
          <button
            @click="showCreateBoardModal = true"
            class="hidden sm:inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 shadow-sm cursor-pointer"
          >
            <IconGlyph name="plus" class="h-3.5 w-3.5" />
            Create
          </button>

          <button class="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20 transition cursor-pointer">
            <IconGlyph name="bell" class="h-4.5 w-4.5" />
            <span class="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-[9px] font-bold text-white">3</span>
          </button>

          <button class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20 transition cursor-pointer" @click="activeTab = 'views'">
            <span class="text-sm font-semibold">?</span>
          </button>

          <button
            @click="activeTab = 'settings'"
            class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20 transition cursor-pointer"
            title="Workspace Settings"
          >
            <IconGlyph name="template" class="h-4.5 w-4.5" />
          </button>

          <!-- User Avatar -->
          <button
            @click="showProfilePanel = !showProfilePanel"
            class="flex items-center gap-2 relative h-9 w-9 rounded-full border border-white/10 bg-gradient-to-br from-orange-200 to-slate-700 transition hover:border-sky-400 cursor-pointer"
          >
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="authStore.user.name" class="h-full w-full rounded-full object-cover" />
            <span v-else class="grid h-full w-full place-items-center text-xs font-black text-white">
              {{ (authStore.user?.name || 'ME').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() }}
            </span>
          </button>
        </div>
      </header>

      <!-- Sidebar and Main Panel Container -->
      <div class="relative z-10 flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        <!-- Left Workspace Sidebar -->
        <aside class="hidden lg:flex flex-col w-[260px] border-r border-white/10 bg-[rgba(5,10,24,0.7)] p-4 shrink-0 backdrop-blur-sm">
          <!-- Workspace Info Block -->
          <div class="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 mb-6">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-600/90 text-white font-bold text-lg shadow-sm">
              {{ workspace.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white leading-tight">{{ workspace.name }}</p>
              <p class="truncate text-xs text-slate-400 mt-0.5 capitalize">{{ workspace.visibility }} Workspace</p>
            </div>
          </div>

          <!-- Navigation Menus -->
          <nav class="space-y-1.5 flex-1">
            <button
              v-for="item in [
                { id: 'boards', name: 'Boards', icon: 'grid' },
                { id: 'members', name: 'Members', icon: 'users' },
                { id: 'settings', name: 'Workspace Settings', icon: 'template' },
                { id: 'views', name: 'Workspace Views', icon: 'monitor' },
                { id: 'analytics', name: 'Analytics', icon: 'calendar' }
              ]"
              :key="item.id"
              @click="activeTab = item.id"
              class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition text-left cursor-pointer"
              :class="activeTab === item.id
                ? 'bg-blue-600/20 border border-blue-500/30 text-white shadow-sm'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent'"
            >
              <IconGlyph :name="item.icon" class="h-4.5 w-4.5" />
              <span>{{ item.name }}</span>
            </button>
          </nav>

          <!-- Sidebar Footer -->
          <div class="pt-4 border-t border-white/10 space-y-1">
            <a href="#" class="flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm text-slate-400 hover:text-white transition">
              <span class="text-xs">?</span>
              Help
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm text-slate-400 hover:text-white transition">
              <IconGlyph name="check" class="h-4 w-4" />
              Privacy
            </a>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <!-- Alert notifications -->
          <div v-if="pageError || dashboardStore.errorMessage" class="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            {{ pageError || dashboardStore.errorMessage }}
          </div>

          <!-- Board Click coming soon toast -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div v-if="showBoardComingSoon" class="fixed bottom-6 right-6 z-50 rounded-xl border border-blue-500/30 bg-blue-950/90 backdrop-blur-md px-5 py-3 text-sm text-blue-200 shadow-xl flex items-center gap-3">
              <IconGlyph name="grid" class="h-5 w-5 text-blue-400" />
              <span>Integrasi Detail Board <strong>"{{ clickedBoardName }}"</strong> akan segera hadir!</span>
            </div>
          </transition>

          <!-- Loader -->
          <div v-if="dashboardStore.isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500"></div>
            <p class="mt-4 text-sm text-slate-400">Loading data...</p>
          </div>

          <template v-else>
            <!-- 1. BOARDS TAB -->
            <div v-if="activeTab === 'boards'" class="space-y-8">
              <!-- Section Header & Search -->
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <button
                    v-if="selectedBoard"
                    class="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
                    type="button"
                    @click="closeBoard"
                  >
                    <IconGlyph name="chevron" class="h-4 w-4 rotate-90" />
                    Back to all boards
                  </button>
                  <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">{{ selectedBoard ? selectedBoard.title : 'Workspace Boards' }}</h1>
                  <p class="mt-1.5 text-sm text-slate-400 max-w-xl">
                    {{ selectedBoard ? `${boardCardsCount} cards in this board.` : 'Semua board yang sudah dibuat di workspace ini.' }}
                  </p>
                </div>
                <!-- Search boards -->
                <div v-if="!selectedBoard" class="relative w-full md:w-72">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <IconGlyph name="search" class="h-4 w-4" />
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    id="search-boards-input"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:bg-white/[0.08] transition"
                    placeholder="Search boards..."
                  />
                </div>
              </div>

              <div v-if="!selectedBoard && !filteredBoards.length" class="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
                <h2 class="text-lg font-semibold text-white">Belum ada board</h2>
                <p class="mt-2 text-sm text-slate-400">Buat board pertama untuk mulai mengelola card.</p>
                <button class="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500" type="button" @click="showCreateBoardModal = true">
                  <IconGlyph name="plus" class="h-4 w-4" />
                  Create Board
                </button>
              </div>

              <div v-else-if="!selectedBoard" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <article
                  v-for="(board, idx) in filteredBoards"
                  :key="board.id"
                  :draggable="!searchQuery"
                  class="group relative flex min-h-[180px] cursor-grab flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0c142b]/90 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-400/35 hover:shadow-xl active:cursor-grabbing"
                  :class="{
                    'opacity-55 ring-2 ring-blue-400/40': String(draggedBoardId) === String(board.id),
                    'translate-y-1 border-blue-300/70 bg-blue-500/10': String(dragOverBoardId) === String(board.id)
                  }"
                  @click="openBoard(board)"
                  @dragstart="handleBoardDragStart($event, board)"
                  @dragover="handleBoardDragOver($event, board)"
                  @drop="handleBoardDrop($event, board, idx)"
                  @dragend="handleBoardDragEnd"
                >
                  <div class="absolute left-0 right-0 top-0 h-1" :style="{ backgroundColor: board.color }" />
                  <div class="flex flex-1 flex-col text-left">
                    <div class="flex items-start justify-between gap-4">
                      <span class="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                        {{ board.tasks }} Cards
                      </span>
                      <div class="flex items-center gap-1.5">
                        <button
                          @click.stop="openEditBoard(board)"
                          class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-400/40 hover:text-white"
                          title="Edit board"
                          type="button"
                        >
                          <IconGlyph name="template" class="h-4 w-4" />
                        </button>
                        <button
                          @click.stop="toggleFavorite(board.id)"
                          class="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:text-amber-400"
                          :class="board.raw?.is_favorite ? 'text-amber-400' : 'text-slate-500'"
                          title="Toggle star status"
                          type="button"
                        >
                          <IconGlyph name="star" class="h-4.5 w-4.5" :class="board.raw?.is_favorite ? 'fill-amber-400' : ''" />
                        </button>
                      </div>
                    </div>

                    <div class="mt-5 flex-1">
                      <h3 class="text-lg font-bold text-white transition group-hover:text-blue-300">{{ board.title }}</h3>
                      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {{ board.description || `Position ${board.position + 1}. Drag this board to reorder.` }}
                      </p>
                    </div>

                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex items-center -space-x-2">
                        <span
                          v-for="(member, mIdx) in board.rawMembers.slice(0, 3)"
                          :key="member.id || mIdx"
                          class="grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-[#0c142b] bg-gradient-to-br from-indigo-400 to-purple-600 text-[9px] font-bold text-white"
                          :title="member.name"
                        >
                          <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
                          <span v-else>{{ member.initials }}</span>
                        </span>
                      </div>
                      <span class="text-xs text-slate-400">{{ board.updated }}</span>
                    </div>
                  </div>
                </article>

                <button
                  @click="showCreateBoardModal = true"
                  class="flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.01] p-5 transition hover:border-blue-500/50 hover:bg-blue-500/[0.02]"
                  id="create-board-trigger"
                  type="button"
                >
                  <div class="mb-3 grid h-10 w-10 place-items-center rounded-lg border border-blue-500/20 bg-blue-600/10 text-blue-400">
                    <IconGlyph name="plus" class="h-5 w-5" />
                  </div>
                  <span class="text-sm font-semibold text-slate-300">Create new board</span>
                </button>
              </div>

              <div v-if="!selectedBoard && isReorderingBoard" class="fixed bottom-6 right-6 z-50 rounded-xl border border-blue-500/30 bg-blue-950/90 px-5 py-3 text-sm font-semibold text-blue-100 shadow-xl">
                Updating board position...
              </div>

              <BoardShowView
                v-if="selectedBoard"
                :board="selectedBoard"
                :is-loading="isLoadingBoardCards"
                @back="closeBoard"
                @add-card="openCreateCard"
                @card-click="(card, column) => openCardDetail(card, column)"
              />
            </div>

            <!-- 2. LABELS TAB -->
            <LabelList v-else-if="activeTab === 'labels'" />

            <!-- 3. MEMBERS TAB -->
            <div v-else-if="activeTab === 'members'" class="space-y-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Workspace Members</h1>
                  <p class="mt-1 text-sm text-slate-400">Manage who has access to this workspace and their roles.</p>
                </div>
                <button
                  v-if="!isReadOnly && dashboardStore.canManageMembers"
                  @click="showInviteModal = true"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 cursor-pointer shadow-sm"
                  id="invite-member-trigger"
                >
                  <IconGlyph name="invite" class="h-4 w-4" />
                  Invite Members
                </button>
              </div>

              <!-- Members list card -->
              <div class="bg-[#0c142b]/40 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                <div v-if="!workspace.membersList?.length" class="text-center py-10 text-slate-400">
                  No members found.
                </div>

                <div v-else class="divide-y divide-white/5">
                  <div
                    v-for="member in workspace.membersList"
                    :key="member.id || member.email"
                    class="flex flex-wrap items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div class="flex items-center gap-3.5">
                      <!-- Avatar -->
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center overflow-hidden text-xs font-black text-white shrink-0">
                        <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
                        <span v-else>{{ member.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() }}</span>
                      </div>
                      <div>
                        <h3 class="text-sm font-bold text-white">{{ member.name }}</h3>
                        <p class="text-xs text-slate-400">{{ member.email }}</p>
                        <p class="text-[10px] text-slate-500 mt-0.5">Joined {{ member.joinedDate }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md">
                        {{ member.role }}
                      </span>
                      <span
                        class="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border"
                        :class="member.status === 'pending' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' : 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20'"
                      >
                        {{ member.status }}
                      </span>

                      <!-- Remove member option -->
                      <button
                        v-if="!isReadOnly && dashboardStore.canManageMembers && !member.isOwner && authStore.user?.id !== member.id"
                        @click="handleRemoveMember(member.id)"
                        class="h-8 w-8 rounded-lg border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 flex items-center justify-center text-slate-400 transition cursor-pointer"
                        title="Remove member from workspace"
                      >
                        x
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. SETTINGS TAB -->
            <div v-else-if="activeTab === 'settings'" class="space-y-6 max-w-2xl">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Workspace Settings</h1>
                <p class="mt-1 text-sm text-slate-400">Configure information and general permissions for this workspace.</p>
              </div>

              <!-- Settings panel -->
              <div class="bg-[#0c142b]/40 border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-6">
                <form @submit.prevent="handleUpdateWorkspace" class="space-y-4">
                  <div v-if="formError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {{ formError }}
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="settings-title">Workspace Name</label>
                    <input
                      v-model="workspaceForm.title"
                      required
                      type="text"
                      id="settings-title"
                      :disabled="isReadOnly || !dashboardStore.canManageMembers"
                      class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="settings-desc">Description</label>
                    <textarea
                      v-model="workspaceForm.description"
                      id="settings-desc"
                      rows="4"
                      :disabled="isReadOnly || !dashboardStore.canManageMembers"
                      class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition disabled:opacity-50 resize-none"
                      placeholder="Describe this workspace..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="settings-visibility">Visibility</label>
                    <select
                      v-model="workspaceForm.visibility"
                      id="settings-visibility"
                      :disabled="isReadOnly || !dashboardStore.canManageMembers"
                      class="w-full rounded-lg border border-white/10 bg-[#0a1020] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition disabled:opacity-50"
                    >
                      <option value="private">Private (Only invited members)</option>
                      <option value="public">Public (Anyone can see read-only)</option>
                    </select>
                  </div>

                  <button
                    v-if="!isReadOnly && dashboardStore.canManageMembers"
                    type="submit"
                    :disabled="isSavingWorkspace"
                    class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    {{ isSavingWorkspace ? 'Saving Changes...' : 'Save Settings' }}
                  </button>
                </form>

                <!-- Dangerous operations zone -->
                <div v-if="!isReadOnly && dashboardStore.canManageMembers" class="pt-6 border-t border-white/10 space-y-4">
                  <div>
                    <h3 class="text-sm font-bold text-rose-400">Danger Zone</h3>
                    <p class="text-xs text-slate-400 mt-1">This operation deletes the workspace. This action can be soft-deleted in API.</p>
                  </div>

                  <button
                    type="button"
                    @click="showDeleteConfirm = true"
                    class="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition cursor-pointer"
                  >
                    Delete Workspace
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. WORKSPACE VIEWS TAB & ANALYTICS TAB -->
            <div v-else class="space-y-6">
              <div class="bg-[#0c142b]/40 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
                <div class="h-14 w-14 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <IconGlyph :name="activeTab === 'views' ? 'monitor' : 'calendar'" class="h-7 w-7" />
                </div>
                <h2 class="text-xl font-bold text-white capitalize">Workspace {{ activeTab }}</h2>
                <p class="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Fitur integrasi visual untuk <strong>{{ activeTab }}</strong> sedang disiapkan. Data tracker dan visualisasi premium dashboard akan segera hadir di modul ini!
                </p>
                <button
                  @click="activeTab = 'boards'"
                  class="mt-6 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition cursor-pointer"
                >
                  Back to Boards
                </button>
              </div>
            </div>
          </template>
        </main>
      </div>

      <!-- Right Profile Panel Backdrop Overlay -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showProfilePanel" class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" @click="showProfilePanel = false" />
      </transition>

      <!-- Profile Sliding Panel -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-12"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-12"
      >
        <aside v-if="showProfilePanel" class="fixed bottom-4 right-4 top-20 z-40 w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.95)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:w-96">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">User Profile</h2>
            <button type="button" class="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:border-slate-500 hover:text-white transition cursor-pointer" @click="showProfilePanel = false">
              x
            </button>
          </div>
          <UserProfilePanel />
        </aside>
      </transition>

      <CardDetailModal
        :show="!!selectedCard"
        :card="selectedCard"
        :board="selectedBoard"
        :is-loading="isLoadingCardDetail"
        :card-detail-error="cardDetailError"
        @close="closeCardDetail"
        @update="handleUpdateCard"
        @delete="handleDeleteCard"
      />

      <!-- MODALS SECTION -->

      <!-- 1. Create Board Modal -->
      <teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showCreateBoardModal" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-4 backdrop-blur-sm" @click.self="showCreateBoardModal = false">
            <form class="flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md" @submit.prevent="handleCreateBoard">
              <div class="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.25em] text-blue-400">New Board</p>
                  <h2 class="mt-1 text-lg font-bold text-white">Create Board</h2>
                </div>
                <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:border-slate-500 hover:text-white transition cursor-pointer" type="button" @click="showCreateBoardModal = false">x</button>
              </div>

              <div class="p-5 space-y-4">
                <div v-if="boardFormError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {{ boardFormError }}
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="board-title-input">Board Title</label>
                  <input
                    v-model="newBoardForm.title"
                    required
                    type="text"
                    id="board-title-input"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                    placeholder="e.g. Platform Redesign"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-1.5">Accent Color</label>
                  <div class="flex flex-wrap gap-2.5">
                    <button
                      v-for="color in [
                        { hex: '#3b82f6', name: 'Blue' },
                        { hex: '#8b5cf6', name: 'Violet' },
                        { hex: '#10b981', name: 'Emerald' },
                        { hex: '#f59e0b', name: 'Amber' },
                        { hex: '#f43f5e', name: 'Rose' },
                        { hex: '#0ea5e9', name: 'Sky' }
                      ]"
                      :key="color.hex"
                      type="button"
                      @click="newBoardForm.color = color.hex"
                      class="h-8 w-8 rounded-full border-2 transition cursor-pointer relative"
                      :style="{ backgroundColor: color.hex }"
                      :class="newBoardForm.color === color.hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'"
                      :title="color.name"
                    >
                      <span v-if="newBoardForm.color === color.hex" class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                  <input
                    v-model="newBoardForm.is_favorite"
                    type="checkbox"
                    id="board-favorite-input"
                    class="h-4 w-4 rounded border-white/10 bg-white/[0.04] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 outline-none cursor-pointer"
                  />
                  <label class="text-sm text-slate-300 cursor-pointer" for="board-favorite-input">Add to starred boards</label>
                </div>
              </div>

              <div class="border-t border-white/10 p-5">
                <button
                  type="submit"
                  :disabled="isCreatingBoard"
                  class="w-full flex items-center justify-center h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  id="submit-board-button"
                >
                  {{ isCreatingBoard ? 'Creating Board...' : 'Create Board' }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </teleport>

      <!-- 2. Edit Board Modal -->
      <teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showEditBoardModal" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-4 backdrop-blur-sm" @click.self="showEditBoardModal = false">
            <form class="flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md" @submit.prevent="handleUpdateBoard">
              <div class="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.25em] text-blue-400">Update Board</p>
                  <h2 class="mt-1 text-lg font-bold text-white">Edit Board</h2>
                </div>
                <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-slate-500 hover:text-white" type="button" @click="showEditBoardModal = false">x</button>
              </div>

              <div class="space-y-4 p-5">
                <div v-if="editBoardFormError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {{ editBoardFormError }}
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="edit-board-name-input">Board Name</label>
                  <input
                    v-model="editBoardForm.name"
                    id="edit-board-name-input"
                    required
                    type="text"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    placeholder="Updated board name"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="edit-board-position-input">Position</label>
                  <input
                    v-model.number="editBoardForm.position"
                    id="edit-board-position-input"
                    min="0"
                    type="number"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />
                  <p class="mt-2 text-xs text-slate-500">Position uses zero-based order, matching the API reorder endpoint.</p>
                </div>
              </div>

              <div class="border-t border-white/10 p-5">
                <button
                  type="submit"
                  :disabled="isUpdatingBoard"
                  class="flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ isUpdatingBoard ? 'Saving Board...' : 'Save Board' }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </teleport>

      <!-- 3. Create Card Modal -->
      <teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showCreateCardModal" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-4 backdrop-blur-sm" @click.self="showCreateCardModal = false">
            <form class="flex w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md" @submit.prevent="handleCreateCard">
              <div class="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.25em] text-blue-400">New Card</p>
                  <h2 class="mt-1 text-lg font-bold text-white">Create Card</h2>
                  <p class="mt-1 text-xs text-slate-400">Board: {{ selectedBoard?.title }}</p>
                </div>
                <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-slate-500 hover:text-white" type="button" @click="showCreateCardModal = false">x</button>
              </div>

              <div class="space-y-4 p-5">
                <div v-if="cardFormError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {{ cardFormError }}
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="card-title-input">Card Title</label>
                  <input
                    v-model="newCardForm.title"
                    id="card-title-input"
                    required
                    type="text"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    placeholder="Implement Authentication"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="card-description-input">Description</label>
                  <textarea
                    v-model="newCardForm.description"
                    id="card-description-input"
                    rows="4"
                    class="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    placeholder="Setup Sanctum authentication"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="card-due-date-input">Due Date</label>
                    <input
                      v-model="newCardForm.due_date"
                      id="card-due-date-input"
                      type="date"
                      class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-300" for="card-position-input">Position</label>
                    <input
                      v-model.number="newCardForm.position"
                      id="card-position-input"
                      min="0"
                      type="number"
                      class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div class="border-t border-white/10 p-5">
                <button
                  type="submit"
                  :disabled="isCreatingCard"
                  class="flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ isCreatingCard ? 'Creating Card...' : 'Create Card' }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </teleport>

      <!-- 4. Invite Member Modal -->
      <teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showInviteModal" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-4 backdrop-blur-sm" @click.self="showInviteModal = false">
            <form class="flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md" @submit.prevent="handleInviteMember">
              <div class="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.25em] text-blue-400">Team Collaboration</p>
                  <h2 class="mt-1 text-lg font-bold text-white">Invite Member</h2>
                </div>
                <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:border-slate-500 hover:text-white transition cursor-pointer" type="button" @click="showInviteModal = false">x</button>
              </div>

              <div class="p-5 space-y-4">
                <div v-if="inviteError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {{ inviteError }}
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="invite-email-input">Email Address</label>
                  <input
                    v-model="inviteForm.email"
                    required
                    type="email"
                    id="invite-email-input"
                    class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="invite-role-select">Role</label>
                  <select
                    v-model="inviteForm.role"
                    id="invite-role-select"
                    class="w-full rounded-lg border border-white/10 bg-[#0a1020] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition"
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="editor">Editor (Can edit boards & cards)</option>
                  </select>
                </div>
              </div>

              <div class="border-t border-white/10 p-5">
                <button
                  type="submit"
                  :disabled="isInviting"
                  class="w-full flex items-center justify-center h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  id="submit-invite-button"
                >
                  {{ isInviting ? 'Inviting...' : 'Send Invitation' }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </teleport>

      <!-- 3. Delete Workspace Confirm Modal -->
      <teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" @click.self="showDeleteConfirm = false">
            <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
              <h2 class="text-lg font-bold text-white">Delete Workspace</h2>
              <p class="mt-3 text-sm leading-6 text-slate-400">
                Workspace <strong>"{{ workspace.name }}"</strong> beserta seluruh board dan task di dalamnya akan dihapus. Aksi ini menggunakan soft delete di API backend.
              </p>
              <div class="mt-6 flex justify-end gap-3">
                <button class="h-9 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition cursor-pointer" type="button" @click="showDeleteConfirm = false">
                  Cancel
                </button>
                <button class="h-9 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 text-xs font-semibold text-white transition cursor-pointer" type="button" :disabled="isDeletingWorkspace" @click="handleDeleteWorkspace">
                  {{ isDeletingWorkspace ? 'Deleting...' : 'Delete Workspace' }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  </template>
</template>
