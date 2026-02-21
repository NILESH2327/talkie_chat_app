import { Camera, Loader2, Mail, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateProfile } from "../store/slices/authSlice";

const Profile = () => {
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    avatar: authUser?.avatar?.url || "",
  });

  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);

      // avatar file store for backend
      setFormData((prev) => ({ ...prev, avatar: file }));
    };
  };

  const handleUpdateProfile = () => {
    const data = new FormData();

    data.append("fullName", formData.fullName);
    data.append("email", formData.email);

    // only append if avatar is file
    if (formData.avatar instanceof File) {
      data.append("avatar", formData.avatar);
    }

    dispatch(updateProfile(data));
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="mt-2 text-gray-500">Your Profile information</p>
          </div>

          {/* AVATAR UPLOAD */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImage ||
                  (typeof formData.avatar === "string" ? formData.avatar : null) ||
                  "/avatar-holder.avif"
                }
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover object-top border-4 border-gray-200"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-gray-800 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <p className="text-sm text-gray-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to upload your photo"}
            </p>
          </div>

          {/* INPUTS */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </div>

              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 w-full focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </div>

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 w-full focus:outline-none"
              />
            </div>

            {/* UPDATE PROFILE BUTTON (screenshot wala) */}
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Update Profile"
              )}
            </button>

            {/* ACCOUNT INFO (screenshot wala) */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Account Information
              </h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>Member Since</span>
                  <span>
                    {authUser?.createdAt
                      ? authUser.createdAt.split("T")[0]
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* END */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;