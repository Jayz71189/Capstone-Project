import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";
import "./CommentsPage.css";

function DeleteCommentsModal({ commentId, refreshComments }) {
  const [comment, setComment] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    fetch(`/api/comments/${commentId}`)
      .then((res) => res.json())
      .then((data) => {
        setComment(data);
      })
      .catch((error) => {
        console.error("Error fetching comment:", error);
      });
  }, [commentId]);

  const handleDelete = () => {
    csrfFetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    })
      .then(() => {
        refreshComments();
      })
      .then(closeModal());
  };

  return (
    <div>
      <div id="delete_comment_modal">
        <h3>Delete comment?</h3>
        <p style={{ marginTop: "-5px" }}>{comment.comment}</p>
        <div className="button_container_delete">
          <button className="delete_button" onClick={handleDelete}>
            Yes, Delete
          </button>
          <button className="cancel_button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCommentsModal;
