# Fix Data Loading Issues

## 1. Race Condition + Error Boundary — WorkspaceShowPage.vue

**File:** `src/views/workspaceshowpage/WorkspaceShowPage.vue`

**Changes:**
- Add `let loadGeneration = 0` before `loadWorkspace()`
- At start: `const generation = ++loadGeneration`
- After `await dashboardStore.loadWorkspace(slug)`: add `if (generation !== loadGeneration) return`
- Before `initWorkspaceForm()`: add `if (generation !== loadGeneration) return`
- Wrap `loadBoardCards()` in its own try/catch/finally

```js
let loadGeneration = 0

async function loadWorkspace() {
  const generation = ++loadGeneration
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
    if (generation !== loadGeneration) return
    const userId = authStore.user?.id
    const isActiveMember = userId && workspace.value.membersList.some((m) => String(m.id) === String(userId) && m.status === 'active')
    const isPublic = workspace.value.visibility === 'public'
    isReadOnly.value = isPublic && !isActiveMember
    pageState.value = (isActiveMember || isPublic) ? 'ready' : 'denied'
    selectedBoardId.value = isBoardShowRoute.value ? route.params.boardId : null
    if (isBoardShowRoute.value && selectedBoardId.value && pageState.value === 'ready') {
      isLoadingBoardCards.value = true
      try {
        await dashboardStore.loadBoardCards(selectedBoardId.value)
      } catch (e) {
        console.error('Failed to load board cards:', e)
      } finally {
        isLoadingBoardCards.value = false
      }
    }
    if (generation !== loadGeneration) return
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
```

## 2. Route Watch — WorkspacePage.vue

**File:** `src/views/WorkspacePage.vue`

**Changes:**
- Import `onBeforeRouteUpdate` from `vue-router`
- Add after `onMounted`:

```js
import { computed, onBeforeRouteUpdate, onMounted, reactive, ref } from 'vue'

// after onMounted block
onBeforeRouteUpdate((to, from) => {
  if (to.path !== from.path) {
    dashboardStore.loadWorkspaceList()
  }
})
```

## 3. Reset Store — workspaceDashboard.js + auth.js

**File:** `src/stores/workspaceDashboard.js`

Add `reset()` action:

```js
reset() {
  this.workspaces = []
  this.workspace = null
  this.boards = []
  this.selectedSlug = ''
  this.currentUserId = null
  this.isLoading = false
  this.isInviting = false
  this.isAcceptingInvitation = false
  this.removingMemberId = null
  this.labels = []
  this.isLoadingLabels = false
  this.labelError = ''
  this.statuses = []
  this.isLoadingStatuses = false
  this.statusError = ''
  this.checklists = []
  this.isLoadingChecklists = false
  this.errorMessage = ''
  this.memberErrorMessage = ''
}
```

**File:** `src/stores/auth.js`

In `logout()` action, add dashboard store reset:

```js
async logout() {
  try {
    await logoutRequest()
  } catch {
    // ignore
  }

  this.user = null
  this.initialized = true

  // Reset dashboard store
  const { useWorkspaceDashboardStore } = await import('./workspaceDashboard')
  const dashboardStore = useWorkspaceDashboardStore()
  dashboardStore.reset()
},
```

## 4. Remove Duplicate Load — LabelList.vue

**File:** `src/views/labels/LabelList.vue`

- Remove the entire `onMounted` block (lines 19-21):

```js
// DELETE these lines:
onMounted(() => {
  dashboardStore.loadLabels()
})
```
