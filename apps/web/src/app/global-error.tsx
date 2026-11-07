'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 max-w-xl w-full text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-extrabold text-rose-400">Application Error</h2>
          <p className="text-xs text-slate-300 font-mono bg-black p-3 rounded-xl border border-white/10 break-all text-left">
            {error?.message || 'A global error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
