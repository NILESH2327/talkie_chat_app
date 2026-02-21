import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getUsers = createAsyncThunk("chat/getUsers", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/message/users");
    return res.data.users;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load users");
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to load users"
    );
  }
});

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const { chat } = thunkAPI.getState();

      const res = await axiosInstance.post(
        `/message/send/${chat.selectedUser._id}`,
        messageData
      );

      // ✅ return only actual message object
      return res.data.message;
    } catch (error) {
      toast.error(error.response?.data?.message || "Message send failed");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Message send failed"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/message/${messageId}`);
      return res.data.deletedMessageId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete failed"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    pushNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // USERS
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })

      // MESSAGES
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })

      // SEND MESSAGE
      .addCase(sendMessage.fulfilled, (state, action) => {
        // ✅ action.payload is the message object
        state.messages.push(action.payload);
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
         state.messages = state.messages.filter(
          (msg) => msg._id !== action.payload
         );
      });
  },
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;

export default chatSlice.reducer;