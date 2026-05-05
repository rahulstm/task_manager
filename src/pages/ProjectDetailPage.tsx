import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createTask, updateTask } from '../services/task'
import { fetchProject, fetchProjectTasks } from '../services/project'
import type { Project, Task, TaskPriority, TaskStatus } from '../types'

const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Done']
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High']

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!projectId) return
      setLoading(true)
      try {
        const [projectData, projectTasks] = await Promise.all([
          fetchProject(projectId),
          fetchProjectTasks(projectId),
        ])
        setProject(projectData)
        setTasks(projectTasks)
      } catch (err) {
        setError('Unable to load project details. Please make sure your backend is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  const overdueCount = useMemo(
    () => tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== 'Done').length,
    [tasks],
  )

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!projectId) return
    setError(null)
    try {
      const created = await createTask(projectId, { title, description, dueDate, priority })
      setTasks((current) => [created, ...current])
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('Medium')
    } catch (err) {
      setError('Unable to create task. Please try again.')
    }
  }

  const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const updated = await updateTask(taskId, { status })
      setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)))
    } catch (err) {
      setError('Unable to update task status.')
    }
  }

  if (loading) {
    return <section className="page-shell">Loading project...</section>
  }

  if (!project) {
    return <section className="page-shell">Project not found.</section>
  }

  return (
    <section className="page-shell project-detail-page">
      <div className="page-heading">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <span>{tasks.length} tasks · {overdueCount} overdue</span>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="section-card project-detail-grid">
        <div className="project-detail-column">
          <h2>Add a task</h2>
          <form onSubmit={handleCreate}>
            <label>
              Task title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
              Description
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </label>
            <label>
              Due date
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </label>
            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="button">Create task</button>
          </form>
        </div>

        <div className="project-detail-column">
          <h2>Task list</h2>
          {tasks.length === 0 ? (
            <p>No tasks added yet.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-card task-card-small">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task._id!, e.target.value as TaskStatus)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <span className="badge">{task.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
