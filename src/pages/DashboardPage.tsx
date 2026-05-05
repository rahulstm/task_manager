import { useEffect, useMemo, useState } from 'react'
import { fetchProjects } from '../services/project'
import { fetchTasks } from '../services/task'
import type { Project, Task } from '../types'

const statusLabels = ['To Do', 'In Progress', 'Done'] as const

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [projectList, taskList] = await Promise.all([fetchProjects(), fetchTasks()])
        setProjects(projectList)
        setTasks(taskList)
      } catch (err) {
        setError('Unable to load dashboard data. Please check your backend connection.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const counts = useMemo(() => {
    const totals = { total: tasks.length, overdue: 0, status: { 'To Do': 0, 'In Progress': 0, Done: 0 } }
    const now = new Date()
    tasks.forEach((task) => {
      const due = new Date(task.dueDate)
      totals.status[task.status] += 1
      if (due < now && task.status !== 'Done') {
        totals.overdue += 1
      }
    })
    return totals
  }, [tasks])

  if (loading) {
    return <section className="page-shell">Loading dashboard...</section>
  }

  return (
    <section className="page-shell dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Team dashboard</h1>
          <p>Track project progress, overdue tasks, and team workload in one place.</p>
        </div>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total projects</span>
          <strong>{projects.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total tasks</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="stat-card">
          <span>Overdue tasks</span>
          <strong>{counts.overdue}</strong>
        </div>
      </div>

      <div className="status-grid">
        {statusLabels.map((status) => (
          <div key={status} className="status-card">
            <span>{status}</span>
            <strong>{counts.status[status]}</strong>
          </div>
        ))}
      </div>

      <section className="section-card">
        <h2>Recent tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks available yet.</p>
        ) : (
          <div className="task-list">
            {tasks.slice(0, 5).map((task) => (
              <div key={task._id} className="task-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </div>
                <div>
                  <span>{task.status}</span>
                  <small>{new Date(task.dueDate).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
