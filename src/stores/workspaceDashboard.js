import { defineStore } from 'pinia'

import {
  createBoard as createBoardApi,
  createCard as createCardApi,
  createWorkspace,
  deleteCard as deleteCardApi,
  deleteWorkspace,
  getBoardCards as getBoardCardsApi,
  getCard as getCardApi,
  getBoards as getBoardsApi,
  getWorkspace,
  getWorkspaces,
  reorderBoard as reorderBoardApi,
  toggleFavoriteBoard as toggleFavoriteBoardApi,
  updateBoard as updateBoardApi,
  updateCard as updateCardApi,
  updateWorkspace,
} from '../services/workspace-dashboard'
import {
  acceptInvitationByToken as acceptInvitationByTokenApi,
  acceptWorkspaceInvitation,
  inviteWorkspaceUser,
  removeWorkspaceUser,
} from '../services/workspace-members'
import {
  createLabel as createLabelApi,
  deleteLabel as deleteLabelApi,
  getLabels as getLabelsApi,
  updateLabel as updateLabelApi,
} from '../services/labels'
import {
  attachLabelToCard as attachLabelToCardApi,
  detachLabelFromCard as detachLabelFromCardApi,
} from '../services/card-labels'
import {
  assignUserToCard as assignUserToCardApi,
  removeAssigneeFromCard as removeAssigneeFromCardApi,
} from '../services/card-assignees'
import {
  createChecklist as createChecklistApi,
  deleteChecklist as deleteChecklistApi,
  getChecklists as getChecklistsApi,
  updateChecklist as updateChecklistApi,
} from '../services/checklists'
import {
  createChecklistItem as createChecklistItemApi,
  deleteChecklistItem as deleteChecklistItemApi,
  bulkUpdateChecklistItems as bulkUpdateChecklistItemsApi,
  updateChecklistItem as updateChecklistItemApi,
} from '../services/checklist-items'

function unwrap(payload) {
  return payload?.data?.data ?? payload?.data ?? payload
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.data?.data)) return value.data.data
  return []
}

