import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {post.category?.name || 'Uncategorized'}
              </span>
              <Link 
                to={`/edit-post/${post._id}`} 
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;