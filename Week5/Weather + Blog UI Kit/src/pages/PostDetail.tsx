import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostDetailSkeleton from "../components/PostDeatilSkeleton";
import Button from "../components/ui/Button";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";

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
            <PageTransition>
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
            </PageTransition>
        )
    }

    if (loading) return <PostDetailSkeleton />

    document.title = `Blog | ${post?.title}`;

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* page intro (header) */}
                <motion.div 
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1 
                        className="text-4xl md:text-5xl font-bold text-sample-800"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Post Detail Page
                    </motion.h1>
                    <motion.p 
                        className="text-lg text-sample-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Dive deep into this specific post and explore the content.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="bg-white/90 backdrop-blur-sm border border-sample-200 rounded-2xl shadow-xl p-8 md:p-12"
                    initial={{opacity: 0, y: 40, scale: 0.95}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.25, 0.25, 0.75],
                        type: "spring",
                        damping: 20,
                        stiffness: 80
                    }}
                >
                    {/* post number */}
                    <motion.div
                        className="mb-6"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.3, duration: 0.4, type: "spring"}}
                    >
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-sample-100 text-sample-800">
                            Post #{id}
                        </span>
                    </motion.div>

                    {/* post title */}
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-sample-900 mb-8 leading-tight"
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4, duration: 0.6, ease: "easeOut"}}
                    >
                        {post?.title || `Post #${id} does not exist.`}
                    </motion.h1>

                    {/* post body */}
                    <motion.div
                        className="prose prose-lg max-w-none"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.6, duration: 0.5}}                    
                    >
                        <p className="text-sample-700 text-lg leading-relaxed">
                            {post?.body}
                        </p>
                    </motion.div>

                    {/* navigation buttons */}
                    <motion.div
                        className="mt-12 pt-8 border-t border-sample-200"
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.8, duration: 0.5}}
                    >
                        {/* buttons div */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* previous button */}
                            <motion.div
                                variants={{
                                    hidden: {opacity: 0, x: -20},
                                    visible: {opacity: 1, x: 0}
                                }}
                                transition={{duration: 0.3}}
                                whileHover={{scale: 1.05, x: -15}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => navigate(`/blog/${id ? parseInt(id) - 1 : 0}`)}
                                    className="border-sample-600 text-sample-700 hover:bg-sample-50 hover:border-sample-700 transition-all duration-200"
                                    disabled={!id || parseInt(id) <= 1}
                                >
                                    ← Previous Post
                                </Button>
                            </motion.div>

                            {/* next button */}
                            <motion.div
                                variants={{
                                    hidden: {opacity: 0, x: 20},
                                    visible: {opacity: 1, x: 0}
                                }}
                                transition={{duration: 0.3}}
                                whileHover={{scale: 1.05, x: 15}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => navigate(`/blog/${id ? parseInt(id) + 1 : 0}`)}
                                    className="border-sample-600 text-sample-700 hover:bg-sample-50 hover:border-sample-700 transition-all duration-200"
                                    disabled={!id || parseInt(id) >= 100}
                                >
                                    Next Post →
                                </Button>
                            </motion.div>
                        </motion.div>
                        
                        {/* back to blog button */}
                        <motion.div
                            className="text-center"
                            variants={{
                                hidden: {opacity: 0, x: -20},
                                visible: {opacity: 1, x: 0}
                            }}
                            transition={{duration: 0.3}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => navigate('/blog')}
                                className="bg-sample-600 hover:bg-sample-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                ← Back to blogs
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </PageTransition>
    );
}

export default PostDetail;