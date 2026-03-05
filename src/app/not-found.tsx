export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-gray-500 mt-3">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
