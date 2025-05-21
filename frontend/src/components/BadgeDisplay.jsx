import { Box, Typography, Grid, Tooltip, Zoom, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function BadgeDisplay({ badges }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Achievements
      </Typography>
      
      {badges.length === 0 ? (
        <Typography color="text.secondary">No badges earned yet</Typography>
      ) : (
        <Grid container spacing={2}>
          {badges.map((badge) => (
            <Grid item xs={6} sm={4} md={3} key={badge._id}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={badgeVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Tooltip 
                  title={
                    <Box>
                      <Typography variant="subtitle2">{badge.badge.name}</Typography>
                      <Typography variant="caption">{badge.badge.description}</Typography>
                      <Typography variant="caption" display="block">
                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  TransitionComponent={Zoom}
                  arrow
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    border: badge.isEquipped ? '2px solid gold' : '1px solid #ddd',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    cursor: 'pointer'
                  }}>
                    <Avatar 
                      src={badge.badge.icon} 
                      sx={{ 
                        width: 64, 
                        height: 64,
                        mb: 1,
                        filter: badge.isEquipped ? 'drop-shadow(0 0 8px gold)' : 'none'
                      }} 
                    />
                    <Typography variant="caption" textAlign="center">
                      {badge.badge.name}
                    </Typography>
                  </Box>
                </Tooltip>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}