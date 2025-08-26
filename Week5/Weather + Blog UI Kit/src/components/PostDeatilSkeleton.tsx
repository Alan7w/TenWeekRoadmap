function PostDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="h-12 bg-sample-200 rounded-lg w-2/3 mx-auto animate-pulse"></div>
                <div className="h-6 bg-sample-100 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-sample-200 rounded-2xl shadow-xl p-8 md:p-12 animate-pulse">
                <div className="mb-6">
                    <div className="h-8 bg-sample-200 rounded-full w-24"></div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="h-8 bg-sample-200 rounded w-full"></div>
                    <div className="h-8 bg-sample-200 rounded w-3/4"></div>
                </div>

                <div className="space-y-4 mb-12">
                    {Array.from({length: 6}, (_, index) => (
                        <div key={index} className="h-4 bg-sample-100 rounded w-full"></div>
                    ))}
                    <div className="h-4 bg-sample-100 rounded w-2/3"></div>
                </div>

                <div className="mt-12 pt-8 border-t border-sample-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <div className="h-10 bg-sample-200 rounded w-32"></div>
                        <div className="h-10 bg-sample-200 rounded w-32"></div>
                    </div>
                    <div className="text-center">
                        <div className="h-10 bg-sample-300 rounded w-40 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailSkeleton;