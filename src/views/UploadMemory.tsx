import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

export default function UploadMemory() {
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return

    const arrayBuffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    await invoke('add_memory', {
      title,
      tags,
      mediaData: base64,
      filename: file.name,
      mediaType: file.type,
    })

    alert('Memory uploaded')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Upload Memory</h1>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="block w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="file"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Upload
      </button>
    </div>
  )
}
