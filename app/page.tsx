export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">Welcome to Together Events</h1>
      <p className="mt-2 text-lg">Discover and manage events effortlessly!</p>

      <a
        href="/events"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Browse Events
      </a>
    </main>
  );
}