function textDate(value) {
  if (!value) return 'No activity yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < hour) return `${Math.max(1, Math.round(diff / minute))} minutes ago`
  if (diff < day) return `${Math.round(diff / hour)} hours ago`
  if (diff < day * 7) return `${Math.round(diff / day)} days ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function dueLabel(value) {
  if (!value) return 'No due date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function initials(name, fallback = '?') {
  return (name || fallback)
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function boardTitle(board, index = 0) {
  return board?.title || board?.name || board?.board_name || `Board ${index + 1}`
}

function makeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function workspaceRouteKey(workspace) {
  return workspace?.slug || workspace?.id || workspace
}

function isUploadFile(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob
}

function workspacePayload(payload = {}) {
  const title = String(payload.title || payload.name || '').trim()
  const data = {
    title,
    slug: payload.slug || makeSlug(title),
    description: payload.description || null,
    visibility: payload.visibility || 'private',
  }

  if (isUploadFile(payload.banner_image)) data.banner_image = payload.banner_image
  if (payload.banner_image_public_id) data.banner_image_public_id = payload.banner_image_public_id
  if (payload.owner_id) data.owner_id = payload.owner_id

  return data
}

function cardPayload(payload = {}) {
  const data = {}
  if (payload.title !== undefined) data.title = String(payload.title || '').trim()
  if (payload.description !== undefined) data.description = payload.description || null
  if (payload.due_date !== undefined) data.due_date = payload.due_date || null
  if (payload.position !== undefined && payload.position !== null && payload.position !== '') data.position = Number(payload.position)
  return data
}

function labelPayload(payload = {}) {
  const data = {}
  if (payload.name !== undefined) data.name = String(payload.name || '').trim()
  if (payload.color !== undefined) data.color = payload.color
  if (payload.description !== undefined) data.description = payload.description || null
  return data
}

function cardTitle(card, index = 0) {
  return card?.title || card?.name || card?.card_name || `Task ${index + 1}`
}

function boardCards(board) {
  return asArray(board?.cards || board?.tasks || board?.cards_count?.data)
}

function boardMembers(board) {
  return asArray(board?.members || board?.users || board?.participants).map((member) => ({
    id: member?.id,
    name: member?.name || member?.email || 'Member',
    avatar: member?.avatar,
    initials: initials(member?.name || member?.email, 'MB'),
  }))
}

function workspaceMembers(workspace) {
  return asArray(workspace?.members || workspace?.users || workspace?.workspace_users).map((member) => {
    const user = member?.user || member
    const status = member?.status || user?.pivot?.status || 'active'
    const joinedAt = member?.joined_at || user?.pivot?.joined_at || null
    const role = member?.role || user?.pivot?.role || user?.role || 'viewer'
    return {
      id: member?.user_id ?? user?.id,
      name: user?.name || user?.email || 'Member',
      email: user?.email || '',
      avatar: user?.avatar,
      role,
      status,
      invitedBy: member?.invited_by || user?.pivot?.invited_by || null,
      joinedAt,
      joinedDate: textDate(joinedAt),
      isOwner: role === 'owner' || String(member?.user_id ?? user?.id) === String(workspace?.owner_id),
      raw: member,
    }
  })
}

function workspaceCard(workspace, index = 0) {
  const members = workspaceMembers(workspace)
  const name = workspace?.title || workspace?.name || workspace?.slug || `Workspace ${index + 1}`
  const accents = ['#6d5dfc', '#10b981', '#f97316', '#ec4899', '#3b82f6', '#14b8a6', '#8b5cf6', '#eab308']

  return {
    id: workspace?.id ?? workspace?.uuid ?? workspace?.slug ?? name,
    slug: workspace?.slug ?? workspace?.id,
    name,
    description: workspace?.description || workspace?.notes || 'Manage boards, tasks, and team collaboration.',
    bannerImage: workspace?.banner_image || workspace?.bannerImage || '',
    bannerImagePublicId: workspace?.banner_image_public_id || workspace?.bannerImagePublicId || '',
    visibility: workspace?.visibility || workspace?.type || 'private',
    members: workspace?.members_count ?? workspace?.users_count ?? members.length,
    membersList: members,
    boards: workspace?.boards_count ?? workspace?.board_count ?? workspace?.boards?.length ?? 0,
    owner: workspace?.owner?.name || workspace?.owner_name || 'Workspace Owner',
    accent: workspace?.color || accents[index % accents.length],
    initial: initials(name, 'W').slice(0, 1),
    raw: workspace,
  }
}

function normalizeBoard(board, index = 0) {
  const title = boardTitle(board, index)
  const members = boardMembers(board)
  const cards = boardCards(board)
  const colors = ['#2f7dff', '#8b5cf6', '#60a5fa', '#22d3ee', '#fb923c', '#84cc16']

  return {
    id: board?.id ?? board?.uuid ?? title,
    slug: board?.slug ?? board?.id,
    title,
    description: board?.description || '',
    color: board?.color || colors[index % colors.length],
    position: Number(board?.position ?? index),
    tasks: board?.tasks_count ?? board?.cards_count ?? cards.length,
    updated: textDate(board?.updated_at || board?.last_activity_at || board?.created_at),
    members: members.slice(0, 3).map((member) => member.initials),
    extraMembers: Math.max(0, members.length - 3),
    rawMembers: members,
    cards,
    raw: board,
    image: `linear-gradient(135deg, ${board?.color || colors[index % colors.length]}dd, rgba(7,15,35,.28)), radial-gradient(circle at 78% 18%, rgba(146,211,255,.75), transparent 24%), linear-gradient(160deg, #071124, #0a1c47)`,
  }
}

function cardAssignees(card) {
  return asArray(card?.assignees || card?.users || card?.members)
}

