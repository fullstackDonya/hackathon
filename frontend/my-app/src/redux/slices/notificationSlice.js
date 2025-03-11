import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        list: [],
    },
    reducers: {
        addNotification: (state, action) => {
            state.list.push(action.payload);
        },
        markAsRead: (state, action) => {
            const notification = state.list.find(n => n._id === action.payload);
            if (notification) {
                notification.read = true;
            }
        },
        markAllAsRead: (state) => {
            state.list.forEach(notification => {
                notification.read = true;
            });
        },
    },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;