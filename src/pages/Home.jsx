export default function Home() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to FitnessBuddy</h1>
      <p className="text-lg text-gray-700 mb-6">
        Connect with fitness partners, track your progress, and achieve your
        goals!
      </p>
      <a
        href="/register"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Get Started
      </a>
    </div>
  );
}
