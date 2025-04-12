import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { login } from '../store/auth-slice';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const dispatch = useDispatch<AppDispatch>();

    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        } else if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
        }

        if (!email || !password) {
            toast.error('Please fill in all fields', {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                }
            });
            return;
        }

        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success('Login successful!', {
                style: {
                    fontFamily: 'sans-serif',
                    fontSize: '1rem'
                }
            });
        } catch (err) {
            // Error is handled in the reducer and displayed below
            console.log(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 4
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Login
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default LoginForm