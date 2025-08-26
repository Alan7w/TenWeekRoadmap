import Card from './Card';
import '../styles/BlogPage.css';

function BlogsListSkeleton() {
    return (
        <div>
            <h1>Loading Page Title ...</h1>
            <p>Loading Page Content ...</p>
            <div className="blogsContainer">
                {Array.from({length: 100}, (_, index) => {
                    return (
                        <Card variant="outlined" className="cardStyle" key={index}>
                            <h4>Loading Post ID...</h4>
                            <h3 className="h3">Loading Post Title...</h3>
                            <p className="p">Loading Post Body...</p>
                        </Card>)
                })}
            </div>
        </div>
          
    )
}

export default BlogsListSkeleton;