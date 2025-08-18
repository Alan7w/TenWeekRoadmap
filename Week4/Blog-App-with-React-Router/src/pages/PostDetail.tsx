import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../styles/PostDetail.css';

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

    if (error) return <div className="errorStyle">Post Not Found: {error}</div>
    if (loading) return <h3>Loading the post ...</h3>

    console.log(post)

    document.title = `Blog | ${post?.title}`;

    return (
        <div>
            <h1>Post Detail Page</h1>
            <p>This is the detail page for a specific post.</p>
            <div className='postCardStyle'>
                <h2>{post?.title}</h2>
                <p>{post?.body}</p>
            </div>
        </div>
    );
}

export default PostDetail;