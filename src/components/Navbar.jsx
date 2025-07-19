import { FiMenu } from "react-icons/fi";
import { Dumbbell } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useSelector } from "react-redux";

export default function Navbar({ toggleSidebar }) {
  const user = useSelector((state) => state.user.user);

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 md:px-6 py-3.5 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="flex items-center gap-4">
        <button
          className="text-2xl text-gray-700 dark:text-gray-200 md:hidden"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
        <div className="flex items-center gap-2">
          <Dumbbell className="w-7 h-7 text-blue-600" />
          <span className="hidden md:block text-xl md:text-2xl font-bold text-blue-600">
            FitnessBuddy
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 dark:text-gray-200 font-semibold truncate max-w-[120px]">
            Hi, {user.email.split("@")[0]}
          </span>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

