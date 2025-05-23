import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
} from '@mui/material'
import { motion } from 'framer-motion'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ShieldIcon from '@mui/icons-material/Shield'

const Upload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={4} alignItems="center" sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" fontWeight="bold" align="center">
          Secure File Upload
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{ px: 2 }}>
          Your files are encrypted and processed securely. Only you can access what you upload.
        </Typography>

        <Paper
          {...getRootProps()}
          elevation={4}
          sx={{
            width: '100%',
            p: 5,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.400',
            textAlign: 'center',
            backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.05)' : 'background.paper',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-block', marginBottom: 16 }}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main' }} />
          </motion.div>
          <Typography
            variant="body1"
            color={isDragActive ? 'primary' : 'text.secondary'}
            sx={{ fontWeight: 500 }}
          >
            {isDragActive
              ? 'Drop files to upload securely'
              : 'Drag & drop files here or click to select'}
          </Typography>
        </Paper>

        {files.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Files Ready to Upload
            </Typography>
            <ul>
              {files.map((file) => (
                <li key={file.name}>
                  {file.name} - {(file.size / 1024).toFixed(2)} KB
                </li>
              ))}
            </ul>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block', marginTop: 16 }}
            >
              <Button variant="contained" color="primary" size="large">
                Upload Files
              </Button>
            </motion.div>
          </Box>
        )}

        <Stack direction="row" spacing={1} alignItems="center" mt={3}>
          <ShieldIcon color="success" fontSize="small" />
          <Typography variant="caption" color="text.secondary">
            Encrypted & Private. No third-party access.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Upload
