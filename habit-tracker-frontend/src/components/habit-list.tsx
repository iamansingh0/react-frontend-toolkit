import { Box, Button, CardActions, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material'
import { AppDispatch, RootState } from '../store/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, CheckCircle, CircleOutlined, Delete, SentimentDissatisfied } from '@mui/icons-material'
import { Habit, toggleHabit, removeHabit } from '../store/habit-slice'
import toast from 'react-hot-toast';
import HabitStats from './habit-stats'

const HabitList: React.FC = () => {
    const { habits } = useSelector((state: RootState) => state.habits);
    const dispatch = useDispatch<AppDispatch>();
    // const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");

    const today = new Date().toISOString().split("T")[0];

    const onToggleHabit = (habit: Habit) => {
        dispatch(toggleHabit({
            id: habit.id,
            date: today
        }))
    }

    // const filterHabits = () => { }

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

    const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
        console.log(event.target.value);
    };

    const filteredHabits = habits.filter(habit => {
        if (filter === "all") return true; 
        return habit.frequency === filter;
    });

    if (filteredHabits.length === 0) {
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
            <FormControl fullWidth>
                <InputLabel id="filter">Filter</InputLabel>
                <Select
                    labelId="filter"
                    value={filter}
                    label="Filter"
                    onChange={handleChange}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
            </FormControl>
            {filteredHabits.map((habit) => {
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
            <HabitStats habits={filteredHabits}/>
        </Box>
    )
}

export default HabitList