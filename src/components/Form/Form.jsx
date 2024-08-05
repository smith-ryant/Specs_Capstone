// src/components/Form/Form.jsx

import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import AuthContext from "../../store/authContext";
import "./Form.css";

const Form = () => {
  const { state } = useContext(AuthContext);
  const editorRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); // State for privacy status

  // Initial new post structure
  const initialNewPost = {
    title: "New Note",
    content: "## New Note\nAdd your content here...",
    privateStatus: false, // Default to public
    userId: state.userId, // Attach current user
  };

  useEffect(() => {
    if (!state.userId) {
      console.error("User ID is not defined.");
      return;
    }

    axios
      .get(`/userposts/${state.userId}`, {
        headers: { authorization: `Bearer ${state.token}` },
      })
      .then((response) => {
        setPosts(response.data);
        console.log("Fetched posts:", response.data);
      })
      .catch((err) => console.error("Error fetching user posts:", err));
  }, [state.userId, state.token]);

  useEffect(() => {
    if (selectedPost) {
      setEditorContent(selectedPost.content);
      setIsPrivate(selectedPost.privateStatus);
    }
  }, [selectedPost]);

  useEffect(() => {
    if (editorRef.current && selectedPost) {
      setTimeout(() => {
        const codemirrorInstance = editorRef.current.codemirror;
        if (codemirrorInstance) {
          codemirrorInstance.focus();
        }
      }, 100); // Focus editor after selection
    }
  }, [selectedPost]);

  // Function to handle note selection
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsPrivate(post.privateStatus);
  };

  // Function to handle editor content change
  const handleEditChange = (newContent) => {
    setEditorContent(newContent);
  };

  // Function to save changes to a note
  const handleSave = () => {
    if (!selectedPost) return;

    axios
      .put(
        `/posts/${selectedPost.id}`,
        { content: editorContent, privateStatus: isPrivate },
        {
          headers: { authorization: `Bearer ${state.token}` },
        }
      )
      .then(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === selectedPost.id
              ? { ...post, content: editorContent, privateStatus: isPrivate }
              : post
          )
        );
        alert("Post updated successfully!");
      })
      .catch((err) => console.log(err));
  };

  // Function to prepare a new note
  const handleNewNote = () => {
    const newPost = {
      ...initialNewPost,
      title: "New Note " + (posts.length + 1), // Ensure unique title
    };

    setSelectedPost(newPost); // Set the new post as selected
    setEditorContent(newPost.content); // Set editor content
    setIsPrivate(newPost.privateStatus); // Set privacy status

    console.log("Prepared new post:", newPost);

    // Focus on the editor after adding a new note
    setTimeout(() => {
      if (editorRef.current) {
        const codemirrorInstance = editorRef.current.codemirror;
        if (codemirrorInstance) {
          codemirrorInstance.focus();
        }
      }
    }, 100);
  };

  // Function to save a new note
  const saveNewNote = () => {
    axios
      .post("/posts", selectedPost, {
        headers: { authorization: `Bearer ${state.token}` },
      })
      .then((response) => {
        console.log("Post added:", response.data);
        setPosts([response.data[0], ...posts]); // Add to post list
        setSelectedPost(response.data[0]); // Set the saved post as selected
        setEditorContent(response.data[0].content); // Update editor content
        alert("New post created successfully!");
      })
      .catch((err) => console.error("Error adding post:", err));
  };

  // Function to toggle note privacy
  const handleTogglePrivacy = () => {
    if (!selectedPost) return;

    const updatedStatus = !isPrivate;
    setIsPrivate(updatedStatus);

    if (selectedPost.id) {
      // Update existing post
      axios
        .put(
          `/posts/${selectedPost.id}`,
          { privateStatus: updatedStatus },
          {
            headers: { authorization: `Bearer ${state.token}` },
          }
        )
        .then(() => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === selectedPost.id
                ? { ...post, privateStatus: updatedStatus }
                : post
            )
          );
          alert(
            `Post has been ${updatedStatus ? "made private" : "made public"}!`
          );
        })
        .catch((err) => console.log(err));
    } else {
      // If new post, just update local state
      setSelectedPost({ ...selectedPost, privateStatus: updatedStatus });
    }
  };

  // Function to delete a note
  const handleDeleteNote = () => {
    if (!selectedPost) return;

    if (selectedPost.id) {
      // Delete existing post
      axios
        .delete(`/posts/${selectedPost.id}`, {
          headers: { authorization: `Bearer ${state.token}` },
        })
        .then(() => {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== selectedPost.id)
          );
          setSelectedPost(null);
          alert("Post deleted successfully!");
        })
        .catch((err) => console.log(err));
    } else {
      // If it's a new post, just clear the selection
      setSelectedPost(null);
      alert("New post creation cancelled.");
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar with Note List */}
      <div className="sidebar">
        <button className="add-note-btn" onClick={handleNewNote}>
          Create New Note
        </button>
        <h2>Available Notes</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li
              key={post.id}
              className="post-list-item"
              onClick={() => handlePostClick(post)}
            >
              {post.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Column for Note Viewing */}
      <div className="note-viewer">
        {selectedPost ? (
          <>
            <div className="button-group">
              <button className="form-btn" onClick={handleTogglePrivacy}>
                {isPrivate ? "Make Public" : "Make Private"}
              </button>
              <button
                className="form-btn delete-btn"
                onClick={handleDeleteNote}
              >
                Delete Note
              </button>
            </div>
            <h2>{selectedPost.title}</h2>
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            {/* Add a save button if it's a new note */}
            {!selectedPost.id && (
              <button className="form-btn" onClick={saveNewNote}>
                Save New Note
              </button>
            )}
          </>
        ) : (
          <p>Select a note to view its content.</p>
        )}
      </div>

      {/* Right Column for Note Editing */}
      <div className="note-editor">
        {selectedPost ? (
          <>
            <h2>Edit Note</h2>
            <SimpleMDE
              getMdeInstance={(instance) => {
                editorRef.current = instance;
              }}
              value={editorContent}
              onChange={handleEditChange}
              options={{
                spellChecker: false,
                autofocus: true,
                placeholder: "Edit your markdown content here...",
              }}
            />
            <button className="form-btn" onClick={handleSave}>
              Save Changes
            </button>
          </>
        ) : (
          <p>Select a note to edit its content.</p>
        )}
      </div>
    </div>
  );
};

export default Form;
