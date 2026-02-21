import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getUser,
  setOnlineUsers,
} from "./store/slices/authSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { connectSocket, disconnectSocket } from "./lib/socket";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import { ToastContainer } from "react-toastify";

const App = () => {
  const { authUser, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  // ===============================
  // CHECK AUTH ON APP LOAD
  // ===============================
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);// getuser

  // ===============================
  // SOCKET CONNECTION
  // ===============================
  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      disconnectSocket();
    };
  }, [authUser?._id, dispatch]);

  // ===============================
  // LOADER WHILE CHECKING AUTH
  // ===============================
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            authUser ? <Home /> : <Navigate to="/login" replace />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !authUser ? <Login /> : <Navigate to="/" replace />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            !authUser ? <Register /> : <Navigate to="/" replace />
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            authUser ? <Profile /> : <Navigate to="/login" replace />
          }
        />
      </Routes>

      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;