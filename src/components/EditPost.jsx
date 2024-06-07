import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import DataContext from "../context/DataContext";

const EditPost = () => {
  const { posts, handleEdit, editTitle, setEditTitle, editBody, setEditBody } =
    useContext(DataContext);

  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);
  return (
    <main className="NewPost">
      <>
        {
          <>
            <h2>Edit Post</h2>
            <form
              className="newPostForm"
              onSubmit={(e) => handleEdit(e, post.id)}
            >
              <label htmlFor="postTitle">Title:</label>
              <input
                id="postTitle"
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <label htmlFor="postBody">Post:</label>
              <input
                id="postBody"
                type="text"
                required
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </>
        }
        {/* {!editTitle && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, That's disappointing.</p>
            <p>
              <Link to="/">Visit our Homepage</Link>
            </p>
          </>
        )} */}
      </>
    </main>
  );
};

export default EditPost;
