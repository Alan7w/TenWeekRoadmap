import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">404</h1>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">Page not found.</p>
      <NavLink to="/" className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Go Home
      </NavLink>
    </section>
  );
}


