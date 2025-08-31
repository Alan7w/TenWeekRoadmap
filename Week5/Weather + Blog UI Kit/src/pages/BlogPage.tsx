import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import BlogsListSkeleton from "../components/BlogsListSkeleton";
import Button from "../components/ui/Button";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";

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
            <PageTransition>
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
            </PageTransition>
        )
    }

    if (loading) return <BlogsListSkeleton />

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-sample-800 mb-2">
                        Welcome to the Blog Page
                    </h1>
                    <p className="text-lg text-sample-600 max-w-2xl mx-auto">
                        Below are the blog posts - discover insights, stories, and knowledge.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                delayChildren: 0.2,
                                staggerChildren: 0.08
                            }
                        }
                    }}
                >
                    {posts?.map((post, index) => (
                        <motion.div
                            key={post.id}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    y: 40,
                                    scale: 0.9
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        duration: 0.5,
                                        ease: [0.25, 0.25, 0.25, 0.75],
                                        type: "spring",
                                        damping: 20,
                                        stiffness: 100
                                    }
                                }
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.04,
                                transition: {
                                    duration: 0.2,
                                    type: "spring",
                                    damping: 15
                                }
                            }}
                            whileTap={{scale: 0.98}}
                        >
                            <Card
                                variant="outlined"
                                className="h-full hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="h-full flex flex-col">
                                    {/* post number */}
                                    <div className="flex justify-between items-start mb-4">
                                        <motion.span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sample-100 text-sample-800"
                                            initial={{scale: 0}}
                                            animate={{scale: 1}}
                                            transition={{delay: (0.3 + index * 0.08), duration: 0.3}}
                                        >
                                            Post #{post.id}
                                        </motion.span>
                                    </div>

                                    {/* post title */}
                                    <motion.h3
                                        className="text-lg font-semibold text-sample-900 mb-3 line-clamp-2 min-h-[3.5rem] leading-tight"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: (0.4 + index * 0.08), duration: 0.4}}
                                    >
                                        {post.title}
                                    </motion.h3>

                                    {/* post body*/}
                                    <motion.p
                                        className="text-sample-600 text-sm line-clamp-4 leading-relaxed flex-1 mb-4"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: (0.5 + index * 0.08), duration: 0.4}}
                                    >
                                        {post.body}
                                    </motion.p>

                                    {/* read more button */}
                                    <motion.div
                                        className="mt-auto"
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: (0.6 + index * 0.08), duration: 0.3}}
                                    >
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => navigate(`/blog/${post.id}`)}
                                            className="w-full bg-sample-600 hover:bg-sample-700 text-white transform hover:scale-105 transition-all duration-200"
                                        >
                                            Read More
                                        </Button>
                                    </motion.div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}

export default BlogPage