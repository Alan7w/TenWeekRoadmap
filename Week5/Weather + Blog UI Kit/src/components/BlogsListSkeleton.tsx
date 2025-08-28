import Card from './Card';

function BlogsListSkeleton() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <div className="h-12 bg-sample-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
                <div className="h-6 bg-sample-100 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {Array.from({length: 9}, (_, index) => (
                    <Card variant="outlined" key={index} className="h-full animate-pulse">
                        <div className="h-full flex flex-col">
                            <div className="h-6 bg-sample-200 rounded-full w-20 mb-4"></div>
                            
                            {/* title */}
                            <div className="min-h-[3.5rem] mb-3">
                                <div className="h-5 bg-sample-200 rounded w-full mb-2"></div>
                                <div className="h-5 bg-sample-200 rounded w-3/4"></div>
                            </div>
                            
                            {/* body */}
                            <div className="flex-1 mb-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-sample-100 rounded w-full"></div>
                                    <div className="h-4 bg-sample-100 rounded w-full"></div>
                                    <div className="h-4 bg-sample-100 rounded w-2/3"></div>
                                </div>
                            </div>
                            
                            {/* button */}
                            <div className="h-10 bg-sample-300 rounded w-full mt-auto"></div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default BlogsListSkeleton;