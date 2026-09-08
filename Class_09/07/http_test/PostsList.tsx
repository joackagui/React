import { useState, useEffect } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const API_URL = "https://jsonplaceholder.typicode.com";

export default function PostsList() {
  const [posts, setPosts] = useState<Array<Post>>([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((response) => response.json())
      .then((data: Array<Post>) => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
