function WeatherAppSkeleton() {
    return (
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-8 w-full max-w-md mx-auto">
            {/* title */}
            <div className="flex flex-col items-center space-y-2">
                <div className="h-7 bg-sample-200 rounded w-2/3 animate-pulse" />
            </div>
            {/* temperature */}
            <div className="flex flex-col items-center space-y-2">
                <div className="h-10 bg-sample-200 rounded w-1/2 animate-pulse" />
                <div className="h-5 bg-sample-200 rounded w-1/3 animate-pulse" />
            </div>
            {/* humidity */}
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                <div className="h-5 bg-sample-200 rounded w-1/4 animate-pulse" />
                <div className="h-5 bg-sample-200 rounded w-1/6 animate-pulse" />
            </div>
            {/* description */}
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                <div className="h-5 bg-sample-200 rounded w-1/4 animate-pulse" />
                <div className="h-5 bg-sample-200 rounded w-1/3 animate-pulse" />
            </div>
        </div>
    );
}

export default WeatherAppSkeleton;
