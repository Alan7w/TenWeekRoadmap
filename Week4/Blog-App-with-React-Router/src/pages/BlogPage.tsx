import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        fetch ('https://jsonplaceholder.typicode.com/posts')
            .then (response => response.json())
            .then (data => {
                setPosts(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message || "Something went wrong!")
                setLoading(false)
            })
    }, [])

    if (error) return <div style={{ marginTop: '50px', color: 'red' }}>Posts Could Not Be Loaded: {error}</div>
    if (loading) return <div style={{ marginTop: '50px' }}>Loading posts ...</div>

    console.log(posts)

    return (
        <div>
            <h1>Welcome to the Blog Page</h1>
            <p>Below are the blog posts:</p>
            <ol>
                {posts?.map(post => {
                    return <li key={post.id}><Link to={`/blog/${post.id}`}>{post.title}</Link></li>
                })}
            </ol>
        </div>
    )
}

export default BlogPage