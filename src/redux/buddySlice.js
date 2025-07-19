import { createSlice } from "@reduxjs/toolkit";

const buddySlice = createSlice({
  name: "buddies",
  initialState: {
    list: [
      { id: 1, name: "Alex", location: "Delhi", goal: "Weight Loss" },
      { id: 2, name: "Priya", location: "Delhi", goal: "Muscle Gain" },
      { id: 3, name: "Rahul", location: "Mumbai", goal: "Endurance" },
    ],
    selectedBuddy: null,
    messages: {},
  },
  reducers: {
    selectBuddy: (state, action) => {
      state.selectedBuddy = action.payload;
      if (!state.messages[action.payload.id]) {
        state.messages[action.payload.id] = [];
      }
    },
    sendMessage: (state, action) => {
      const { buddyId, message } = action.payload;
      if (!state.messages[buddyId]) {
        state.messages[buddyId] = [];
      }
      state.messages[buddyId].push({ text: message, sender: "You" });
    },
  },
});

export const { selectBuddy, sendMessage } = buddySlice.actions;
export default buddySlice.reducer;
