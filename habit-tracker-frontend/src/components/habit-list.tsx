import { Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import { RootState } from '../store/store'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { SentimentDissatisfied } from '@mui/icons-material'
import HabitStats from './habit-stats'
import HabitCard from './habit'

const HabitList: React.FC = () => {
    const { habits } = useSelector((state: RootState) => state.habits);
    const [filter, setFilter] = useState("all");

    const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
        console.log(event.target.value);
    };

    const filteredHabits = habits.filter(habit => {
        if (filter === "all") return true;
        return habit.frequency === filter;
    });

    if (filteredHabits.length === 0) {
        return (
            <div>
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
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 4 }}>
                    <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No habits yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Get started by adding your first habit above.
                    </Typography>
                </Paper>
            </div>
        )
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
                    <HabitCard 
                        habit={habit}
                        key={habit.id}
                    />
                )
            })}
            <HabitStats habits={filteredHabits} />
        </Box>
    )
}

export default HabitList