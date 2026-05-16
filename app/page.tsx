'use client'

import { useEffect, useState } from 'react'
import { supabase, type Task } from '@/lib/supabase'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setTasks(data ?? [])
    setLoading(false)
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    const title = input.trim()
    if (!title) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setTasks((prev) => [data, ...prev])
      setInput('')
    }
  }

  async function toggleTask(task: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id)

    if (error) {
      setError(error.message)
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      )
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const done = tasks.filter((t) => t.completed).length

  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Задачи</h1>
      <p className="text-sm text-gray-400 mb-8">
        {done} / {tasks.length} выполнено
      </p>

      <form onSubmit={addTask} className="flex gap-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Новая задача..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Добавить
        </button>
      </form>

      {error && (
        <div className="mb-4 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-16 text-sm">Загрузка...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-sm">Нет задач. Добавь первую!</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 group"
            >
              <button
                onClick={() => toggleTask(task)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
                  task.completed
                    ? 'bg-green-400 border-green-400'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {task.completed && (
                  <svg viewBox="0 0 20 20" className="w-full h-full text-white" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <span
                className={`flex-1 text-sm ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
