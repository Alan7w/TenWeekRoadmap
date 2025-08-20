import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../styles/PostDetail.css';
import PostDetailSkeleton from "../components/PostDeatilSkeleton";

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
        const controller = new AbortController();
        fetch (`https://jsonplaceholder.typicode.com/posts/${id}`, {signal: controller.signal})
            .then (response => response.json())
            .then (data => {
                setPost(data)
                setLoading(false)
            })
            .catch (error => {
                setError(error.message || "Something went wrong!")
                setLoading(false)
                controller.abort()
            })
    }, [id])

    if (error) {
        return (
            <div className="postCardStyle">
                <h1 className="errorStyle">Post Not Found: {error}</h1>
                <br />
                <button className="tryAgainButtonStyle" onClick={() => window.location.reload()}>Try again</button>
            </div>
        )
    }
    if (loading) return <PostDetailSkeleton />

    document.title = `Blog | ${post?.title}`;

    return (
        <div>
            <h1>Post Detail Page</h1>
            <p>This is the detail page for a specific post.</p>
            <div className='postCardStyle'>
                <h2>{post?.title ? post.title : "The post with id " + id + " cannot be found!"}</h2>
                <p>{post?.body}</p>
            </div>
        </div>
    );
}

export default PostDetail;