function cardLabels(card) {
  return asArray(card?.labels).map((label) => ({
    id: label?.id ?? label?.name,
    name: label?.name || label?.title || 'Label',
    color: label?.color || '#2f7dff',
  }))
}

function cardPriority(card) {
  return card?.priority || card?.priority_label || card?.level || 'normal'
}

function cardDueDate(card) {
  return card?.due_date || card?.deadline || card?.reminder_at || card?.due_at
}

function isComplete(card) {
  const status = String(card?.status || card?.state || '').toLowerCase()
  return Boolean(card?.completed_at || card?.is_completed || card?.completed || ['done', 'completed', 'complete'].includes(status))
}

function normalizeTask(card, board, index = 0) {
  const due = cardDueDate(card)
  const priority = cardPriority(card)
  const assignees = cardAssignees(card)
  return {
    id: card?.id ?? `${board.id}-${index}`,
    title: cardTitle(card, index),
    board: board.title,
    boardId: board.id,
    due: dueLabel(due),
    dueDate: due,
    color: board.color,
    labels: cardLabels(card),
    priority,
    urgent: priority === 'urgent' || priority === 'high' || dueLabel(due) === 'Today',
    completed: isComplete(card),
    assignees,
    raw: card,
  }
}

function normalizeReminder(reminder, card, board, index = 0) {
  const due = reminder?.remind_at || reminder?.due_at || reminder?.scheduled_at || reminder?.date || cardDueDate(card)
  const label = dueLabel(due)
  return {
    id: reminder?.id ?? `${card?.id || board.id}-${index}`,
    title: reminder?.title || reminder?.message || cardTitle(card, index),
    board: board.title,
    time: label === 'Today' && due ? new Date(due).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : label,
    color: label === 'Today' ? '#ef4444' : label === 'Tomorrow' ? '#f59e0b' : '#2f7dff',
    raw: reminder,
  }
}

function normalizeActivityFromBoard(board) {
  const activities = []

  asArray(board.raw?.activities || board.raw?.activity || board.raw?.logs).forEach((item, index) => {
    const user = item?.user || item?.actor || {}
    activities.push({
      id: item?.id ?? `${board.id}-activity-${index}`,
      person: user?.name || item?.user_name || item?.actor_name || 'Workspace member',
      action: item?.description || item?.action || item?.message || `updated "${board.title}"`,
      time: textDate(item?.created_at || item?.updated_at),
      avatar: initials(user?.name || item?.user_name || item?.actor_name, 'WM'),
      avatarUrl: user?.avatar || null,
      board: board.title,
    })
  })

  board.cards.forEach((card, cardIndex) => {
    asArray(card?.comments).forEach((comment, index) => {
      const user = comment?.user || {}
      activities.push({
        id: comment?.id ?? `${board.id}-comment-${cardIndex}-${index}`,
        person: user?.name || comment?.user_name || 'Workspace member',
        action: `commented on "${cardTitle(card, cardIndex)}"`,
        time: textDate(comment?.created_at || comment?.updated_at),
        avatar: initials(user?.name || comment?.user_name, 'WM'),
        avatarUrl: user?.avatar || null,
        board: board.title,
      })
    })
  })

  if (board.updated !== 'No activity yet') {
    activities.push({
      id: `${board.id}-board-updated`,
      person: 'Board activity',
      action: `updated "${board.title}"`,
      time: board.updated,
      avatar: initials(board.title, 'BD'),
      avatarUrl: null,
      board: board.title,
    })
  }

  return activities
}

