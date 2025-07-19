import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;

      await updateProfile(currentUser, { displayName: name });
      await currentUser.reload();

      await setDoc(doc(db, "users", currentUser.uid), {
        username: name,
        email: currentUser.email,
      });

      dispatch(
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-blue-100 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-700 mb-6 text-center">
        Welcome to Fitness Buddy 💪
      </h1>
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Create your account and start your fitness journey!
        </p>

        {error && (
          <p className="text-red-500 text-center font-semibold mb-4 text-sm sm:text-base">
            {error}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-3 sm:gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-md transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-700 mt-4 sm:mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
