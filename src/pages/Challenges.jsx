
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  addChallenge,
  updateProgress,
  deleteChallenge,
  editChallenge,
} from "../redux/challengeSlice";
export default function Challenges() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const challenges = useSelector((state) => state.challenges.list);
  const userChallenges = challenges.filter(
    (challenge) => challenge.userId === user?.email
  );
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [unit, setUnit] = useState("times"); 
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [animatedWidths, setAnimatedWidths] = useState({});

  const calculateStatus = (progress, goal) => {
    if (progress >= goal) return "Completed";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };

  useEffect(() => {
    const widths = {};
    userChallenges.forEach((c) => {
      const percent = Math.min((c.progress / c.goal) * 100, 100);
      widths[c.id] = percent;
    });
    const timer = setTimeout(() => setAnimatedWidths(widths), 100);
    return () => clearTimeout(timer);
  }, [userChallenges]);

  const handleAddChallenge = (e) => {
    e.preventDefault();
    if (!title || !goal) return alert("Title & Goal required!");
    if (!user) return alert("Please login to add challenges");

    dispatch(
      addChallenge({
        id: Date.now(),
        title,
        goal: parseInt(goal),
        unit, 
        progress: 0,
        deadline,
        description,
        status: "Not Started",
        userId: user.email,
      })
    );
    setShowModal(false);
    resetForm();
  };

  const handleEditChallenge = (e) => {
    e.preventDefault();
    if (!title || !goal) return alert("Title & Goal required!");
    dispatch(
      editChallenge({
        id: currentChallenge.id,
        title,
        goal: parseInt(goal),
        unit,
        deadline,
        description,
        userId: currentChallenge.userId,
      })
    );
    setEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setGoal("");
    setUnit("times");
    setDeadline("");
    setDescription("");
    setCurrentChallenge(null);
  };

  const handleEditClick = (challenge) => {
    setCurrentChallenge(challenge);
    setTitle(challenge.title);
    setGoal(challenge.goal);
    setUnit(challenge.unit || "times");
    setDeadline(challenge.deadline);
    setDescription(challenge.description);
    setEditModal(true);
  };

  const handleProgressUpdate = (id) => {
    const challenge = userChallenges.find((c) => c.id === id);
    if (!challenge) return;

    const remaining = challenge.goal - challenge.progress;
    const amount = parseInt(
      prompt(`Enter amount to add (max ${remaining} ${challenge.unit}):`)
    );
    if (amount > 0) {
      const newProgress = Math.min(challenge.progress + amount, challenge.goal);
      const status = calculateStatus(newProgress, challenge.goal);
      dispatch(
        updateProgress({ id, amount: newProgress - challenge.progress, status })
      );
    } else {
      alert("Invalid amount");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this challenge?")) {
      dispatch(deleteChallenge(id));
    }
  };

  const getStatusBadge = (status) => {
    let color = "bg-gray-400";
    if (status === "Completed") color = "bg-green-500";
    else if (status === "In Progress") color = "bg-yellow-500";
    else if (status === "Not Started") color = "bg-red-500";
    return (
      <span
        className={`px-3 py-1 text-white text-xs rounded-full ${color} whitespace-nowrap`}
      >
        {status}
      </span>
    );
  };

  const filteredChallenges = userChallenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || calculateStatus(c.progress, c.goal) === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className=" sm:p-6  mb-5 max-w-5xl mx-auto dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl sm:text-2xl text-center font-bold text-blue-600 dark:text-blue-400 mb-10">
        🏆 My Fitness Challenges
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            placeholder="Search challenge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 w-full sm:w-64 text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 w-full sm:w-40 text-sm"
          >
            <option value="All">All</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg shadow-md text-sm"
          disabled={!user}
        >
          Add
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-purple-100 dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 text-sm"
            >
              <h3 className="text-base sm:text-lg font-bold mb-2">
                {challenge.title}
              </h3>
              <p className="text-xs sm:text-sm mb-1">
                {challenge.description || "No description"}
              </p>
              <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Deadline: {challenge.deadline || "None"}
                </p>
                {getStatusBadge(
                  calculateStatus(challenge.progress, challenge.goal)
                )}
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-2 mt-3">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span>
                    {challenge.progress} / {challenge.goal} {challenge.unit}
                  </span>
                  <span>
                    {Math.min(
                      ((challenge.progress / challenge.goal) * 100).toFixed(0),
                      100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    style={{ width: `${animatedWidths[challenge.id] || 0}%` }}
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => handleProgressUpdate(challenge.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded-lg text-xs"
                >
                  Update
                </button>
                <button
                  onClick={() => handleEditClick(challenge)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1 rounded-lg text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(challenge.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-1 rounded-lg text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full text-sm">
            No challenges found.
          </p>
        )}
      </div>
      {showModal && (
        <Modal
          title="Create New Challenge"
          onClose={() => setShowModal(false)}
          onSubmit={handleAddChallenge}
          titleVal={title}
          goalVal={goal}
          unitVal={unit}
          deadlineVal={deadline}
          descVal={description}
          setTitle={setTitle}
          setGoal={setGoal}
          setUnit={setUnit}
          setDeadline={setDeadline}
          setDescription={setDescription}
          buttonText="Add"
        />
      )}
      {editModal && currentChallenge && (
        <Modal
          title="Edit Challenge"
          onClose={() => setEditModal(false)}
          onSubmit={handleEditChallenge}
          titleVal={title}
          goalVal={goal}
          unitVal={unit}
          deadlineVal={deadline}
          descVal={description}
          setTitle={setTitle}
          setGoal={setGoal}
          setUnit={setUnit}
          setDeadline={setDeadline}
          setDescription={setDescription}
          buttonText="Save Changes"
        />
      )}
    </div>
  );
}
function Modal({
  title,
  onClose,
  onSubmit,
  titleVal,
  goalVal,
  unitVal,
  deadlineVal,
  descVal,
  setTitle,
  setGoal,
  setUnit,
  setDeadline,
  setDescription,
  buttonText,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h3 className="font-semibold text-lg sm:text-xl mb-4 dark:text-white">
          {title}
        </h3>
        <form onSubmit={onSubmit} className="grid gap-4 text-sm">
          <input
            type="text"
            placeholder="Challenge Title"
            value={titleVal}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Goal"
            value={goalVal}
            onChange={(e) => setGoal(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="1"
            required
          />
          <select
            value={unitVal}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="times">Times</option>
            <option value="km">Kilometers</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
          <input
            type="date"
            value={deadlineVal}
            onChange={(e) => setDeadline(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={descVal}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 dark:bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
