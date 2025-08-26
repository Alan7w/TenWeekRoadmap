import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostDetailSkeleton from "../components/PostDeatilSkeleton";
import Button from "../components/ui/Button";

function PostDetail() {    
    type Post = {
        id: number
        body: string
        title: string
        userId: number
    }
    
    const { id } = useParams<{id: string}>()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController();
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {signal: controller.signal})
            .then(response => response.json())
            .then(data => {
                setPost(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message || "Something went wrong!")
                setLoading(false)
                controller.abort()
            })
    }, [id])

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8 p-8 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
                    Post Not Found: {error}
                </h1>
                <div className="text-center">
                    <Button 
                        size="large" 
                        variant="secondary" 
                        onClick={() => window.location.reload()}
                        className="bg-sample-500 hover:bg-sample-600 text-white"
                    >
                        Try again
                    </Button>
                </div>
            </div>
        )
    }

    if (loading) return <PostDetailSkeleton />

    document.title = `Blog | ${post?.title}`;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-sample-800">
                    Post Detail Page
                </h1>
                <p className="text-lg text-sample-600">
                    Dive deep into this specific post and explore the content.
                </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-sample-200 rounded-2xl shadow-xl p-8 md:p-12">
                <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-sample-100 text-sample-800">
                        Post #{id}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-sample-900 mb-8 leading-tight">
                    {post?.title || `The post with id ${id} cannot be found!`}
                </h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-sample-700 text-lg leading-relaxed">
                        {post?.body}
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-sample-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Button 
                            variant="outlined" 
                            size="medium"
                            onClick={() => navigate(`/blog/${id ? parseInt(id) - 1 : 0}`)}
                            className="border-sample-600 text-sample-700 hover:bg-sample-50"
                            disabled={!id || parseInt(id) <= 1}
                        >
                            ← Previous Post
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            size="medium"
                            onClick={() => navigate(`/blog/${id ? parseInt(id) + 1 : 0}`)}
                            className="border-sample-600 text-sample-700 hover:bg-sample-50"
                            disabled={!id || parseInt(id) >= 100}
                        >
                            Next Post →
                        </Button>
                    </div>

                    <div className="text-center">
                        <Button 
                            variant="primary" 
                            size="medium"
                            onClick={() => navigate('/blog')}
                            className="bg-sample-600 hover:bg-sample-700 text-white"
                        >
                            ← Back to Blog
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;