import { Check, CheckCircle, CircleOutlined, Close, Delete } from '@mui/icons-material';
import { Box, Button, CardActions, Grid, LinearProgress, Paper, Tooltip, Typography } from '@mui/material';
import { formatWeekDisplay, getStreak, wasWeekCompleted } from '../utils/utils';
import { Habit, removeHabit, toggleHabit } from '../store/habit-slice';
import React from 'react';
import { AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

interface HabitCardProps {
    habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
    const dispatch = useDispatch<AppDispatch>();

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

    const generateHabitData = (habit: Habit) => {
        const today = new Date();
        const habitData = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split("T")[0];
            const completed = habit.completedDates.includes(dateString);

            habitData.push({
                date: dateString,
                completed: completed
            });
        }
        return habitData;
    }

    const onHabitClick = (habit: Habit) => {
        const habitData = generateHabitData(habit);
        console.log(habitData);
    }

    const today = new Date().toISOString().split("T")[0];

    const streakUnit = habit.frequency === "daily" ? "days" : "weeks";

    const isToday = (dateStr: string): boolean => {
        return dateStr === today;
    };

    return (
        <Paper elevation={0} sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
            }
        }}
            key={habit.id}
        >
            <Grid container alignItems="center" >
                <Grid size={{ xs: 12, sm: 6 }} onClick={() => {
                    onHabitClick(habit);
                }} sx={{ cursor: "pointer" }}>
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
                                {habit.frequency === "daily" ? (
                                    // Daily habit view - show last 7 days
                                    [...Array(7)].map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() - i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isCompleted = habit.completedDates.includes(dateStr);
                                        // const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                        const dayIsToday = isToday(dateStr);

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
                                                    {isCompleted ? (
                                                        <Check sx={{ color: 'white', fontSize: 16 }} />
                                                    ) : (
                                                        dayIsToday ? null : <Close sx={{ color: '#d32f2f', fontSize: 16 }} />
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        );
                                    })
                                ) : (
                                    // Weekly habit view - show last 7 weeks
                                    [...Array(7)].map((_, i) => {
                                        const todayDate = new Date();
                                        // Find the start of the current week (Sunday)
                                        const currentDay = todayDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
                                        const sundayOfCurrentWeek = new Date(todayDate);
                                        sundayOfCurrentWeek.setDate(todayDate.getDate() - currentDay);

                                        // Calculate the start of the week we're looking at
                                        const weekStart = new Date(sundayOfCurrentWeek);
                                        weekStart.setDate(sundayOfCurrentWeek.getDate() - (7 * i));

                                        const isCompleted = wasWeekCompleted(habit, weekStart);
                                        const weekDisplay = formatWeekDisplay(weekStart);
                                        const isCurrentWeek = i === 0;

                                        return (
                                            <Tooltip title={weekDisplay} key={i}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 1,
                                                        bgcolor: isCompleted ? 'success.main' : 'grey.200',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {isCompleted ? (
                                                        <Check sx={{ color: 'white', fontSize: 16 }} />
                                                    ) : (
                                                        isCurrentWeek ? null : <Close sx={{ color: '#d32f2f', fontSize: 16 }} />
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        );
                                    })
                                )}
                            </Box>
                        </CardActions>

                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Typography variant='body2'>
                    Current Streak: {getStreak(habit)} {streakUnit}
                </Typography>
                <LinearProgress
                    variant='determinate'
                    value={(getStreak(habit) / 30) * 100}
                    sx={{ mt: 1 }}
                />
            </Box>
        </Paper>
    )
}

export default HabitCard