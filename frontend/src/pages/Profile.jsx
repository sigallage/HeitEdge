import { useEffect, useState } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import { Box, Typography, Avatar, Tabs, Tab, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import BadgeDisplay from '../components/BadgeDisplay';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [badges, setBadges] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get user profile
        const profileRes = await api.get('/api/me');
        setProfile(profileRes.data);
        
        // Get user quests
        const questsRes = await api.get('/api/user/quests');
        setActiveQuests(questsRes.data.filter(q => !q.isCompleted));
        setCompletedQuests(questsRes.data.filter(q => q.isCompleted));
        
        // Get user badges
        const badgesRes = await api.get('/api/user/badges');
        setBadges(badgesRes.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    if (authUser) fetchProfileData();
  }, [authUser]);

  if (!profile) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={profile.profilePicture}
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h4">{profile.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>
      </Box>
      
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Active Quests" />
        <Tab label="Completed Quests" />
        <Tab label="Badges" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {activeQuests.map((quest) => (
            <Grid item xs={12} key={quest._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{quest.quest.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {quest.quest.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(quest.completedStops.length / quest.quest.stops.length) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="caption">
                    {quest.completedStops.length} of {quest.quest.stops.length} stops completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {completedQuests.map((quest) => (
            <Grid item xs={12} sm={6} key={quest._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{quest.quest.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed on {new Date(quest.completedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Earned {quest.totalPointsEarned} points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <BadgeDisplay badges={badges} />
      </TabPanel>
    </Box>
  );
}