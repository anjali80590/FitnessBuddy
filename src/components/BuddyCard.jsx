import { useDispatch } from "react-redux";
import { selectBuddy } from "../redux/buddySlice";
import { useNavigate } from "react-router-dom";

export default function BuddyCard({ buddy }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelect = () => {
    dispatch(selectBuddy(buddy));
    navigate("/messages");
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{buddy.name}</h3>
        <p className="text-gray-500">{buddy.location}</p>
        <p className="text-blue-500">Goal: {buddy.goal}</p>
      </div>
      <button
        onClick={handleSelect}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Chat
      </button>
    </div>
  );
}
