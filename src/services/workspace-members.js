import { api } from '../lib/axios'

function workspacePath(workspace) {
  return encodeURIComponent(workspace)
}

export function inviteWorkspaceUser(workspaceId, payload) {
  return api.post(`/workspaces/${workspacePath(workspaceId)}/invite`, payload).then((response) => response.data)
}

export function acceptWorkspaceInvitation(workspaceId) {
  return api.patch(`/workspaces/${workspacePath(workspaceId)}/accept-invitation`).then((response) => response.data)
}

export function removeWorkspaceUser(workspaceId, userId) {
  return api.delete(`/workspaces/${workspacePath(workspaceId)}/users`, { data: { user_id: userId } }).then((response) => response.data)
}

export function acceptInvitationByToken(token) {
  return api.patch('/workspaces/accept-invitation', { token }).then((response) => response.data)
}
