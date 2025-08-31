import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';

function NotFoundPage() {
    document.title = 'App | Not Found';
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
                <div className="space-y-4">
                    <div className="text-8xl md:text-9xl font-bold text-sample-300">
                        404
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-sample-800">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-lg text-sample-600 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved to another location.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-sample-200 rounded-xl p-6">
                    <div className="space-y-4">
                        <span className="text-4xl">🔍</span>
                        <h2 className="text-xl font-semibold text-sample-800">
                            What can you do?
                        </h2>
                        <ul className="text-sample-600 space-y-2 text-left max-w-sm mx-auto">
                            <li>- Check the URL for typos </li>
                            <li>- Go back to the previous page </li>
                            <li>- Visit our homepage </li>
                            <li>- Browse our blog posts </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate('/')}
                        className="bg-sample-600 hover:bg-sample-700 text-white"
                    >
                        Go Home
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/blog')}
                        className="border-sample-600 text-sample-700 hover:bg-sample-50"
                    >
                        📝 Browse Blog
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => window.history.back()}
                        className="border-sample-600 text-sample-700 hover:bg-sample-50"
                    >
                        ← Go Back
                    </Button>
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default NotFoundPage