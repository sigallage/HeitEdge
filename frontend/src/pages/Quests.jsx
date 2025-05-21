import { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await api.get('/api/quests');
        setQuests(response.data);
      } catch (error) {
        console.error('Error fetching quests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Heritage Quests
      </Typography>
      
      <Grid container spacing={3}>
        {quests.map((quest) => (
          <Grid item xs={12} sm={6} md={4} key={quest._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5">
                  {quest.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {quest.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={quest.theme} size="small" sx={{ mr: 1 }} />
                  <Chip label={quest.difficulty} size="small" color="secondary" />
                </Box>
                <Typography variant="body2">
                  Duration: ~{quest.estimatedDuration} hours
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/quests/${quest._id}`}
                >
                  View Quest
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}