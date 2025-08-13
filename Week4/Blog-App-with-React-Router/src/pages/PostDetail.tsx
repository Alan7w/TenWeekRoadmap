import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PostDetail () {
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

    useEffect(() => {
        setLoading(true)
        fetch (`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then (response => response.json())
            .then (data => {
                setPost(data)
                setLoading(false)
            })
            .catch (error => {
                setError(error.message || "Something went wrong!")
                setLoading(false)
            })
    }, [id])

    if (error) return <div style={{ marginTop: '50px', color: 'red' }}>Post Not Found: {error}</div>
    if (loading) return <div style={{ marginTop: '50px' }}>Loading the post ...</div>

    console.log(post)

    document.title = `Blog | ${post?.title}`;

    return (
        <div>
            <h1>Post Detail Page</h1>
            <p>This is the detail page for a specific post.</p>
            <h3>{post?.title}</h3>
            <p>{post?.body}</p>
        </div>
    );
}

export default PostDetail;