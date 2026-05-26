export const workspace = {
  name: 'Orbit Design Team',
  members: 12,
  owner: 'Jackson Lee',
  email: 'jackson@orbit.com',
}

export const stats = [
  { label: 'Total Boards', value: '24', change: '+12% from last month', tone: 'blue', icon: 'grid' },
  { label: 'Total Tasks', value: '128', change: '+18% from last month', tone: 'violet', icon: 'monitor' },
  { label: 'Completed', value: '42', change: '+24% from last month', tone: 'green', icon: 'check' },
  { label: 'Due Today', value: '8', change: '-5% from yesterday', tone: 'amber', icon: 'calendar' },
  { label: 'Active Members', value: '12', change: '+2 new this week', tone: 'blue', icon: 'users' },
]

export const favoriteBoards = [
  {
    title: 'Product Roadmap',
    tasks: 18,
    color: '#2f7dff',
    image: 'linear-gradient(135deg, rgba(47,125,255,.95), rgba(7,15,35,.25)), radial-gradient(circle at 70% 30%, rgba(106,177,255,.85), transparent 24%), linear-gradient(160deg, #071124, #0a1c47)',
    members: ['SC', 'MJ', 'ED'],
    extraMembers: 5,
  },
  {
    title: 'Design System',
    tasks: 12,
    color: '#8b5cf6',
    image: 'linear-gradient(135deg, rgba(139,92,246,.9), rgba(7,15,35,.3)), radial-gradient(circle at 82% 16%, rgba(244,164,255,.8), transparent 25%), linear-gradient(160deg, #150b2f, #36145f)',
    members: ['AL', 'RM', 'JD'],
    extraMembers: 3,
  },
  {
    title: 'Marketing Plan',
    tasks: 24,
    color: '#60a5fa',
    image: 'linear-gradient(135deg, rgba(96,165,250,.8), rgba(7,15,35,.3)), radial-gradient(circle at 75% 30%, rgba(146,211,255,.8), transparent 22%), linear-gradient(160deg, #071427, #12325f)',
    members: ['MK', 'DT', 'NR'],
    extraMembers: 4,
  },
]

export const recentBoards = [
  { title: 'Mobile App Redesign', updated: 'Updated 2 hours ago', color: '#22d3ee', members: ['SC', 'MJ', 'ED'] },
  { title: 'Website Refresh', updated: 'Updated yesterday', color: '#fb923c', members: ['AL', 'JD', 'RM'] },
  { title: 'Content Calendar', updated: 'Updated 2 days ago', color: '#84cc16', members: ['MK', 'DT', 'NR'] },
  { title: 'Q3 Planning', updated: 'Updated 3 days ago', color: '#c084fc', members: ['JL'] },
]

export const myTasks = [
  { title: 'Design landing page', board: 'Product Roadmap', due: 'Today', color: '#2f7dff', urgent: true },
  { title: 'Create UI components', board: 'Design System', due: 'Tomorrow', color: '#8b5cf6', urgent: false },
  { title: 'Review brand guidelines', board: 'Marketing Plan', due: 'May 28', color: '#60a5fa', urgent: false },
  { title: 'User testing session', board: 'Product Roadmap', due: 'May 30', color: '#2f7dff', urgent: false },
  { title: 'Prepare presentation', board: 'Marketing Plan', due: 'Jun 2', color: '#60a5fa', urgent: false },
]

export const activities = [
  { person: 'Sarah Chen', action: 'moved "Login Screen Design" to In Progress', time: '2 minutes ago', avatar: 'SC' },
  { person: 'Mike Johnson', action: 'commented on "API Integration"', time: '10 minutes ago', avatar: 'MJ' },
  { person: 'Emily Davis', action: 'completed "User Research"', time: '1 hour ago', avatar: 'ED' },
  { person: 'You', action: 'assigned a task to David Wilson', time: '2 hours ago', avatar: 'JL' },
]

export const reminders = [
  { title: 'Design review meeting', board: 'Product Roadmap', time: 'Today, 2:00 PM', color: '#ef4444' },
  { title: 'Client presentation', board: 'Marketing Plan', time: 'May 29, 10:00 AM', color: '#f59e0b' },
  { title: 'Sprint planning', board: 'Q3 Planning', time: 'May 30, 1:00 PM', color: '#8b5cf6' },
  { title: 'Launch preparation', board: 'Product Roadmap', time: 'Jun 2, 9:00 AM', color: '#22c55e' },
]

export const sidebarItems = ['Dashboard', 'Boards', 'Tasks', 'Calendar', 'Members', 'Labels', 'Activity', 'Settings']
export const workspaces = ['Orbit Design Team', 'Marketing Team', 'Dev Squad']
