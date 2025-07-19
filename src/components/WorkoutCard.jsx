export default function WorkoutCard({ workout }) {
  return (
    <div className="p-4 border rounded shadow hover:shadow-lg">
      <h2 className="text-xl font-semibold">{workout.title}</h2>
      <p>{workout.duration} mins</p>
    </div>
  );
}
