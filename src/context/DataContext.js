import { createContext, useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch from "../hooks/useAxiosFetch";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/posts";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch(
    "http://localhost:3500/posts"
  );

  const navigate = useNavigate();

  useEffect(() => {
    setPosts(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = {
      id: id,
      title: postTitle,
      datetime: datetime,
      body: postBody,
    };
    try {
      const response = await api.post("/posts", newPost);
      const updatedPosts = [...posts, response.data];
      setPosts(updatedPosts);

      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    const datetime = format(new Date(), "MMMM dd,yyyy pp");
    const updatedPost = {
      id,
      title: editTitle,
      datetime,
      body: editBody,
    };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const newPosts = posts.filter((post) => post.id !== id);
      setPosts(newPosts);
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  return (
    <DataContext.Provider
      value={{
        width,
        search,
        postTitle,
        editTitle,
        editBody,
        postBody,
        posts,
        searchResults,
        fetchError,
        isLoading,
        setSearch,
        setPostTitle,
        setPostBody,
        setEditTitle,
        setEditBody,
        handleSubmit,
        handleDelete,
        handleEdit,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
