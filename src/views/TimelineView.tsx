import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Link } from 'react-router-dom'

export default function TimelineView() {
  const [memories, setMemories] = useState([])

  useEffect(() => {
    invoke('list_memories').then((data: any) => {
      setMemories(data)
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Family Timeline</h1>
      <div className="grid gap-4">
        {memories.map((m: any) => (
          <Link
            to={`/view/${m.id}`}
            key={m.id}
            className="block bg-white p-4 rounded shadow hover:shadow-md transition-all border border-gray-200 hover:border-blue-400"
          >
            <h2 className="text-lg font-semibold">{m.title}</h2>
            <p className="text-sm text-gray-500">{m.created_at}</p>
            <p className="text-sm text-gray-700">Tags: {m.tags}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
