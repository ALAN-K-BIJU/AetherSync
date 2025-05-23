// src/pages/Home.tsx
import React from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const features = [
  {
    title: 'Local-first Storage',
    description:
      'Your memories are stored securely on your device by default.',
  },
  {
    title: 'End-to-End Encryption',
    description:
      'Only you and your family can access your data — no third party involved.',
  },
  {
    title: 'AI-Powered Memory Curation',
    description:
      'Auto-group memories by faces, voices, and events using on-device AI.',
  },
  {
    title: 'Optional IPFS Sync',
    description:
      'Enable decentralized, peer-to-peer backup of your vaults.',
  },
]

const Home: React.FC = () => {
  const theme = useTheme()

  return (
    <Container>
      <Box
        my={6}
        textAlign="center"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography
  variant="h3"
  gutterBottom
  sx={{
    fontWeight: 'bold',
    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
    fontFamily: '"Orbitron", sans-serif',
    background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: 1.5,
    mb: 2,
  }}
  component={motion.h1}
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
          Welcome to AetherSync
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Your decentralized, private, AI-enhanced memory vault.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, i) => (
          <Grid
            item
            key={i}
            xs={12}
            sm={6}
            md={3}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              style={{ width: '100%', maxWidth: 280 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  background: theme.palette.mode === 'dark'
                    ? '#1e1e2f'
                    : '#fafafa',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    color: theme.palette.primary.main,
                    textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home
