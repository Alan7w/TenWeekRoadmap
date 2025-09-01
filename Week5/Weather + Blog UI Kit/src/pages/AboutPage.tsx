import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";

function AboutPage() {
    document.title = 'App | About';
    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-12">
                {/* headline */}
                <ScrollReveal direction="down" delay={0.2}>
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-sample-800">
                            About This Project
                        </h1>
                        <p className="text-xl text-sample-600 max-w-2xl mx-auto">
                            Learn more about this blog and weather application built with modern web technologies.
                        </p>
                    </div>
                </ScrollReveal>
                

                {/* data container */}
                <ScrollReveal direction="up" delay={0.2}>
                    <div className="bg-white/90 backdrop-blur-sm border border-sample-200 rounded-2xl shadow-xl p-8 md:p-12 space-y-6">
                        {/* about the application */}
                        <div className="space-y-4">
                            <ScrollReveal direction="left" delay={0.3}>
                                <h2 className="text-2xl font-semibold text-sample-800">
                                    About This Application
                                </h2>
                            </ScrollReveal>
                            <ScrollReveal direction="left" delay={0.4}>
                                <p className="text-sample-700 leading-relaxed">
                                    This is a modern blog and weather application built as part of a 10-week learning roadmap. 
                                    The project showcases the power of React, TypeScript, and Tailwind CSS working together 
                                    to create beautiful, performant user interfaces.
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* technologies used */}
                        <div className="space-y-4">
                            <ScrollReveal direction="left" delay={0.5}>
                                <h2 className="text-2xl font-semibold text-sample-800">
                                    Technologies Used
                                </h2>
                            </ScrollReveal>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <ScrollReveal direction="left" delay={0.6}>
                                    <div className="bg-sample-50 border border-sample-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-sample-800 mb-2">Frontend</h3>
                                        <ul className="text-sample-700 space-y-1 text-sm">
                                            <li>- React </li>
                                            <li>- TypeScript </li>
                                            <li>- Tailwind CSS v4 </li>
                                            <li>- React Router </li>
                                        </ul>
                                    </div>
                                </ScrollReveal>

                                <ScrollReveal direction="left" delay={0.7}>
                                    <div className="bg-sample-50 border border-sample-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-sample-800 mb-2">Tools & APIs</h3>
                                        <ul className="text-sample-700 space-y-1 text-sm">
                                            <li>- Vite Build Tool </li>
                                            <li>- OpenWeather API </li>
                                            <li>- JSONPlaceholder API </li>
                                            <li>- ESLint </li>
                                        </ul>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>

                        {/* features */}
                        <div className="space-y-4">
                            <ScrollReveal direction="left" delay={0.8}>
                                <h2 className="text-2xl font-semibold text-sample-800">
                                    Features
                                </h2>
                            </ScrollReveal>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* blog app feature */}
                                <ScrollReveal direction="left" delay={0.9}>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sample-800">📝 Blog System</h3>
                                        <p className="text-sample-600 text-sm">
                                            Browse through blog posts with a clean, responsive design. 
                                            Each post has its own detailed view with navigation.
                                        </p>
                                    </div>
                                </ScrollReveal>
                                
                                {/* weather app feature */}
                                <ScrollReveal direction="left" delay={1.0}>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sample-800">🌤️ Weather App</h3>
                                        <p className="text-sample-600 text-sm">
                                            Get real-time weather information for any city worldwide 
                                            with a beautiful, intuitive interface.
                                        </p>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>

                        {/* development journey */}
                        <div className="space-y-4">
                            <ScrollReveal direction="left" delay={1.1}>
                                <h2 className="text-2xl font-semibold text-sample-800">
                                    Development Journey
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal direction="left" delay={1.2}>
                                <p className="text-sample-700 leading-relaxed">
                                    This project is part of Week 5 in my 10-week learning roadmap. It focuses on
                                    building reusable UI components, implementing responsive designs, and creating
                                    smooth user experiences with modern web technologies.
                                </p>
                            </ScrollReveal>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </PageTransition>
    )
}

export default AboutPage