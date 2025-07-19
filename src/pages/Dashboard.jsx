import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "../redux/userSlice";
import { setWorkouts } from "../redux/workoutSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const workouts = useSelector((state) => state.workouts);

  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(65);
  const [weeklyGoal, setWeeklyGoal] = useState(150);
  const [workoutType, setWorkoutType] = useState("Running");
  const [duration, setDuration] = useState(30);
  const [editId, setEditId] = useState(null);

  const [bmi, setBmi] = useState(0);
  const [targetBmi, setTargetBmi] = useState(0);

  const totalDuration = workouts.reduce(
    (sum, w) => sum + (Number(w.duration) || 0),
    0
  );
  const goalProgress = Math.min((totalDuration / weeklyGoal) * 100, 100);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) dispatch(setUser(currentUser));
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    calculateBMI();
    if (user) {
      fetchUserProfile();
      listenToWorkouts();
    }
  }, [user]);

  const calculateBMI = () => {
    const h = height / 100;
    setBmi((weight / (h * h)).toFixed(2));
    setTargetBmi((targetWeight / (h * h)).toFixed(2));
  };

  const saveUserProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), {
      height: Number(height),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      weeklyGoal: Number(weeklyGoal),
    });
    calculateBMI();
    toast.success("Profile updated!", { theme: "colored" });
  };

  const fetchUserProfile = async () => {
    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      setHeight(data.height || 170);
      setWeight(data.weight || 70);
      setTargetWeight(data.targetWeight || 65);
      setWeeklyGoal(data.weeklyGoal || 150);
    }
  };

  const calculateCalories = (type, duration) => {
    const MET = type === "Running" ? 10 : type === "Cycling" ? 8 : 6;
    return Math.round(((MET * 3.5 * weight) / 200) * duration);
  };

  const handleWorkout = async (e) => {
    e.preventDefault();
    if (!user) return;

    const kcal = calculateCalories(workoutType, duration);
    const workoutData = {
      type: workoutType,
      duration: Number(duration),
      calories: kcal,
      date: new Date().toLocaleDateString(),
      userId: user.uid,
    };

    if (editId) {
      const workoutRef = doc(db, "workouts", editId);
      await updateDoc(workoutRef, workoutData);
      toast.info("Workout updated!", { theme: "colored" });
      setEditId(null);
    } else {
      await addDoc(collection(db, "workouts"), workoutData);
      toast.success("Workout added!", { theme: "colored" });
    }

    setWorkoutType("Running");
    setDuration(30);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "workouts", id));
    toast.error("Workout deleted!", { theme: "colored" });
  };

  const handleEdit = (w) => {
    setWorkoutType(w.type);
    setDuration(Number(w.duration));
    setEditId(w.id);
  };

  const listenToWorkouts = () => {
    const q = query(
      collection(db, "workouts"),
      where("userId", "==", user.uid)
    );
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      dispatch(setWorkouts(data));
    });
  };

  const shareProgress = async () => {
    try {
      const summaryData = {
        username: user?.displayName || "Fitness Buddy",
        bmi,
        targetBmi,
        weeklyGoal,
        totalDuration,
        goalProgress,
        workouts,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, "sharedProgress"),
        summaryData
      );
      const shareUrl = `${window.location.origin}/share/${docRef.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!", { theme: "colored" });
    } catch (err) {
      toast.error("Failed to copy link!", { theme: "colored" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-gray-900 dark:text-white">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-600 mt-4 dark:text-indigo-400">
        Fitness Dashboard 💪
      </h2>

      {/* ✅ Profile Card */}
      <section className="bg-pink-100 dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
        <h3 className="font-semibold text-xl sm:text-2xl text-pink-700 dark:text-pink-400 mb-4 text-center sm:text-left">
          Profile & BMI
        </h3>
        {/* Inputs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4">
          {["Height (cm)", "Weight (kg)", "Target Weight", "Weekly Goal"].map(
            (placeholder, i) => (
              <input
                key={i}
                className="border rounded-lg p-3 w-full sm:w-40 shadow-md focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="number"
                placeholder={placeholder}
                value={
                  i === 0
                    ? height
                    : i === 1
                    ? weight
                    : i === 2
                    ? targetWeight
                    : weeklyGoal
                }
                onChange={(e) =>
                  i === 0
                    ? setHeight(e.target.value)
                    : i === 1
                    ? setWeight(e.target.value)
                    : i === 2
                    ? setTargetWeight(e.target.value)
                    : setWeeklyGoal(e.target.value)
                }
              />
            )
          )}
        </div>
        <button
          onClick={saveUserProfile}
          className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          Save Profile
        </button>
        <p className="mt-4 text-base sm:text-lg text-center sm:text-left">
          Current BMI: <strong>{bmi}</strong>
        </p>
        <p className="text-center sm:text-left text-sm sm:text-base">
          Target BMI: <strong>{targetBmi}</strong>
        </p>
      </section>

      {/* ✅ Progress Bar */}
      <section className="bg-green-100 dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-green-700 dark:text-green-400">
          Weekly Progress
        </h3>
        <p className="text-base sm:text-lg">
          Goal: {weeklyGoal} min | Done: {totalDuration} min
        </p>
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4 sm:h-6 mt-3 overflow-hidden">
          <div
            style={{ width: `${goalProgress}%` }}
            className="h-4 sm:h-6 bg-green-500 rounded-full transition-all"
          ></div>
        </div>
        <button
          onClick={shareProgress}
          className="w-full sm:w-auto mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          Share Progress 🚀
        </button>
      </section>

      {/* ✅ Add Workout */}
      <section className="bg-purple-100 dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          {editId ? "Edit Workout" : "Add Workout"}
        </h3>
        <form
          onSubmit={handleWorkout}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4"
        >
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="border p-3 rounded-lg shadow-md w-full sm:w-auto text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Running</option>
            <option>Cycling</option>
            <option>Walking</option>
          </select>
          <input
            type="number"
            placeholder="Duration (min)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-3 rounded-lg shadow-md w-full sm:w-auto text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition-all w-full sm:w-auto"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>
      </section>

      {/* ✅ Workout History */}
      <section className="bg-yellow-100 dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400 text-center sm:text-left">
          Workout History
        </h3>
        {workouts.length === 0 ? (
          <p className="text-center sm:text-left">No workouts yet.</p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((w) => (
              <li
                key={w.id}
                className="flex flex-col sm:flex-row sm:justify-between gap-2 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition-all text-sm sm:text-base"
              >
                <span className="text-center sm:text-left">
                  {w.date} — {w.type}, {w.duration} min, {w.calories} kcal
                </span>
                <div className="flex justify-center sm:justify-end gap-3">
                  <button
                    onClick={() => handleEdit(w)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
