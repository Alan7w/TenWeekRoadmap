export default function About() {
  return (
    <div className="min-h-full">
      {/* Hero Section with Purple Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              About MiniStore
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A modern, responsive marketplace built with cutting-edge web technologies 
              as part of a 10-week learning roadmap
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white dark:bg-neutral-950 rounded-xl p-8 shadow-sm mb-8">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-center max-w-3xl mx-auto">
              This project demonstrates advanced React patterns, context management, and beautiful UI design. 
              We're building a complete e-commerce solution with modern best practices and cutting-edge technologies.
            </p>
            
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">Technologies Used</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Frontend</h3>
                <ul className="text-neutral-600 dark:text-neutral-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    React 19 with TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Framer Motion for animations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    React Router for navigation
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Features</h3>
                <ul className="text-neutral-600 dark:text-neutral-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Dark/Light theme switching
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Responsive design
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Context-based state management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Modern UI components
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Learning Goals</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-8 rounded-xl">
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto">
                  This project focuses on mastering React Context API, custom hooks, theme management, 
                  and building a complete e-commerce-style application with modern best practices. 
                  We're exploring advanced patterns like compound components, proper state management, 
                  and creating reusable, accessible UI components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


