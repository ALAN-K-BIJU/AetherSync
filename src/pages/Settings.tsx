import React, { useState } from 'react'
import {
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Avatar,
  TextField,
  MenuItem,
  Box,
  Divider,
} from '@mui/material'
import { useColorMode } from '../theme/ThemeContent'

const Settings: React.FC = () => {
  const { mode, toggleMode } = useColorMode() // 🔁 Use context for dark mode
  const [language, setLanguage] = useState('en')
  const [syncEnabled, setSyncEnabled] = useState(false)  // moved inside component
  const [ipfsGateway, setIpfsGateway] = useState('https://ipfs.io')  // moved inside component

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value)
    // 🌐 Future: Save to localStorage or user profile
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <Avatar sx={{ width: 64, height: 64 }} src="https://i.pravatar.cc/300?u=user123" />
          <Box flexGrow={1}>
            <TextField fullWidth label="Name" value="Alan K Biju" disabled sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" value="alan@example.com" disabled />
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>

        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
          label="Dark Mode"
          sx={{ mt: 2 }}
        />

        <TextField
          select
          label="Language"
          value={language}
          onChange={handleLanguageChange}
          fullWidth
          sx={{ mt: 3 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="hi">Hindi</MenuItem>
          <MenuItem value="fr">French</MenuItem>
        </TextField>
      </Paper>

      {/* Sync Options section - placed inside the return JSX */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Sync Options</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={syncEnabled}
              onChange={() => setSyncEnabled(!syncEnabled)}
            />
          }
          label="Enable IPFS Sync"
          sx={{ mt: 2 }}
        />
        {syncEnabled && (
          <TextField
            label="IPFS Gateway URL"
            value={ipfsGateway}
            onChange={(e) => setIpfsGateway(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            helperText="Example: https://ipfs.io or your custom gateway"
          />
        )}
      </Paper>

      <Divider />

      <Typography variant="body2" align="center" mt={4} color="text.secondary">
        AetherSync v0.1 — Privacy-first Memory Vault
      </Typography>
    </Container>
  )
}

export default Settings
