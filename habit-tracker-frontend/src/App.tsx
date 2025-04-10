import { createTheme, ThemeProvider } from '@mui/material';
import './App.css'
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/store';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import { Toaster } from 'react-hot-toast';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5D69E3', // A vibrant purple/blue
    },
    secondary: {
      main: '#53D769', // A fresh green for success states
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Root component to use Redux hooks
const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster position='top-right' />
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;