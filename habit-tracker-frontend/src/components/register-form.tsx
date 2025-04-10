import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import toast from "react-hot-toast";
import { register } from "../store/auth-slice";
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";

const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!name || !email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
      
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      
      try {
        await dispatch(register({ name, email, password })).unwrap();
        toast.success('Registration successful! Please log in.', {
          style: {
              fontFamily: 'sans-serif',
              fontSize: '1rem'
          }
      });
        onSuccess();
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
            Register
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  };
  
  export default RegisterForm;