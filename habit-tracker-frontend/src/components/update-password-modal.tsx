import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Modal from './modal';
import { AppDispatch, RootState } from '../store/store';
import { updatePassword } from '../store/auth-slice';
import toast from 'react-hot-toast';

interface UpdatePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    } else if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(validatePassword(value));
    
    if (confirmPassword && value !== confirmPassword) {
      setConfirmError('Passwords do not match');
    } else if (confirmPassword) {
      setConfirmError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (newPassword !== value) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }
    
    try {
      const result = await dispatch(updatePassword({
        currentPassword,
        newPassword
      })).unwrap();
      
      toast.success(result.message || 'Password updated successfully', {
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
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setConfirmError('');
    setPasswordError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Password"
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
            {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          autoFocus
          margin="normal"
          required
          fullWidth
          name="currentPassword"
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle current password visibility"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          id="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={!!passwordError}
          helperText={passwordError || 'Password must be at least 6 characters and contain at least one number'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!confirmError}
          helperText={confirmError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

export default UpdatePasswordModal;