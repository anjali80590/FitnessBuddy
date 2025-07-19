
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import buddyReducer from "./buddySlice";
import workoutReducer from "./workoutSlice";
import challengeReducer from "./challengeSlice";


const loadState = () => {
  try {
    const serializedState = localStorage.getItem("fitnessState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error("Error loading state:", err);
    return undefined;
  }
};
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("fitnessState", serializedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    buddies: buddyReducer,
    workouts: workoutReducer,
    challenges: challengeReducer,
  },
  preloadedState: loadState(), 
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
