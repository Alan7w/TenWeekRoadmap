function HomePage() {
    document.title = 'App | Home';
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-sample-800 mb-4">
                        Assalomu Aleykum! 
                        <span className="block text-4xl md:text-5xl mt-4 text-sample-600">
                            Welcome Home!
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-sample-700 max-w-2xl mx-auto leading-relaxed">
                        Welcome to my personal blog and weather app. Explore my thoughts, 
                        check the weather, and discover amazing content.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-sample-200 rounded-xl p-6 hover:border-sample-400 transition-all duration-300 hover:shadow-lg">
                        <div className="text-3xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-sample-800 mb-2">Blog Posts</h3>
                        <p className="text-sample-600">
                            Read my latest thoughts, insights, and stories. Discover knowledge and perspectives on various topics.
                        </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-sample-200 rounded-xl p-6 hover:border-sample-400 transition-all duration-300 hover:shadow-lg">
                        <div className="text-3xl mb-4">🌤️</div>
                        <h3 className="text-xl font-semibold text-sample-800 mb-2">Weather App</h3>
                        <p className="text-sample-600">
                            Check current weather conditions for any city around the world. Stay updated with real-time data.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-lg text-sample-600 mb-4">Ready to explore?</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/blog" 
                            className="bg-sample-600 hover:bg-sample-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium"
                        >
                            Read Blog Posts
                        </a>
                        <a 
                            href="/weather" 
                            className="border-2 border-sample-600 text-sample-700 hover:bg-sample-50 px-8 py-3 rounded-lg transition-all duration-300 font-medium"
                        >
                            Check Weather
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage