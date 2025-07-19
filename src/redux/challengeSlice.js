import { createSlice } from "@reduxjs/toolkit";

const storedChallenges = localStorage.getItem("challenges")
  ? JSON.parse(localStorage.getItem("challenges"))
  : [];

const challengeSlice = createSlice({
  name: "challenges",
  initialState: { list: storedChallenges },
  reducers: {
    addChallenge: (state, action) => {
      state.list.push(action.payload);
      localStorage.setItem("challenges", JSON.stringify(state.list));
    },
    updateProgress: (state, action) => {
      const { id, amount, status } = action.payload;
      const challenge = state.list.find((c) => c.id === id);
      if (challenge) {
        challenge.progress += amount;
        if (challenge.progress > challenge.goal) {
          challenge.progress = challenge.goal;
        }
        challenge.status =
          status ||
          (challenge.progress >= challenge.goal
            ? "Completed"
            : challenge.progress > 0
            ? "In Progress"
            : "Not Started");
      }
      localStorage.setItem("challenges", JSON.stringify(state.list));
    },
    deleteChallenge: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
      localStorage.setItem("challenges", JSON.stringify(state.list));
    },
    editChallenge: (state, action) => {
      const index = state.list.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
      localStorage.setItem("challenges", JSON.stringify(state.list));
    },
  },
});

export const { addChallenge, updateProgress, deleteChallenge, editChallenge } =
  challengeSlice.actions;

export default challengeSlice.reducer;