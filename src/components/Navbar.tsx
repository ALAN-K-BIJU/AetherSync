import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AetherSync
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/vault">Vault</Button>
          <Button color="inherit" component={RouterLink} to="/upload">Upload</Button>
          <Button color="inherit" component={RouterLink} to="/settings">Settings</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
