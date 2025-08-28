import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import BlogsListSkeleton from "../components/BlogsListSkeleton";
import Button from "../components/ui/Button";

function BlogPage() {
    document.title = 'App | Blog';

    type Post = {
        id: number
        body: string
        title: string
        userId: number
    }

    const [posts, setPosts] = useState<Post[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController();
        fetch ('https://jsonplaceholder.typicode.com/posts', {signal: controller.signal})
            .then (response => response.json())
            .then (data => {
                setPosts(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message ? error.message : "Something went wrong!")
                setLoading(false)
                controller.abort()
            })
    }, [])

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-8 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
                    Posts Could not be Loaded: {error}
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

    if (loading) return <BlogsListSkeleton />

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-sample-800 mb-2">
                    Welcome to the Blog Page
                </h1>
                <p className="text-lg text-sample-600 max-w-2xl mx-auto">
                    Below are the blog posts - discover insights, stories, and knowledge.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {posts?.map(post => (
                    <Card 
                        key={post.id}
                        variant="outlined" 
                        className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sample-100 text-sample-800">
                                    Post #{post.id}
                                </span>
                            </div>

                            {/* title */}
                            <h3 className="text-lg font-semibold text-sample-900 mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
                                {post.title}
                            </h3>

                            {/* body */}
                            <p className="text-sample-600 text-sm line-clamp-3 leading-relaxed flex-1 mb-4">
                                {post.body}
                            </p>

                            {/* read more button */}
                            <div className="mt-auto border-t border-sample-200 p-2">
                                <Button 
                                    variant="primary" 
                                    size="small" 
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                    className="w-full bg-sample-600 hover:bg-sample-700 text-white"
                                >
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default BlogPage