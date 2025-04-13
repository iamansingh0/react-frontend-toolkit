import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addHabit } from '../store/habit-slice';
import toast from 'react-hot-toast';

const recommendations = [
    "Wake Up at 6 AM | Daily",
    "Learn New Word | Daily",
    "Backup Files | Weekly",
    "Write Journal | Daily",
    "Clean Room | Weekly"
];

const AddHabitForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (name.trim()) {
                dispatch(addHabit({
                    name,
                    frequency
                }));
                setName("");
            }
            toast.success('Habit created', {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                }
            })
        } catch (error) {
            console.log(error)
            toast.error(`Habit could not be created`, {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                }
            })
        }
    }

    const toggleFormVisibility = () => {
        setIsFormVisible(prev => !prev);
    };

    return (
        <Paper sx={{ pt: 3, pb: 1, px: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }} onClick={toggleFormVisibility}>
                Create a New Habit
            </Typography>
            {isFormVisible && <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: ['column', 'row'],
                    gap: 2,
                    mb: 2
                }}>
                    <TextField
                        label="Habit Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What habit would you like to track?"
                        fullWidth
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                        onFocus={() => setShowRecommendations(true)}
                        onBlur={() => setShowRecommendations(false)}
                    />
                    {showRecommendations && (
                        <Box
                            sx={{
                                mt: 8,
                                p: 2,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                backgroundColor: '#f9f9f9',
                                boxShadow: 1,
                                position: 'absolute', // Position it below the text field
                                zIndex: 2,
                                width: '60%',
                                
                            }}
                        >
                            {recommendations.map((rec, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        padding: 1,
                                        borderRadius: 1,
                                        '&:hover': {
                                            backgroundColor: '#e0f7fa', 
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={() => {
                                        console.log('he')
                                    }}
                                >
                                    {rec}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                            value={frequency}
                            label="Frequency"
                            onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            height: 56,
                            px: 3,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Add Habit
                    </Button>
                </Box>
            </form>}
        </Paper>
    )
}

export default AddHabitForm