import './App.css'
import { Provider } from 'react-redux'
import store from './store/store'
import { Container, Typography } from '@mui/material'
import AddHabitForm from './components/add-habit-form'
import HabitList from './components/habit-list'
import HabitStats from './components/habit-stats'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast'


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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Toaster position='top-right' />
        <Container maxWidth="md">
          <Typography component='h1' variant='h2' align='center'>Habit Tracker</Typography>
          <AddHabitForm />
          <HabitList />
          <HabitStats />
        </Container>
      </Provider>
    </ThemeProvider>
  )
}

export default App
