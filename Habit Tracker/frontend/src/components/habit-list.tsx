import { Box, Button, CardActions, Grid, LinearProgress, Paper, Tooltip, Typography } from '@mui/material'
import { AppDispatch, RootState } from '../store/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, CheckCircle, CircleOutlined, Delete, SentimentDissatisfied } from '@mui/icons-material'
import { Habit, toggleHabit, removeHabit } from '../store/habit-slice'
import toast from 'react-hot-toast'

const HabitList: React.FC = () => {
    const { habits } = useSelector((state: RootState) => state.habits);
    const dispatch = useDispatch<AppDispatch>();

    console.log(habits);

    const today = new Date().toISOString().split("T")[0];

    const onToggleHabit = (habit: Habit) => {
        dispatch(toggleHabit({
            id: habit.id,
            date: today
        }))
    }

    const onRemoveHabit = (habit: Habit) => {
        try {
            dispatch(removeHabit({
                id: habit.id
            }))
            toast.success('Habit removed', {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                },
                iconTheme: {
                    primary: '#F7374F',
                    secondary: '#fff'
                }
            })
        } catch (error) {
            toast.error(`Habit removed: ${error}`, {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                },
                
            })
        }
    }

    const getStreak = (habit: Habit) => {
        let streak = 0;
        const currentDate = new Date();
        while (true) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (habit.completedDates.includes(dateString)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else { break; }
        }

        return streak;
    }

    if (habits.length === 0) {
        return <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 4 }}>
            <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                No habits yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Get started by adding your first habit above.
            </Typography>
        </Paper>
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 4,
        }}>
            {habits.map((habit) => {
                return (
                    <Paper key={habit.id} elevation={0} sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
                        }
                    }}>
                        <Grid container alignItems="center">
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6'>{habit.name}</Typography>
                                <Typography variant='body2' color='textSecondary' sx={{
                                    textTransform: 'capitalize'
                                }}>
                                    {habit.frequency}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1
                                }}>
                                    {/* <Button
                                        variant="contained"
                                        color={habit.completedDates.includes(today) ? "success" : "primary"}
                                        startIcon={habit.completedDates.includes(today) ? <CheckCircle /> : <RadioButtonUnchecked />}
                                        onClick={() => onToggleHabit(habit)}
                                        sx={{
                                            borderRadius: 6,
                                            px: 3,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        {habit.completedDates.includes(today) ? "Completed" : "Mark Complete"}
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        startIcon={<Delete />}
                                        onClick={() => onRemoveHabit(habit)}
                                    >
                                        Remove
                                    </Button> */}
                                    <CardActions sx={{ justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color={habit.completedDates.includes(today) ? "success" : "primary"}
                                            startIcon={habit.completedDates.includes(today) ? <CheckCircle /> : <CircleOutlined />}
                                            onClick={() => onToggleHabit(habit)}
                                            size="small"
                                        >
                                            {habit.completedDates.includes(today) ? "Completed" : "Complete"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => onRemoveHabit(habit)}
                                            size="small"
                                        >
                                            Remove
                                        </Button>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        {[...Array(7)].map((_, i) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - i);
                                            const dateStr = date.toISOString().split('T')[0];
                                            const isCompleted = habit.completedDates.includes(dateStr);

                                            return (
                                                <Tooltip title={new Date(dateStr).toLocaleDateString()} key={dateStr}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            bgcolor: isCompleted ? 'success.main' : 'grey.200',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {isCompleted && <Check sx={{ color: 'white', fontSize: 16 }} />}
                                                    </Box>
                                                </Tooltip>
                                            );
                                        })}
                                    </Box>
                                    </CardActions>
                                    
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant='body2'>
                                Current Streak: {getStreak(habit)} days
                            </Typography>
                            <LinearProgress
                                variant='determinate'
                                value={(getStreak(habit) / 30) * 100}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Paper>
                )
            })}
        </Box>
    )
}

export default HabitList