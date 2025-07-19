import { useSelector } from "react-redux";
import BuddyCard from "../components/BuddyCard";

export default function Profile() {
  const buddies = useSelector((state) => state.buddies.list);
  const user = useSelector((state) => state.user.user);
  const userGoal = "Weight Loss";
  const userLocation = "Delhi";

  const matchedBuddies = buddies.filter(
    (b) => b.goal === userGoal || b.location === userLocation
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Find Fitness Buddies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedBuddies.map((buddy) => (
          <BuddyCard key={buddy.id} buddy={buddy} />
        ))}
      </div>
    </div>
  );
}
