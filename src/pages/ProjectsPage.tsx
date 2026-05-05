import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createProject, fetchProjects } from '../services/project'
import type { Project } from '../types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const projectList = await fetchProjects()
        setProjects(projectList)
      } catch (err) {
        setError('Unable to load projects. Check backend connectivity.')
      }
    }
    load()
  }, [])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      const created = await createProject({ name, description })
      setProjects((current) => [created, ...current])
      setName('')
      setDescription('')
    } catch (err) {
      setError('Unable to create project. Please try again.')
    }
  }

  return (
    <section className="page-shell projects-page">
      <div className="page-heading">
        <div>
          <h1>Projects</h1>
          <p>Create and manage teams with clear ownership and deliveries.</p>
        </div>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <div className="section-card project-form-card">
        <h2>Create new project</h2>
        <form onSubmit={handleCreate}>
          <label>
            Project name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
          </label>
          <button type="submit" className="button">Create project</button>
        </form>
      </div>

      <div className="section-card">
        <h2>Your projects</h2>
        {projects.length === 0 ? (
          <p>No projects found. Create one to get started.</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="project-card">
                <strong>{project.name}</strong>
                <p>{project.description}</p>
                <span>{project.members?.length ?? 0} team members</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
