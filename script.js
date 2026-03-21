/* =====================================================
   TASKFLOW — script.js
   Full SaaS Task Manager Logic
   ===================================================== */

/* ── STATE ───────────────────────────────────────────── */
const AVATAR_COLORS = ['#6ee7b7','#60a5fa','#a78bfa','#fbbf24','#f472b6','#f87171','#34d399','#818cf8'];

let state = {
  tasks: [],
  projects: [],
  members: [],
  activity: [],
  editingTaskId: null,
};

/* ── SEED DATA ───────────────────────────────────────── */
const SEED_PROJECTS = [
  { id:'p1', name:'E-Commerce Platform', desc:'Full-stack online store with payments & inventory.', status:'active', color:'#6ee7b7', start:'2025-01-10', deadline:'2025-06-30' },
  { id:'p2', name:'Task Management SaaS', desc:'Collaborative project management with real-time updates.', status:'active', color:'#60a5fa', start:'2025-02-01', deadline:'2025-07-15' },
  { id:'p3', name:'AI Content Generator', desc:'LLM-powered platform for marketing content.', status:'active', color:'#a78bfa', start:'2025-03-01', deadline:'2025-08-31' },
  { id:'p4', name:'Mobile Finance App', desc:'Cross-platform personal finance tracker.', status:'on-hold', color:'#fbbf24', start:'2025-01-20', deadline:'2025-09-01' },
  { id:'p5', name:'Portfolio Builder', desc:'No-code tool to deploy dev portfolios instantly.', status:'completed', color:'#f472b6', start:'2024-09-01', deadline:'2025-01-15' },
];

const SEED_MEMBERS = [
  { id:'m1', name:'Sherlock Holmes', email:'sherlock@taskflow.io',   role:'Admin',     dept:'Engineering', color:'#a78bfa' },
  { id:'m2', name:'John Watson',     email:'watson@taskflow.io',     role:'Developer', dept:'Engineering', color:'#60a5fa' },
  { id:'m3', name:'Irene Adler',     email:'irene@taskflow.io',      role:'Designer',  dept:'Design',      color:'#f472b6' },
  { id:'m4', name:'Mycroft Holmes',  email:'mycroft@taskflow.io',    role:'Manager',   dept:'Product',     color:'#fbbf24' },
  { id:'m5', name:'Moriarty J.',     email:'moriarty@taskflow.io',   role:'Developer', dept:'Engineering', color:'#f87171' },
  { id:'m6', name:'Mary Watson',     email:'mary@taskflow.io',       role:'QA',        dept:'QA',          color:'#34d399' },
];

