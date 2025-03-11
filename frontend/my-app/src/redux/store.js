// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers"; // Assure-toi que ton réducteur est correctement configuré

const store = configureStore({
  reducer: rootReducer,
});

export default store;
