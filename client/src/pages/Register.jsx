import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthImagePattern from "../components/AuthImagePattern";
import { signup } from "../store/slices/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isSigningUp } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    dispatch(signup(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-24 pb-20 px-4">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center p-12">
          <div className="w-full max-w-md">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Talkie
                </h1>
                <p className="text-sm text-gray-500">
                  Create your account 🚀
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Sign up
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

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
                  disabled={isSigningUp}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {isSigningUp && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {isSigningUp ? "Creating..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">
          <AuthImagePattern
            title="Join Talkie ✨"
            subtitle="Create an account and start chatting instantly."
          />
        </div>

      </div>
    </div>
  );
};

export default Register;