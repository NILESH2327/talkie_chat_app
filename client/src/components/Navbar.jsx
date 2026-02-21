import { LogOut, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Talkie</h1>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {!authUser ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// import { LogOut, MessageSquare, User, Settings } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../store/slices/authSlice";

// const Navbar = () => {
//   const { authUser } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b shadow-sm">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">

//           {/* LOGO */}
//           <div className="flex items-center gap-8">
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
//               <MessageSquare className="w-5 h-5 text-blue-600" />
//             </div>
//             <h1 className="text-xl font-bold text-gray-800">Talkie</h1>
//           </Link>
//           </div>

//           {/* right NAV ACTIONS */}
//           <div className="flex items-center gap-8">
//           {authUser && (
//             <div className="flex items-center gap-4">
//               <Link
//                 to="/profile"
//                 className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
//               >
//                 <User className="w-4 h-4" />
//                 Profile
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-1 text-red-600 hover:text-red-100 transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
