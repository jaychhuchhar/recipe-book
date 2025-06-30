'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCountdown(10);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-2 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      {countdown !== null && (
        <p className="mb-6 text-sm text-muted-foreground">
          Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}.
        </p>
      )}
      <button
        onClick={() => router.push('/')}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2 rounded transition"
      >
        Go to Homepage
      </button>
    </main>
  );
}
