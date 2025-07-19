import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ShareProgress() {
  const { id } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const docRef = doc(db, "sharedProgress", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setProgress(snapshot.data());
        } else {
          setProgress(null);
        }
      } catch (error) {
        console.error("❌ Error fetching shared progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold text-blue-600">
        Loading Progress...
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex justify-center items-center h-screen text-sm md:text-xl font-bold text-blue-600">
        No Progress Found
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 sm:p-6">
      {/* ✅ Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 text-center text-blue-600 dark:text-purple-400">
        {progress.username || "Fitness Buddy"}'s Fitness Journey
      </h1>

      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
          Here's a quick look at your fitness achievements and workout history.
        </p>

        {/* ✅ Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-white">
              {progress.bmi}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Current BMI
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-700 p-3 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold text-purple-700 dark:text-white">
              {progress.targetBmi}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Target BMI
            </p>
          </div>
          <div className="bg-pink-100 dark:bg-pink-700 p-3 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold text-pink-700 dark:text-white">
              {progress.weeklyGoal} min
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Weekly Goal
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-700 p-3 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold text-yellow-700 dark:text-white">
              {progress.totalDuration} min
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Total Time
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-700 p-3 rounded-lg text-center col-span-2 md:col-span-1">
            <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-white">
              {Math.round(progress.goalProgress)}%
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Goal Progress
            </p>
          </div>
        </div>

        {/* ✅ Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold">
              Goal Completion
            </span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-5 overflow-hidden relative">
            <div
              className="h-5 rounded-full transition-all duration-700 ease-in-out flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                width: `${Math.max(progress.goalProgress || 0, 5)}%`,
              }}
            >
              {Math.round(progress.goalProgress || 0)}%
            </div>
          </div>
        </div>

        {/* ✅ Workout History */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
          Workout History
        </h2>
        {progress.workouts && progress.workouts.length > 0 ? (
          <ul className="space-y-3">
            {progress.workouts.map((w, index) => (
              <li
                key={index}
                className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {w.type}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {w.date} | {w.duration} min | {w.calories} kcal
                  </p>
                </div>
                <span className="text-pink-500 text-lg sm:text-xl">🔥</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No workouts logged yet.</p>
        )}
      </div>
    </div>
  );
}
