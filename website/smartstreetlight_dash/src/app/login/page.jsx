export default function Signup() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl text-center mb-4 text-blue">Sign In</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue text-gray rounded-md hover:opacity-80 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
