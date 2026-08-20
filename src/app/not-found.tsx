import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="surface-card max-w-xl p-10 text-center md:p-14">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">Page not found</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">This address does not point to a published page.</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-500">The address may have changed, or the content may still be a draft.</p>
        <Link className="button button-primary mt-8" href="/"><ArrowLeft size={16} /> Return home</Link>
      </div>
    </main>
  );
}
