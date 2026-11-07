import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-8 rounded-3xl glass-card border border-white/10 max-w-xl mx-auto my-12 text-center space-y-4">
      <h2 className="text-3xl font-black text-sky-400 font-mono">404</h2>
      <h3 className="text-xl font-bold text-white">Page Not Found</h3>
      <p className="text-xs text-slate-300">The page or demo suite you requested does not exist.</p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all"
      >
        Return to Home Page
      </Link>
    </div>
  );
}
