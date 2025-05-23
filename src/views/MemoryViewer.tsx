import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';
import { join } from '@tauri-apps/api/path';

export default function MemoryViewer() {
  const { id } = useParams();
  const [memory, setMemory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchMemory = async () => {
      try {
        const memoryData = await invoke('get_memory_by_id', { id });
        setMemory(memoryData);
        setError(null);
      } catch (err) {
        setError('Failed to load memory');
        console.error(err);
      }
    };

    fetchMemory();
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!memory) return <div className="p-4 text-gray-700">Loading...</div>;

  // Create a function to properly get the media URL
  const getMediaUrl = async () => {
    try {
      const mediaPath = await join('media_store', memory.filename);
      return convertFileSrc(mediaPath);
    } catch (err) {
      console.error('Error constructing media path:', err);
      return '';
    }
  };

  // Since we can't use await directly in the render, we'll use a state for the URL
  const [mediaUrl, setMediaUrl] = useState('');

  useEffect(() => {
    getMediaUrl().then(setMediaUrl);
  }, [memory]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{memory.title}</h1>
      <p className="text-sm text-gray-500">{memory.created_at}</p>
      <p className="mb-4 text-sm text-gray-700">Tags: {memory.tags}</p>

      {!mediaUrl ? (
        <div className="text-red-500">Media file not found</div>
      ) : memory.media_type.startsWith("image") ? (
        <img src={mediaUrl} alt="memory" className="max-w-full rounded" />
      ) : memory.media_type.startsWith("audio") ? (
        <audio controls src={mediaUrl} className="w-full" />
      ) : memory.media_type.startsWith("video") ? (
        <video controls src={mediaUrl} className="w-full rounded" />
      ) : (
        <div>Unsupported media type: {memory.media_type}</div>
      )}
    </div>
  );
}