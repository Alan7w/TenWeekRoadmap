import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import '../styles/BlogPage.css'
import BlogsListSkeleton from "../components/BlogsListSkeleton";

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
            <div className="outlined">
                <h1 className="errorStyle">Posts Could not be Loaded: {error}</h1>
                <br />
                <button className="tryAgainButtonStyle" onClick={() => window.location.reload()}>Try again</button>
            </div>
        )
    }
    if (loading) return <BlogsListSkeleton />

    return (
        <div>
            <h1>Welcome to the Blog Page</h1>
            <p>Below are the blog posts:</p>
            <div className="blogsContainer">
                {posts?.map(post => {
                    return (
                    <Card variant="outlined" className="cardStyle">
                        <h4>{post.id}</h4>
                        <h3 className="h3">{post.title}</h3>
                        <p className="p">{post.body}</p>
                        <button className="readMoreButtonStyle">
                            <Link to={`/blog/${post.id}`}>Read more</Link>
                        </button>
                    </Card>)
                })}
            </div>   
        </div>
    )
}

export default BlogPage