const SEED_TASKS = [
  { id:'t1',  title:'Set up CI/CD pipeline',        project:'p2', status:'done',       priority:'high',     assignee:'m2', due:'2025-03-01', desc:'Configure GitHub Actions for auto-deploy.', tags:['devops','backend'] },
  { id:'t2',  title:'Design onboarding flow',        project:'p2', status:'done',       priority:'medium',   assignee:'m3', due:'2025-03-10', desc:'Create wireframes for the 5-step onboarding.', tags:['design','ux'] },
  { id:'t3',  title:'Implement drag-and-drop',       project:'p2', status:'done',       priority:'high',     assignee:'m2', due:'2025-03-15', desc:'Native HTML5 drag-and-drop for Kanban cards.', tags:['frontend'] },
  { id:'t4',  title:'Real-time WebSocket layer',     project:'p2', status:'done',       priority:'critical', assignee:'m5', due:'2025-03-20', desc:'Socket.io for live task updates.', tags:['backend','realtime'] },
  { id:'t5',  title:'Analytics dashboard',           project:'p2', status:'inprogress', priority:'medium',   assignee:'m2', due:'2025-04-05', desc:'Charts for task velocity and team productivity.', tags:['frontend','analytics'] },
  { id:'t6',  title:'Team permissions system',       project:'p2', status:'inprogress', priority:'high',     assignee:'m5', due:'2025-04-10', desc:'Role-based access control for team features.', tags:['backend','security'] },
  { id:'t7',  title:'Mobile responsive fixes',       project:'p2', status:'inprogress', priority:'medium',   assignee:'m3', due:'2025-04-12', desc:'Ensure all views work on mobile.', tags:['frontend','mobile'] },
  { id:'t8',  title:'Notification system',           project:'p2', status:'review',     priority:'medium',   assignee:'m2', due:'2025-04-08', desc:'Email + in-app notifications for task updates.', tags:['backend'] },
  { id:'t9',  title:'Search & filter tasks',         project:'p2', status:'review',     priority:'low',      assignee:'m3', due:'2025-04-15', desc:'Full-text search with advanced filtering.', tags:['frontend'] },
  { id:'t10', title:'Write API documentation',       project:'p2', status:'todo',       priority:'low',      assignee:'m6', due:'2025-04-20', desc:'OpenAPI 3.0 spec for all endpoints.', tags:['docs'] },
  { id:'t11', title:'Set up PostgreSQL schema',      project:'p2', status:'done',       priority:'high',     assignee:'m5', due:'2025-03-05', desc:'Design and migrate DB schema.', tags:['database'] },
  { id:'t12', title:'Load testing',                  project:'p2', status:'backlog',    priority:'medium',   assignee:'m6', due:'2025-05-01', desc:'Simulate 10k concurrent users.', tags:['testing'] },
  { id:'t13', title:'Payment gateway integration',   project:'p1', status:'inprogress', priority:'critical', assignee:'m2', due:'2025-04-02', desc:'Stripe checkout and webhooks.', tags:['backend','payments'] },
  { id:'t14', title:'Product listing page',          project:'p1', status:'done',       priority:'medium',   assignee:'m3', due:'2025-03-25', desc:'Dynamic product grid with filters.', tags:['frontend'] },
  { id:'t15', title:'Admin inventory dashboard',     project:'p1', status:'todo',       priority:'high',     assignee:'m2', due:'2025-04-18', desc:'Real-time stock management UI.', tags:['frontend','admin'] },
  { id:'t16', title:'GPT-4 integration',             project:'p3', status:'inprogress', priority:'critical', assignee:'m5', due:'2025-04-14', desc:'Connect to OpenAI API for content generation.', tags:['ai','backend'] },
  { id:'t17', title:'Content templates library',     project:'p3', status:'todo',       priority:'medium',   assignee:'m3', due:'2025-04-25', desc:'50 pre-built templates for blog, ads, social.', tags:['content','design'] },
  { id:'t18', title:'Bank sync module',              project:'p4', status:'backlog',    priority:'high',     assignee:'m2', due:'2025-05-15', desc:'Plaid API integration for account linking.', tags:['backend','finance'] },
];

const SEED_ACTIVITY = [
  { user:'m2', action:'completed task', target:'"Set up CI/CD pipeline"', time:'2 min ago' },
  { user:'m3', action:'created design for', target:'"Design onboarding flow"', time:'18 min ago' },
  { user:'m5', action:'moved', target:'"WebSocket layer" to Review', time:'35 min ago' },
  { user:'m1', action:'created project', target:'"AI Content Generator"', time:'1 hr ago' },
  { user:'m6', action:'joined the team', target:'', time:'2 hrs ago' },
];

/* ── LOCAL STORAGE ───────────────────────────────────── */
function save() {
  localStorage.setItem('taskflow_state', JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem('taskflow_state');
  if (raw) {
    const parsed = JSON.parse(raw);
    state = { ...state, ...parsed };
  } else {
    state.tasks    = SEED_TASKS;
    state.projects = SEED_PROJECTS;
    state.members  = SEED_MEMBERS;
    state.activity = SEED_ACTIVITY;
    save();
  }
}

/* ── HELPERS ─────────────────────────────────────────── */
function uid() { return 't' + Date.now() + Math.random().toString(36).slice(2,6); }

function getProject(id) { return state.projects.find(p => p.id === id); }
function getMember(id)  { return state.members.find(m => m.id === id); }

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
}

function avatarColor(id) {
  const idx = (id || '').split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function daysUntil(d) {
  if (!d) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const due = new Date(d); due.setHours(0,0,0,0);
  return Math.round((due - now) / 86400000);
}

function dueDateClass(d) {
  const days = daysUntil(d);
  if (days === null) return '';
  if (days < 0)  return 'overdue';
  if (days <= 3) return 'soon';
  return 'ok';
}

function dueDateLabel(d) {
  const days = daysUntil(d);
  if (days === null) return '';
  if (days < 0)  return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days}d left`;
}

function showToast(msg, type='info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = 'toast', 3000);
}

/* ── NAVIGATION ──────────────────────────────────────── */
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-view="${name}"]`);
  if (navItem) navItem.classList.add('active');

  const labels = { dashboard:'Dashboard', projects:'Projects', kanban:'Kanban Board', team:'Team' };
  document.getElementById('breadcrumbText').textContent = labels[name] || name;

  // Refresh view
  if (name === 'dashboard') renderDashboard();
  if (name === 'projects')  renderProjects();
  if (name === 'kanban')    renderKanban();
  if (name === 'team')      renderTeam();

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

