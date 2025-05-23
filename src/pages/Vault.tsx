import React, { useState } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material'

type MemoryItem = {
  id: number
  title: string
  type: 'image' | 'video'
  src: string
  description: string
}

const dummyMemories: MemoryItem[] = [
  {
    id: 1,
    title: 'Family Vacation 2020',
    type: 'image',
    src: 'https://picsum.photos/seed/family2020/800/600',
    description: 'A beautiful day at the beach with the family.',
  },
  {
    id: 2,
    title: 'Grandpa’s Story',
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'A recorded story from Grandpa in 2018.',
  },
]

const Vault: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<MemoryItem | null>(null)

  const handleOpen = (item: MemoryItem) => {
    setSelected(item)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelected(null)
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Vault</Typography>
      <Grid container spacing={3}>
        {dummyMemories.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleOpen(item)}>
              {item.type === 'image' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.src}
                  alt={item.title}
                />
              ) : (
                <CardMedia
                  component="video"
                  height="200"
                  controls
                  src={item.src}
                />
              )}
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{selected?.title}</DialogTitle>
        <DialogContent>
          {selected?.type === 'image' ? (
            <img src={selected.src} alt={selected.title} style={{ width: '100%' }} />
          ) : (
            <video controls style={{ width: '100%' }}>
              <source src={selected?.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Typography mt={2}>{selected?.description}</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default Vault