export const useWorkspaceDashboardStore = defineStore('workspaceDashboard', {
  state: () => ({
    workspaces: [],
    workspace: null,
    boards: [],
    selectedSlug: '',
    currentUserId: null,
    isLoading: false,
    isInviting: false,
    isAcceptingInvitation: false,
    removingMemberId: null,
    labels: [],
    isLoadingLabels: false,
    labelError: '',
    checklists: [],
    isLoadingChecklists: false,
    errorMessage: '',
    memberErrorMessage: '',
  }),

  getters: {
    workspaceId: (state) => state.workspace?.id ?? state.workspace?.uuid ?? state.selectedSlug,

    workspaceSlug: (state) => state.workspace?.slug ?? state.selectedSlug,

    normalizedWorkspace: (state) => {
      const workspace = state.workspace || {}
      const members = workspaceMembers(workspace)
      return {
        id: workspace?.id,
        slug: workspace?.slug,
        ownerId: workspace?.owner_id,
        name: workspace?.title || workspace?.name || 'Workspace',
        description: workspace?.description || workspace?.notes || 'No workspace description yet.',
        bannerImage: workspace?.banner_image || workspace?.bannerImage || '',
        bannerImagePublicId: workspace?.banner_image_public_id || workspace?.bannerImagePublicId || '',
        visibility: workspace?.visibility || workspace?.type || 'private',
        members: workspace?.members_count ?? workspace?.users_count ?? members.length,
        owner: workspace?.owner?.name || workspace?.owner_name || 'Workspace Owner',
        email: workspace?.owner?.email || '',
        membersList: members,
      }
    },

    normalizedWorkspaces: (state) => state.workspaces.map((item) => item?.title || item?.name || item?.slug || 'Workspace'),

    workspaceCards: (state) => state.workspaces.filter((w) => {
      if (w.deleted_at) return false
      const ownerId = w.owner_id 
      if (ownerId && String(ownerId) === String(state.currentUserId)) return true
      const members = workspaceMembers(w)
      return members.some((m) => String(m.id) === String(state.currentUserId) && m.status === 'active')
    }).map(workspaceCard),

    normalizedBoards: (state) => state.boards.map(normalizeBoard),

    recentBoards() {
      return [...this.normalizedBoards]
        .sort((a, b) => new Date(b.raw?.updated_at || 0) - new Date(a.raw?.updated_at || 0))
        .slice(0, 5)
    },

    allTasks() {
      return this.normalizedBoards.flatMap((board) => board.cards.map((card, index) => normalizeTask(card, board, index)))
    },

    myTasks() {
      return this.allTasks
        .filter((task) => {
          if (task.completed) return false
          if (!task.assignees.length || !this.currentUserId) return true
          return task.assignees.some((assignee) => String(assignee?.id ?? assignee?.user_id) === String(this.currentUserId))
        })
        .slice(0, 6)
    },

    reminders() {
      const reminders = []
      this.normalizedBoards.forEach((board) => {
        board.cards.forEach((card, cardIndex) => {
          const cardReminders = asArray(card?.reminders)
          if (cardReminders.length) {
            cardReminders.forEach((reminder, index) => reminders.push(normalizeReminder(reminder, card, board, index)))
            return
          }
          if (cardDueDate(card)) reminders.push(normalizeReminder(null, card, board, cardIndex))
        })
      })
      return reminders.slice(0, 5)
    },

    activities() {
      return this.normalizedBoards.flatMap(normalizeActivityFromBoard).slice(0, 6)
    },

    stats() {
      const tasks = this.allTasks
      const today = new Date().toDateString()
      return [
        { label: 'Total Boards', value: String(this.normalizedBoards.length), change: 'Live workspace data', tone: 'blue', icon: 'grid' },
        { label: 'Total Tasks', value: String(tasks.length), change: 'Across all boards', tone: 'violet', icon: 'monitor' },
        { label: 'Completed', value: String(tasks.filter((task) => task.completed).length), change: 'Completed tasks', tone: 'green', icon: 'check' },
        { label: 'Due Today', value: String(tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() === today).length), change: 'Due today', tone: 'amber', icon: 'calendar' },
        { label: 'Members', value: String(this.normalizedWorkspace.members), change: 'Workspace members', tone: 'blue', icon: 'users' },
      ]
    },

    currentMember() {
      if (!this.currentUserId) return null
      return this.normalizedWorkspace.membersList.find((member) => String(member.id) === String(this.currentUserId)) || null
    },

    canManageMembers() {
      const workspace = this.normalizedWorkspace
      return String(workspace.ownerId) === String(this.currentUserId)
        || (this.currentMember?.role === 'owner' && this.currentMember?.status === 'active')
    },

    currentUserPendingInvitation() {
      return this.currentMember?.status === 'pending'
    },
  },

  actions: {
    setCurrentUser(user) {
      this.currentUserId = user?.id ?? null
    },

    async loadWorkspaceList() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        this.workspaces = asArray(await getWorkspaces())
        this.workspace = null
        this.boards = []
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load workspaces.'
      } finally {
        this.isLoading = false
      }
    },

    async loadDashboard(preferredSlug = '') {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const workspaceList = asArray(await getWorkspaces())
        this.workspaces = workspaceList

        const first = workspaceList[0] || {}
        const slug = preferredSlug || first?.slug || first?.id
        this.selectedSlug = slug

        if (!slug) {
          this.workspace = null
          this.boards = []
          return
        }

        const workspace = unwrap(await getWorkspace(slug))
        this.workspace = workspace
        this.boards = asArray(workspace?.boards ?? [])
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Dashboard data failed to load.'
      } finally {
        this.isLoading = false
      }
    },

    async createWorkspace(payload) {
      this.errorMessage = ''
      const workspace = unwrap(await createWorkspace(workspacePayload(payload)))
      await this.loadDashboard(workspaceRouteKey(workspace) || this.selectedSlug)
      return workspace
    },

    async loadWorkspace(slug) {
      if (!slug) return null
      this.errorMessage = ''
      const workspace = unwrap(await getWorkspace(slug))
      this.workspace = workspace
      this.selectedSlug = workspaceRouteKey(workspace) || slug
      try {
        const response = await getBoardsApi(this.selectedSlug)
        this.boards = asArray(unwrap(response))
      } catch (error) {
        this.boards = asArray(workspace?.boards ?? [])
      }
      return workspace
    },

    async updateWorkspace(workspaceKey, payload) {
      if (!workspaceKey) return null
      this.errorMessage = ''
      const data = {
        title: String(payload.title || payload.name || '').trim(),
        description: payload.description || null,
        visibility: payload.visibility || 'private',
      }
      if (isUploadFile(payload.banner_image)) data.banner_image = payload.banner_image
      const workspace = unwrap(await updateWorkspace(workspaceKey, data))
      await this.loadDashboard(workspaceRouteKey(workspace) || this.selectedSlug)
      return workspace
    },

    async deleteWorkspace(workspaceKey) {
      if (!workspaceKey) return
      this.errorMessage = ''
      await deleteWorkspace(workspaceKey)
      await this.loadWorkspaceList()
    },

    async inviteMember(payload) {
      const role = ['editor', 'viewer'].includes(payload?.role) ? payload.role : 'viewer'
      this.isInviting = true
      this.memberErrorMessage = ''
      try {
        await inviteWorkspaceUser(this.workspaceId, {
          email: payload.email,
          role,
        })
        await this.loadWorkspace(this.workspaceSlug || this.selectedSlug)
      } catch (error) {
        this.memberErrorMessage = error instanceof Error ? error.message : 'Invitation failed.'
        throw error
      } finally {
        this.isInviting = false
      }
    },

    async acceptInvitation() {
      if (!this.workspaceId) return
      this.isAcceptingInvitation = true
      this.memberErrorMessage = ''
      try {
        await acceptWorkspaceInvitation(this.workspaceId)
        await this.loadWorkspace(this.workspaceSlug || this.selectedSlug)
      } catch (error) {
        this.memberErrorMessage = error instanceof Error ? error.message : 'Invitation failed to accept.'
        throw error
      } finally {
        this.isAcceptingInvitation = false
      }
    },

    async acceptInvitationByToken(token) {
      const response = await acceptInvitationByTokenApi(token)
      return response.workspace
    },

    async createBoard(payload) {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        await createBoardApi(workspaceSlug, payload)
        await this.loadWorkspace(workspaceSlug)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to create board.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateBoard(boardId, payload) {
      if (!boardId) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const data = {
          name: String(payload.name || payload.title || '').trim(),
          position: Number(payload.position ?? 0),
        }
        const board = unwrap(await updateBoardApi(workspaceSlug, boardId, data))
        await this.loadWorkspace(workspaceSlug)
        return board
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to update board.'
        throw error
      }
    },

    async reorderBoard(boardId, position) {
      if (!boardId && boardId !== 0) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const board = unwrap(await reorderBoardApi(workspaceSlug, boardId, { position }))
        await this.loadWorkspace(workspaceSlug)
        return board
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to reorder board.'
        throw error
      }
    },

    async toggleFavoriteBoard(boardId) {
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        await toggleFavoriteBoardApi(workspaceSlug, boardId)
        await this.loadWorkspace(workspaceSlug)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to toggle board favorite.'
        throw error
      }
    },

    async loadBoardCards(boardId) {
      if (!boardId) return []
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const cards = asArray(unwrap(await getBoardCardsApi(workspaceSlug, boardId)))
        const index = this.boards.findIndex((board) => String(board?.id ?? board?.uuid) === String(boardId))
        if (index >= 0) {
          this.boards[index] = {
            ...this.boards[index],
            cards,
          }
        }
        return cards
      } catch (error) {
        return []
      }
    },

    async createCard(boardId, payload) {
      if (!boardId) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const card = unwrap(await createCardApi(workspaceSlug, boardId, cardPayload(payload)))
        await this.loadBoardCards(boardId)
        return card
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to create card.'
        throw error
      }
    },

    async loadCard(boardId, cardId) {
      if (!boardId || !cardId) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const card = unwrap(await getCardApi(workspaceSlug, boardId, cardId))
        const boardIndex = this.boards.findIndex((board) => String(board?.id ?? board?.uuid) === String(boardId))
        if (boardIndex >= 0) {
          const cards = asArray(this.boards[boardIndex]?.cards)
          const cardIndex = cards.findIndex((item) => String(item?.id) === String(cardId))
          const nextCards = cardIndex >= 0
            ? cards.map((item, index) => (index === cardIndex ? { ...item, ...card } : item))
            : [...cards, card]
          this.boards[boardIndex] = {
            ...this.boards[boardIndex],
            cards: nextCards,
          }
        }
        return card
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load card.'
        throw error
      }
    },

    async updateCard(boardId, cardId, payload) {
      if (!boardId || !cardId) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const card = unwrap(await updateCardApi(workspaceSlug, boardId, cardId, cardPayload(payload)))
        await this.loadBoardCards(boardId)
        return card
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to update card.'
        throw error
      }
    },

    async deleteCard(boardId, cardId) {
      if (!boardId || !cardId) return null
      this.errorMessage = ''
      try {
        const workspaceSlug = this.workspaceSlug || this.selectedSlug
        const response = await deleteCardApi(workspaceSlug, boardId, cardId)
        await this.loadBoardCards(boardId)
        return response
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to delete card.'
        throw error
      }
    },

    async removeMember(userId) {
      if (!this.workspaceId || !userId || !this.canManageMembers) return
      const member = this.normalizedWorkspace.membersList.find((item) => String(item.id) === String(userId))
      if (member?.isOwner) {
        this.memberErrorMessage = 'Owner tidak boleh dihapus dari workspace.'
        return
      }

      this.removingMemberId = userId
      this.memberErrorMessage = ''
      try {
        await removeWorkspaceUser(this.workspaceId, userId)
        await this.loadWorkspace(this.workspaceSlug || this.selectedSlug)
      } catch (error) {
        this.memberErrorMessage = error instanceof Error ? error.message : 'Member failed to remove.'
        throw error
      } finally {
        this.removingMemberId = null
      }
    },

    async loadLabels() {
      this.isLoadingLabels = true
      this.labelError = ''
      try {
        this.labels = asArray(await getLabelsApi())
      } catch (error) {
        this.labelError = error instanceof Error ? error.message : 'Failed to load labels.'
      } finally {
        this.isLoadingLabels = false
      }
    },

    async createLabel(payload) {
      this.labelError = ''
      try {
        await createLabelApi(labelPayload(payload))
        await this.loadLabels()
      } catch (error) {
        this.labelError = error instanceof Error ? error.message : 'Failed to create label.'
        throw error
      }
    },

    async updateLabel(labelId, payload) {
      if (!labelId) return
      this.labelError = ''
      try {
        await updateLabelApi(labelId, labelPayload(payload))
        await this.loadLabels()
      } catch (error) {
        this.labelError = error instanceof Error ? error.message : 'Failed to update label.'
        throw error
      }
    },

    async deleteLabel(labelId) {
      if (!labelId) return
      this.labelError = ''
      try {
        await deleteLabelApi(labelId)
        await this.loadLabels()
      } catch (error) {
        this.labelError = error instanceof Error ? error.message : 'Failed to delete label.'
        throw error
      }
    },

    async attachLabelToCard(boardId, cardId, labelId) {
      this.errorMessage = ''
      try {
        await attachLabelToCardApi(cardId, labelId)
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to attach label.'
        throw error
      }
    },

    async detachLabelFromCard(boardId, cardId, labelId) {
      this.errorMessage = ''
      try {
        await detachLabelFromCardApi(cardId, labelId)
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to detach label.'
        throw error
      }
    },

    async assignUserToCard(boardId, cardId, userId) {
      this.errorMessage = ''
      try {
        await assignUserToCardApi(cardId, userId)
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to assign user.'
        throw error
      }
    },

    async removeAssigneeFromCard(boardId, cardId, userId) {
      this.errorMessage = ''
      try {
        await removeAssigneeFromCardApi(cardId, userId)
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to remove assignee.'
        throw error
      }
    },

    async loadChecklists() {
      this.isLoadingChecklists = true
      this.errorMessage = ''
      try {
        this.checklists = asArray(await getChecklistsApi())
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load checklists.'
      } finally {
        this.isLoadingChecklists = false
      }
    },

    async createChecklist(boardId, cardId, payload) {
      this.errorMessage = ''
      try {
        await createChecklistApi(payload)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to create checklist.'
        throw error
      }
    },

    async updateChecklist(boardId, cardId, checklistId, payload) {
      if (!checklistId) return
      this.errorMessage = ''
      try {
        await updateChecklistApi(checklistId, payload)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to update checklist.'
        throw error
      }
    },

    async deleteChecklist(boardId, cardId, checklistId) {
      if (!checklistId) return
      this.errorMessage = ''
      try {
        await deleteChecklistApi(checklistId)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to delete checklist.'
        throw error
      }
    },

    async createChecklistItem(boardId, cardId, checklistId, payload) {
      this.errorMessage = ''
      try {
        await createChecklistItemApi(checklistId, payload)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to create checklist item.'
        throw error
      }
    },

    async updateChecklistItem(boardId, cardId, checklistId, itemId, payload) {
      if (!itemId) return
      this.errorMessage = ''
      try {
        await updateChecklistItemApi(checklistId, itemId, payload)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to update checklist item.'
        throw error
      }
    },

    async deleteChecklistItem(boardId, cardId, checklistId, itemId) {
      if (!itemId) return
      this.errorMessage = ''
      try {
        await deleteChecklistItemApi(checklistId, itemId)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to delete checklist item.'
        throw error
      }
    },

    async bulkUpdateChecklistItems(boardId, cardId, checklistId, items) {
      this.errorMessage = ''
      try {
        await bulkUpdateChecklistItemsApi(checklistId, items)
        await this.loadChecklists()
        await this.loadCard(boardId, cardId)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to update checklist items.'
        throw error
      }
    },
  },
})
