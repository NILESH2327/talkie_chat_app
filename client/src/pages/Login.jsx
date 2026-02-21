import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthImagePattern from "../components/AuthImagePattern";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required");
    }
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-24 pb-20 px-4">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center p-12">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Talkie
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back 👋
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Sign in
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {isLoggingIn && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {isLoggingIn ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don’t have an account?{" "}
                <Link to="/register" className="text-indigo-600 font-semibold">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">
  <div className="h-[600px] w-full flex items-center justify-center">
          <AuthImagePattern
            title="Welcome Back!"
            subtitle="Sign in to continue chatting."
          />
        </div>
        </div>

      </div>
    </div>
  );
};

export default Login;