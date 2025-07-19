import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiHome, FiTarget, FiMessageCircle, FiLogOut } from "react-icons/fi";

export default function Sidebar({ isOpen, closeSidebar }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/login");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/challenges", label: "Challenges", icon: <FiTarget /> },
    { path: "/messages", label: "Messages", icon: <FiMessageCircle /> },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`fixed top-16 left-0 w-64 bg-gray-100 dark:bg-gray-900 shadow-lg flex flex-col transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        h-[600px] sm:h-[400px] md:h-[calc(100vh-4rem)]`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
                    location.pathname === link.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-300 dark:border-gray-700 sticky bottom-0 bg-gray-100 dark:bg-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
