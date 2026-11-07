'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="p-8 rounded-3xl glass-card border border-white/10 max-w-xl mx-auto my-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto text-xl font-bold">
        !
      </div>
      <h2 className="text-xl font-extrabold text-white">Something went wrong</h2>
      <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-white/10 break-all text-left">
        {error?.message || 'An unexpected application error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all"
      >
        Try again
      </button>
    </div>
  );
}
