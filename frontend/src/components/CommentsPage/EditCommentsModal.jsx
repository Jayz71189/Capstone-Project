import { csrfFetch } from "../../store/csrf";
import { useEffect, useState } from "react";
import "./CommentsPage.css";

function EditCommentsModal({ commentId }) {
  const [comment, setComment] = useState({});
  const [updatedComment, setUpdatedComment] = useState("");

  useEffect(() => {
    fetch(`/api/comments/${commentId}`)
      .then((res) => res.json())
      .then((data) => {
        setComment(data);
        setUpdatedComment(data.comment);
      })
      .catch((error) => {
        console.error("Error fetching comment:", error);
      });
  }, [commentId]);

  const handleInput = (event) => {
    setUpdatedComment(event.target.value);
  };

  const handleUpdate = () => {
    csrfFetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: updatedComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComment(data);
      });
  };

  return (
    <div id="edit_comment_modal" key={comment.id}>
      <h2>Comment</h2>
      <form onSubmit={handleUpdate}>
        <textarea value={updatedComment} onChange={handleInput} />
        <div className="edit_button_box">
          <button className="edit_button" type="submit">
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCommentsModal;
