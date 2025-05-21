import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Button, 
  Card, 
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { CheckCircle, LocationOn, HelpOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function QuestProgress({ questId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(null);
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestData = async () => {
      try {
        const [questRes, progressRes] = await Promise.all([
          api.get(`/api/quests/${questId}`),
          api.get(`/api/user/quests/${questId}/progress`)
        ]);
        
        setQuest(questRes.data);
        setProgress(progressRes.data);
        
        // Find the first incomplete step
        const firstIncomplete = questRes.data.stops.findIndex(
          stop => !progressRes.data.completedStops.some(s => s.stopId.toString() === stop._id.toString())
        );
        setActiveStep(firstIncomplete >= 0 ? firstIncomplete : 0);
        
      } catch (error) {
        console.error('Error fetching quest data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestData();
  }, [questId]);

  const handleCompleteStep = async (stopId) => {
    try {
      const response = await api.post(`/api/user/quests/${questId}/complete-stop`, { stopId });
      setProgress(response.data);
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  if (loading) return <Typography>Loading quest...</Typography>;
  if (!quest || !progress) return <Typography>Quest not found</Typography>;

  const completionPercentage = Math.round(
    (progress.completedStops.length / quest.stops.length) * 100
  );

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {quest.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {quest.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Progress: {completionPercentage}% complete
            </Typography>
            <Box sx={{ 
              height: 8, 
              width: '100%', 
              bgcolor: 'divider', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  height: '100%', 
                  bgcolor: 'primary.main', 
                  width: `${completionPercentage}%`,
                  transition: 'width 0.5s ease'
                }} 
              />
            </Box>
          </Box>
          
          <Chip 
            label={`${progress.totalPointsEarned} pts`} 
            color="secondary" 
            size="small" 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {quest.stops.map((stop, index) => {
            const isCompleted = progress.completedStops.some(
              s => s.stopId.toString() === stop._id.toString()
            );
            
            return (
              <Step key={stop._id} completed={isCompleted}>
                <StepLabel 
                  optional={
                    isCompleted && (
                      <Typography variant="caption">
                        Completed on {new Date(
                          progress.completedStops.find(s => s.stopId.toString() === stop._id.toString()).completedAt
                        ).toLocaleDateString()}
                      </Typography>
                    )
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isCompleted ? (
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                    ) : (
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                    )}
                    <Typography>
                      {stop.order}. {stop.site.name}
                    </Typography>
                  </Box>
                </StepLabel>
                <StepContent>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stepVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="body2" paragraph>
                      {stop.storyUnlocked}
                    </Typography>
                    
                    {stop.challenge && (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'background.default', 
                        borderRadius: 1,
                        mb: 2
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
                          <HelpOutline sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Challenge Question
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {stop.challenge.question}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {stop.challenge.options.map((option, i) => (
                            <Button
                              key={i}
                              variant="outlined"
                              size="small"
                              onClick={() => handleCompleteStep(stop._id)}
                              disabled={isCompleted}
                            >
                              {option}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {!isCompleted && !stop.challenge && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCompleteStep(stop._id)}
                        sx={{ mt: 1 }}
                      >
                        Mark as Visited
                      </Button>
                    )}
                  </motion.div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </CardContent>
    </Card>
  );
}