/* ── DASHBOARD ───────────────────────────────────────── */
function renderDashboard() {
  // Stats
  const done      = state.tasks.filter(t => t.status === 'done').length;
  const active    = state.tasks.filter(t => ['inprogress','review'].includes(t.status)).length;
  const overdue   = state.tasks.filter(t => t.status !== 'done' && daysUntil(t.due) < 0).length;
  const projects  = state.projects.filter(p => p.status === 'active').length;

  animateCount('statDone',     done);
  animateCount('statActive',   active);
  animateCount('statOverdue',  overdue);
  animateCount('statProjects', projects);

  // Date badge
  document.getElementById('dateBadge').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });

  renderActivityChart();
  renderStatusChart();
  renderActivityList();
  renderDueList();
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 25));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(timer);
  }, 40);
}

let actChart = null, statusChart = null;

function renderActivityChart() {
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;

  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const completed = [3,5,4,7,6,2,4];
  const created   = [4,6,3,8,5,3,5];

  if (actChart) actChart.destroy();
  actChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label:'Completed', data:completed, backgroundColor:'rgba(110,231,183,0.7)', borderRadius:5, borderSkipped:false },
        { label:'Created',   data:created,   backgroundColor:'rgba(96,165,250,0.4)',  borderRadius:5, borderSkipped:false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend:{ labels:{ color:'#8b8fa8', font:{family:'DM Sans',size:11}, boxWidth:10 } } },
      scales: {
        x: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#8b8fa8', font:{size:11} } },
        y: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#8b8fa8', font:{size:11} }, beginAtZero:true }
      }
    }
  });
}

function renderStatusChart() {
  const ctx = document.getElementById('statusChart');
  if (!ctx) return;

  const counts = {
    backlog:    state.tasks.filter(t => t.status === 'backlog').length,
    todo:       state.tasks.filter(t => t.status === 'todo').length,
    inprogress: state.tasks.filter(t => t.status === 'inprogress').length,
    review:     state.tasks.filter(t => t.status === 'review').length,
    done:       state.tasks.filter(t => t.status === 'done').length,
  };

  if (statusChart) statusChart.destroy();
  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Backlog','To Do','In Progress','Review','Done'],
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#475569','#60a5fa','#fbbf24','#a78bfa','#6ee7b7'],
        borderWidth: 2, borderColor: '#13161f',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { position:'bottom', labels:{ color:'#8b8fa8', font:{family:'DM Sans',size:11}, boxWidth:10, padding:12 } }
      }
    }
  });
}

function renderActivityList() {
  const list = document.getElementById('activityList');
  if (!list) return;
  list.innerHTML = state.activity.slice(0,5).map(a => {
    const m = getMember(a.user);
    const col = m ? m.color : '#6ee7b7';
    const name = m ? m.name.split(' ')[0] : 'Someone';
    return `<li class="activity-item">
      <div class="activity-avatar" style="background:${col}">${m ? initials(m.name) : '?'}</div>
      <div class="activity-text"><strong>${name}</strong> ${a.action} ${a.target}</div>
      <div class="activity-time">${a.time}</div>
    </li>`;
  }).join('');
}

function renderDueList() {
  const list = document.getElementById('dueList');
  if (!list) return;
  const upcoming = state.tasks
    .filter(t => t.status !== 'done' && t.due)
    .sort((a,b) => new Date(a.due) - new Date(b.due))
    .slice(0,5);

  if (!upcoming.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✓</div><p>No tasks due soon!</p></div>';
    return;
  }

  list.innerHTML = upcoming.map(t => {
    const p = getProject(t.project);
    const cls = dueDateClass(t.due);
    return `<li class="due-item" onclick="openTaskDetail('${t.id}')">
      <div class="due-info">
        <div class="due-title">${t.title}</div>
        <div class="due-project">${p ? p.name : 'No project'}</div>
      </div>
      <div class="due-date ${cls}">${dueDateLabel(t.due)}</div>
    </li>`;
  }).join('');
}

