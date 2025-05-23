import React from 'react'
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

interface MemoryCardProps {
  title: string
  description: string
  imageUrl?: string
  date?: string
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  title,
  description,
  imageUrl,
  date,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <Card
        elevation={4}
        sx={{
          maxWidth: 345,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom right, #f4f6f8, #e1e4e8)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            height="180"
            image={imageUrl}
            alt="memory preview"
            sx={{ objectFit: 'cover' }}
          />
        )}

        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              color: '#1a237e',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: '"Open Sans", sans-serif',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>

          {date && (
            <Box mt={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontStyle: 'italic',
                  fontFamily: 'monospace',
                }}
              >
                {date}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MemoryCard
