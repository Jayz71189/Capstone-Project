import { csrfFetch } from "../../store/csrf";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import "./CommentsModal.css";

function CommentsModal({ giftId, refreshComments }) {
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { closeModal } = useModal();

  useEffect(() => {
    fetch(`/api/gifts/${giftId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data.Comments))
      .catch((error) => {
        console.error("Error fetching comments", error);
      });
  }, [giftId]);

  const displayedComments = showAllComments ? comments : comments.slice(0, 4);

  const createComment = () => {
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const payload = { comment: newComment };

    csrfFetch(`/api/gifts/${giftId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error creating comment:", data.error);
          return;
        }
        setComments((prevComments) => [data, ...prevComments]);
        setNewComment("");
      })
      .then(() => {
        refreshComments();
      })
      .then(closeModal())
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  return (
    <div id="comments">
      <h2 style={{ marginBottom: "-.5%" }}>Post Comment</h2>
      <div>
        <div className="comments_list">
          {displayedComments.map((comment) => {
            return (
              <div key={comment.id}>
                <p>{comment.username}</p>
                <p>{comment.comment}</p>
              </div>
            );
          })}

          {!showAllComments && comments.length > 4 && (
            <button onClick={() => setShowAllComments(true)}>
              Show all comments
            </button>
          )}
        </div>

        <div className="create_comment">
          <textarea
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write here..."
          />
        </div>
        <button className="comment_button" onClick={createComment}>
          Comment
        </button>
      </div>
    </div>
  );
}

export default CommentsModal;
