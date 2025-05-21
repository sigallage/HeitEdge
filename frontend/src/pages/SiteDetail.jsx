import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Divider } from '@mui/material';
import AudioPlayer from '../components/AudioPlayer';

export default function SiteDetail() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await api.get(`/api/sites/${id}`);
        setSite(response.data);
      } catch (error) {
        console.error('Error fetching site:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!site) return <Typography>Site not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        {site.name}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="body1" paragraph>
            {site.description}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" gutterBottom>
            Audio Stories
          </Typography>
          {site.audioStories?.length > 0 ? (
            site.audioStories.map((story) => (
              <AudioPlayer key={story._id} story={story} />
            ))
          ) : (
            <Typography>No audio stories available</Typography>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={site.images?.[0]?.url || '/placeholder.jpg'}
              alt={site.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Site Details
              </Typography>
              <Chip label={site.historicalPeriod} sx={{ mr: 1, mb: 1 }} />
              <Chip label={site.significance} sx={{ mr: 1, mb: 1 }} />
              {site.categories?.map((cat) => (
                <Chip key={cat} label={cat} sx={{ mr: 1, mb: 1 }} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}