/* ── PROJECTS ────────────────────────────────────────── */
function renderProjects(filter='all') {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  let list = filter === 'all'
    ? state.projects
    : state.projects.filter(p => p.status === filter);

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">◈</div>
      <p>No projects found. Create one!</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const tasks     = state.tasks.filter(t => t.project === p.id);
    const doneTasks = tasks.filter(t => t.status === 'done');
    const pct       = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
    const members   = [...new Set(tasks.map(t => t.assignee).filter(Boolean))].slice(0,4);

    return `<div class="project-card" style="--proj-color:${p.color}" onclick="openProjectKanban('${p.id}')">
      <div class="proj-top">
        <h3 class="proj-name">${p.name}</h3>
        <span class="proj-status status-${p.status}">${p.status.replace('-',' ')}</span>
      </div>
      <p class="proj-desc">${p.desc || 'No description.'}</p>
      <div class="proj-progress-label">
        <span>Progress</span><span>${pct}%</span>
      </div>
      <div class="proj-progress-track">
        <div class="proj-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="proj-meta">
        <span class="proj-tasks">${tasks.length} tasks · ${doneTasks.length} done</span>
        <div class="proj-avatars">
          ${members.map(mid => {
            const m = getMember(mid);
            return m ? `<div class="proj-avatar" style="background:${m.color}" title="${m.name}">${initials(m.name)}</div>` : '';
          }).join('')}
        </div>
        <span class="proj-deadline" style="margin-left:8px">${p.deadline ? '📅 ' + formatDate(p.deadline) : ''}</span>
      </div>
    </div>`;
  }).join('');
}

function openProjectKanban(pid) {
  document.getElementById('kanbanProjectFilter').value = pid;
  switchView('kanban');
  filterKanbanByProject(pid);
}

/* ── KANBAN ──────────────────────────────────────────── */
function renderKanban(projectFilter='all') {
  populateKanbanFilter();

  const statuses = ['backlog','todo','inprogress','review','done'];

  statuses.forEach(status => {
    const drop = document.getElementById(`drop-${status}`);
    const count = document.getElementById(`count-${status}`);
    if (!drop) return;

    let tasks = state.tasks.filter(t => t.status === status);
    if (projectFilter !== 'all') tasks = tasks.filter(t => t.project === projectFilter);

    count.textContent = tasks.length;

    if (!tasks.length) {
      drop.innerHTML = `<div class="empty-state" style="padding:20px 10px">
        <div style="font-size:1.5rem;margin-bottom:6px">⊡</div>
        <p style="font-size:0.75rem">Drop tasks here</p>
      </div>`;
    } else {
      drop.innerHTML = tasks.map(t => buildTaskCard(t)).join('');
    }
  });

  setupDragDrop();
}

function populateKanbanFilter() {
  const sel = document.getElementById('kanbanProjectFilter');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="all">All Projects</option>' +
    state.projects.map(p => `<option value="${p.id}" ${p.id===cur?'selected':''}>${p.name}</option>`).join('');
}

function filterKanbanByProject(pid) {
  document.getElementById('kanbanProjectFilter').value = pid;
  const p = getProject(pid);
  document.getElementById('kanbanProjectLabel').textContent = p ? p.name : 'All tasks';
  renderKanban(pid);
}

function buildTaskCard(t) {
  const p = getProject(t.project);
  const m = getMember(t.assignee);
  const daysLeft = daysUntil(t.due);
  const dueCls = dueDateClass(t.due);
  const dueStr = t.due ? dueDateLabel(t.due) : '';

  const tagsHTML = (t.tags || []).slice(0,2).map(tag =>
    `<span class="task-tag">${tag}</span>`).join('');

  return `<div class="task-card" draggable="true" data-id="${t.id}" onclick="openTaskDetail('${t.id}')">
    <div class="task-card-top">
      <div class="task-title-card">${t.title}</div>
      <div class="priority-dot priority-${t.priority}" title="${t.priority}"></div>
    </div>
    ${t.desc ? `<div class="task-desc-short">${t.desc}</div>` : ''}
    ${tagsHTML ? `<div class="task-tags">${tagsHTML}</div>` : ''}
    <div class="task-card-footer">
      <span class="task-project-chip">${p ? p.name : ''}</span>
      ${dueStr ? `<span class="task-due-label ${dueCls}" title="${formatDate(t.due)}">${dueStr}</span>` : ''}
      ${m ? `<div class="task-assignee-chip" style="background:${m.color}" title="${m.name}">${initials(m.name)}</div>` : ''}
    </div>
  </div>`;
}

