import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      dispatch(setUser(user));
      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
      toast.error("Login failed ❌");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-green-100 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700 mb-6 text-center">
        Welcome Back 👋
      </h1>
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        {error && (
          <p className="text-red-500 text-center font-semibold mb-4 text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4 sm:mt-6 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
