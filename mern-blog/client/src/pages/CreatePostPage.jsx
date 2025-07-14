import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import PostForm from '../components/PostForm';

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    try {
      setLoading(true);
      await createPost(postData);
      navigate('/');
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreatePostPage;
