export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center bg-white dark:bg-gray-950">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
        Welcome to Recipe Book
      </h1>
      <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400 mb-8">
        Explore easy, delicious, and inspiring recipes — from quick breakfasts to sweet desserts.
        Perfect for home cooks who love flavor and simplicity.
      </p>
      <a
        href="/recipes"
        className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        📘 Browse All Recipes
      </a>
    </main>
  );
}
