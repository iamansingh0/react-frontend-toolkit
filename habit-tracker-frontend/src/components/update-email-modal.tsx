import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  TextField,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Modal from './modal';
import { AppDispatch, RootState } from '../store/store';
import { updateEmail } from '../store/auth-slice';
import toast from 'react-hot-toast';

interface UpdateEmailModalProps {
  open: boolean;
  onClose: () => void;
}

const UpdateEmailModal: React.FC<UpdateEmailModalProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    setEmailError(validateEmail(value));
    
    // Check if the new email is same as current
    if (user?.email === value) {
      setEmailError('New email must be different from your current email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidationError = validateEmail(newEmail);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    if (user?.email === newEmail) {
      setEmailError('New email must be different from your current email');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password', {
        style: {
            fontFamily: 'sans-serif',
            fontSize: '1rem'
        }
    });
      return;
    }
    
    try {
      const result = await dispatch(updateEmail({
        password,
        newEmail
      })).unwrap();
      
      toast.success(result.message || 'Email updated successfully', {
        style: {
            fontFamily: 'sans-serif',
            fontSize: '1rem'
        }
    });
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      // Error is handled in the reducer
    }
  };

  const resetForm = () => {
    setPassword('');
    setNewEmail('');
    setEmailError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Email Address"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Update Email'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {user?.email && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current email: {user.email}
          </Typography>
        )}
        
        <TextField
          autoFocus
          margin="normal"
          required
          fullWidth
          id="newEmail"
          label="New Email Address"
          name="newEmail"
          autoComplete="email"
          value={newEmail}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Confirm with Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
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
      </Box>
    </Modal>
  );
};

export default UpdateEmailModal;