import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";

function HomePage() {
    document.title = 'App | Home';
    const navigate = useNavigate();
    return (
        <PageTransition>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
                    {/* greeting message */}
                    <ScrollReveal direction="down" delay={0.2}>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-bold text-sample-800 mb-4">
                                Assalomu Aleykum!
                            </h1>
                            <span className="font-bold text-4xl md:text-5xl mt-4 text-sample-600">
                                Welcome Home!
                            </span>
                            <p className="text-xl md:text-2xl text-sample-700 max-w-2xl mx-auto mt-9">
                                Welcome to my personal blog and weather app. Explore my thoughts, 
                                check the weather, and discover amazing content.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.4}>
                        <div className="grid md:grid-cols-2 gap-5 mt-10">
                            {/* blog page intro */}
                            <div className="bg-white/80 backdrop-blur-sm border-2 border-sample-200 rounded-xl p-6 hover:border-sample-400 transition-all duration-300 hover:shadow-lg">
                                <span className="text-3xl mb-4">📝</span>
                                <h3 className="text-xl font-semibold text-sample-800 mb-2">Blog Posts</h3>
                                <p className="text-sample-600">
                                    Read my latest thoughts, insights, and stories. Discover knowledge and perspectives on various topics.
                                </p>
                            </div>

                            {/* weather app intro */}
                            <div className="bg-white/80 backdrop-blur-sm border-2 border-sample-200 rounded-xl p-6 hover:border-sample-400 transition-all duration-300 hover:shadow-lg">
                                <span className="text-3xl mb-4">🌤️</span>
                                <h3 className="text-xl font-semibold text-sample-800 mb-2">Weather App</h3>
                                <p className="text-sample-600">
                                    Check current weather conditions for any city around the world. Stay updated with real-time data.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                    

                    {/* buttons for the apps */}
                    <div className="mt-12">
                        <ScrollReveal direction="up" delay={0.4}>
                            <p className="text-lg text-sample-600 mb-4">Ready to explore?</p>
                        </ScrollReveal>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ScrollReveal direction="right" delay={0.6}>
                                <Button 
                                    onClick={() => navigate("/blog")}
                                    variant="primary"
                                    size="large"
                                    className="bg-sample-600 hover:bg-sample-700 text-white px-8 py-3 transition-all duration-300"
                                >
                                    Read Blog Posts
                                </Button>
                            </ScrollReveal>    

                            <ScrollReveal direction="left" delay={0.6}>
                                <Button 
                                    onClick={() => navigate("/weather")}
                                    variant="secondary"
                                    size="large"
                                    className="border-2 border-sample-600 text-sample-700 hover:bg-sample-50 px-8 py-3 transition-all duration-300"
                                >
                                    Check Weather
                                </Button>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default HomePage