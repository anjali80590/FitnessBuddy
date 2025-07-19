

import { createSlice } from "@reduxjs/toolkit";

const workoutSlice = createSlice({
  name: "workouts",
  initialState: [],
  reducers: {
    setWorkouts: (state, action) => {
      return action.payload; 
    },


    addWorkout: (state, action) => {
      state.push(action.payload);
    },

    deleteWorkout: (state, action) => {
      return state.filter((w) => w.id !== action.payload);
    },


    updateWorkout: (state, action) => {
      const index = state.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setWorkouts, addWorkout, deleteWorkout, updateWorkout } =
  workoutSlice.actions;
export default workoutSlice.reducer;
