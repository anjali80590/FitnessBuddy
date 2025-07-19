import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, logoutUser } from "./redux/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Messages from "./pages/Messages";
import ShareProgress from "./pages/ShareProgress";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "User",
          })
        );
      } else {
        dispatch(logoutUser());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/share");

  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-900 dark:text-white">
      {user && !isAuthPage && (
        <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      )}
      <div className={`flex h-full ${isAuthPage ? "pt-0" : "pt-16"}`}>
        {user && !isAuthPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
          />
        )}
        <main
          className={`transition-all duration-300 ${
            isAuthPage
              ? "w-full h-full flex items-center justify-center"
              : "flex-1 " + (user ? "md:ml-64 overflow-y-auto" : "")
          }`}
        >
          <Routes>
            <Route path="/share/:id" element={<ShareProgress />} />
            <Route
              path="/"
              element={
                !user ? (
                  <Navigate to="/register" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            />
            {user && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/messages" element={<Messages />} />
              </>
            )}
            <Route
              path="*"
              element={<p className="text-center mt-10">Page Not Found</p>}
            />
          </Routes>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