/* ── DRAG & DROP ─────────────────────────────────────── */
let draggedId = null;

function setupDragDrop() {
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedId = card.dataset.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.col-body').forEach(c => c.classList.remove('drag-over'));
    });
  });

  document.querySelectorAll('.droppable').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const newStatus = zone.dataset.status;
      if (!draggedId) return;
      const task = state.tasks.find(t => t.id === draggedId);
      if (task && task.status !== newStatus) {
        const oldStatus = task.status;
        task.status = newStatus;
        addActivity('m1', 'moved task', `"${task.title}" to ${newStatus}`);
        save();
        const filter = document.getElementById('kanbanProjectFilter')?.value || 'all';
        renderKanban(filter);
        showToast(`Task moved to ${newStatus}`, 'success');
      }
      draggedId = null;
    });
  });
}

/* ── TEAM ────────────────────────────────────────────── */
function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  document.getElementById('teamTotal').textContent  = state.members.length;
  document.getElementById('teamAdmins').textContent  = state.members.filter(m => m.role === 'Admin').length;
  document.getElementById('teamDev').textContent     = state.members.filter(m => m.role === 'Developer').length;
  document.getElementById('teamDesign').textContent  = state.members.filter(m => m.role === 'Designer').length;

  grid.innerHTML = state.members.map(m => {
    const tasks = state.tasks.filter(t => t.assignee === m.id);
    const done  = tasks.filter(t => t.status === 'done');
    return `<div class="member-card">
      <div class="member-avatar" style="background:${m.color}">${initials(m.name)}</div>
      <div class="member-name">${m.name}</div>
      <div class="member-email">${m.email}</div>
      <div class="member-role-badge role-${m.role}">${m.role}</div>
      <div class="member-dept">${m.dept || 'General'}</div>
      <div class="member-tasks"><strong>${done.length}</strong>/${tasks.length} tasks completed</div>
      <div class="member-actions">
        <button class="btn-sm btn-sm-primary" onclick="assignTaskToMember('${m.id}')">Assign Task</button>
        <button class="btn-sm btn-sm-ghost" onclick="viewMemberTasks('${m.id}')">Tasks</button>
        ${m.id !== 'm1' ? `<button class="btn-sm btn-sm-danger" onclick="removeMember('${m.id}')">✕</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function assignTaskToMember(mid) {
  openTaskModal();
  setTimeout(() => {
    const sel = document.getElementById('taskAssignee');
    if (sel) sel.value = mid;
  }, 50);
}

function viewMemberTasks(mid) {
  const m = getMember(mid);
  const tasks = state.tasks.filter(t => t.assignee === mid);
  showToast(`${m?.name}: ${tasks.length} task(s) assigned`, 'info');
  document.getElementById('kanbanProjectFilter').value = 'all';
  switchView('kanban');
}

function removeMember(mid) {
  if (!confirm('Remove this member?')) return;
  state.members = state.members.filter(m => m.id !== mid);
  save();
  renderTeam();
  showToast('Member removed', 'info');
}

/* ── ACTIVITY LOG ────────────────────────────────────── */
function addActivity(userId, action, target) {
  state.activity.unshift({ user: userId, action, target, time: 'just now' });
  if (state.activity.length > 50) state.activity.pop();
}

/* ── TASK MODAL ──────────────────────────────────────── */
function openTaskModal(taskId=null) {
  state.editingTaskId = taskId;
  const title = document.getElementById('taskModalTitle');

  // Populate project select
  const ps = document.getElementById('taskProject');
  ps.innerHTML = '<option value="">No project</option>' +
    state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

  // Populate assignee select
  const as = document.getElementById('taskAssignee');
  as.innerHTML = '<option value="">Unassigned</option>' +
    state.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

  if (taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    title.textContent = 'Edit Task';
    document.getElementById('taskTitle').value    = task.title;
    document.getElementById('taskProject').value  = task.project || '';
    document.getElementById('taskStatus').value   = task.status;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskAssignee').value = task.assignee || '';
    document.getElementById('taskDue').value      = task.due || '';
    document.getElementById('taskDesc').value     = task.desc || '';
    document.getElementById('taskTags').value     = (task.tags || []).join(', ');
  } else {
    title.textContent = 'New Task';
    document.getElementById('taskTitle').value    = '';
    document.getElementById('taskProject').value  = '';
    document.getElementById('taskStatus').value   = 'todo';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskAssignee').value = '';
    document.getElementById('taskDue').value      = '';
    document.getElementById('taskDesc').value     = '';
    document.getElementById('taskTags').value     = '';
  }

  document.getElementById('taskModal').classList.add('open');
}

function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) { showToast('Task title is required', 'error'); return; }

  const data = {
    title,
    project:  document.getElementById('taskProject').value  || '',
    status:   document.getElementById('taskStatus').value,
    priority: document.getElementById('taskPriority').value,
    assignee: document.getElementById('taskAssignee').value || '',
    due:      document.getElementById('taskDue').value      || '',
    desc:     document.getElementById('taskDesc').value.trim(),
    tags:     document.getElementById('taskTags').value.split(',').map(s=>s.trim()).filter(Boolean),
  };

  if (state.editingTaskId) {
    const idx = state.tasks.findIndex(t => t.id === state.editingTaskId);
    if (idx !== -1) {
      state.tasks[idx] = { ...state.tasks[idx], ...data };
      addActivity('m1', 'updated task', `"${title}"`);
      showToast('Task updated!', 'success');
    }
  } else {
    const task = { id: uid(), ...data };
    state.tasks.unshift(task);
    addActivity('m1', 'created task', `"${title}"`);
    showToast('Task created!', 'success');
  }

  save();
  closeModal('taskModal');
  renderKanban(document.getElementById('kanbanProjectFilter')?.value || 'all');
  renderDashboard();
}

