import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Alert 
} from '@mui/material';

export default function ContributionForm() {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await api.post('/api/contributions', {
        ...data,
        relatedSite: id,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #eee', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Share Your Knowledge
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Thank you for your contribution! It will be reviewed by our team.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Contribution Type</InputLabel>
          <Select
            label="Contribution Type"
            {...register('type', { required: 'Type is required' })}
            error={!!errors.type}
          >
            <MenuItem value="Story">Story</MenuItem>
            <MenuItem value="Photo">Photo</MenuItem>
            <MenuItem value="Audio">Audio Recording</MenuItem>
            <MenuItem value="Fact">Historical Fact</MenuItem>
            <MenuItem value="Correction">Correction</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Title"
          sx={{ mb: 2 }}
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        
        <TextField
          fullWidth
          label="Content"
          multiline
          rows={4}
          sx={{ mb: 2 }}
          {...register('content', { required: 'Content is required' })}
          error={!!errors.content}
          helperText={errors.content?.message}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            label="Language"
            {...register('language', { required: 'Language is required' })}
            error={!!errors.language}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="si">Sinhala</MenuItem>
            <MenuItem value="ta">Tamil</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Contribution'}
        </Button>
      </form>
    </Box>
  );
}