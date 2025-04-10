import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";
import { fetchHabits } from "../store/habit-slice";
import Header from "../components/header";
import { Container } from "@mui/material";
import AddHabitForm from "../components/add-habit-form";
import HabitList from "../components/habit-list";
import HabitStats from "../components/habit-stats";


const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);
  
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <AddHabitForm />
        <HabitList />
        <HabitStats />
      </Container>
    </>
  );
};

export default HomePage;