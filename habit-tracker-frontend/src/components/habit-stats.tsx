import React, { useEffect } from 'react'
import { AppDispatch, RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits, Habit } from '../store/habit-slice';
import { LinearProgress, Paper, Typography, Grid } from '@mui/material';
import { getStreak } from '../utils/utils';

interface HabitStatsProps {
  habits: Habit[];
}

const HabitStats: React.FC<HabitStatsProps> = ({ habits }) => {
  const { isLoading, error } = useSelector((state: RootState) => state.habits);
  const dispatch = useDispatch<AppDispatch>();

  const getCompletedToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return habits.filter((h) => h.completedDates.includes(today)).length;
  }

  const getLongestStreak = () => {
    return Math.max(...habits.map(getStreak), 0)
  }

  useEffect(() => {
    dispatch(fetchHabits());
  }, [])

  if (isLoading) {
    return <LinearProgress />
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2, mb: 8 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            {habits.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Habits
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            {getCompletedToday()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed Today
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h4" color="secondary.main" gutterBottom>
            {getLongestStreak()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Longest Streak
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default HabitStats