/* ── TASK DETAIL ─────────────────────────────────────── */
function openTaskDetail(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  const p = getProject(task.project);
  const m = getMember(task.assignee);

  document.getElementById('detailTitle').textContent = task.title;
  document.getElementById('taskDetailModal').classList.add('open');
  document.getElementById('deleteTaskBtn').onclick = () => deleteTask(id);
  document.getElementById('editTaskBtn').onclick   = () => { closeModal('taskDetailModal'); openTaskModal(id); };

  document.getElementById('taskDetailBody').innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="detail-label">Status</div>
        <div class="detail-value">
          <span class="proj-status status-${task.status === 'inprogress' ? 'active' : task.status === 'done' ? 'completed' : 'on-hold'}">
            ${task.status.replace('inprogress','In Progress').replace('review','In Review').replace('todo','To Do').replace('done','Done').replace('backlog','Backlog')}
          </span>
        </div>
      </div>
      <div>
        <div class="detail-label">Priority</div>
        <div class="detail-value"><span class="pri-badge pri-${task.priority}">● ${task.priority}</span></div>
      </div>
      <div>
        <div class="detail-label">Project</div>
        <div class="detail-value">${p ? `<span style="color:${p.color}">${p.name}</span>` : '—'}</div>
      </div>
      <div>
        <div class="detail-label">Assignee</div>
        <div class="detail-value" style="display:flex;align-items:center;gap:8px">
          ${m ? `<div class="task-assignee-chip" style="background:${m.color};width:24px;height:24px;flex-shrink:0">${initials(m.name)}</div> ${m.name}` : '—'}
        </div>
      </div>
      <div>
        <div class="detail-label">Due Date</div>
        <div class="detail-value ${dueDateClass(task.due)}">${task.due ? formatDate(task.due) + (daysUntil(task.due) !== null ? ` (${dueDateLabel(task.due)})` : '') : '—'}</div>
      </div>
      <div>
        <div class="detail-label">Tags</div>
        <div class="detail-value" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:2px">
          ${(task.tags||[]).map(tag => `<span class="task-tag">${tag}</span>`).join('') || '—'}
        </div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-label">Description</div>
      <div class="detail-desc">${task.desc || 'No description provided.'}</div>
    </div>
  `;
}

function deleteTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!confirm(`Delete "${task?.title}"?`)) return;
  state.tasks = state.tasks.filter(t => t.id !== id);
  addActivity('m1', 'deleted task', `"${task?.title}"`);
  save();
  closeModal('taskDetailModal');
  renderKanban(document.getElementById('kanbanProjectFilter')?.value || 'all');
  renderDashboard();
  showToast('Task deleted', 'info');
}

/* ── PROJECT MODAL ───────────────────────────────────── */
function openProjectModal() {
  document.getElementById('projName').value     = '';
  document.getElementById('projDesc').value     = '';
  document.getElementById('projStatus').value   = 'active';
  document.getElementById('projColor').value    = '#6ee7b7';
  document.getElementById('projStart').value    = '';
  document.getElementById('projDeadline').value = '';
  document.getElementById('projectModal').classList.add('open');
}

function saveProject() {
  const name = document.getElementById('projName').value.trim();
  if (!name) { showToast('Project name is required', 'error'); return; }

  const project = {
    id:       'p' + Date.now(),
    name,
    desc:     document.getElementById('projDesc').value.trim(),
    status:   document.getElementById('projStatus').value,
    color:    document.getElementById('projColor').value,
    start:    document.getElementById('projStart').value,
    deadline: document.getElementById('projDeadline').value,
  };

  state.projects.unshift(project);
  addActivity('m1', 'created project', `"${name}"`);
  save();
  closeModal('projectModal');
  renderProjects(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  showToast('Project created!', 'success');
}

/* ── MEMBER MODAL ────────────────────────────────────── */
function openMemberModal() {
  document.getElementById('memberName').value  = '';
  document.getElementById('memberEmail').value = '';
  document.getElementById('memberRole').value  = 'Developer';
  document.getElementById('memberDept').value  = '';
  document.getElementById('memberModal').classList.add('open');
}

function saveMember() {
  const name = document.getElementById('memberName').value.trim();
  const email = document.getElementById('memberEmail').value.trim();
  if (!name || !email) { showToast('Name and email are required', 'error'); return; }

  const member = {
    id:    'm' + Date.now(),
    name,
    email,
    role:  document.getElementById('memberRole').value,
    dept:  document.getElementById('memberDept').value.trim(),
    color: AVATAR_COLORS[state.members.length % AVATAR_COLORS.length],
  };

  state.members.push(member);
  addActivity('m1', 'invited', `${name} to the team`);
  save();
  closeModal('memberModal');
  renderTeam();
  showToast(`Invite sent to ${name}!`, 'success');
}

/* ── MODAL HELPERS ───────────────────────────────────── */
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

/* ── SEARCH ──────────────────────────────────────────── */
function handleSearch(q) {
  if (!q.trim()) return;
  q = q.toLowerCase();
  const results = state.tasks.filter(t =>
    t.title.toLowerCase().includes(q) || (t.tags||[]).some(tag => tag.includes(q))
  );
  showToast(`Found ${results.length} task(s) matching "${q}"`, 'info');
  if (results.length) {
    switchView('kanban');
  }
}

/* ── CHART TAB ───────────────────────────────────────── */
function setupChartTabs() {
  document.querySelectorAll('.ctab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderActivityChart();
    });
  });
}

/* ── INIT ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  load();

  // Nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchView(item.dataset.view);
    });
  });

  // Card links that trigger view switch
  document.addEventListener('click', e => {
    const cl = e.target.closest('.card-link');
    if (cl?.dataset.view) switchView(cl.dataset.view);
  });

  // Sidebar toggle (mobile)
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // New task button
  document.getElementById('newTaskBtn')?.addEventListener('click',       openTaskModal);
  document.getElementById('kanbanNewTaskBtn')?.addEventListener('click', openTaskModal);
  document.getElementById('saveTaskBtn')?.addEventListener('click',      saveTask);

  // Project
  document.getElementById('newProjectBtn')?.addEventListener('click', openProjectModal);
  document.getElementById('saveProjBtn')?.addEventListener('click',   saveProject);

  // Member
  document.getElementById('inviteMemberBtn')?.addEventListener('click', openMemberModal);
  document.getElementById('saveMemberBtn')?.addEventListener('click',   saveMember);

  // Modal close buttons
  document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal || btn.closest('.modal-overlay')?.id));
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Kanban project filter
  document.getElementById('kanbanProjectFilter')?.addEventListener('change', e => {
    filterKanbanByProject(e.target.value);
  });

  // Kanban col add buttons
  document.querySelectorAll('.col-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openTaskModal();
      setTimeout(() => {
        document.getElementById('taskStatus').value = btn.dataset.status;
      }, 40);
    });
  });

  // Project filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });

  // Search
  const searchInput = document.getElementById('searchInput');
  let searchTimer;
  searchInput?.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => handleSearch(e.target.value), 400);
  });
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch(e.target.value);
  });

  // Chart tabs
  setupChartTabs();

  // Initial render
  renderDashboard();
});
