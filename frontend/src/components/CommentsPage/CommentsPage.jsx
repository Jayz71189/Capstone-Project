import { useEffect, useState } from "react";
import "./CommentsPage.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditCommentsModal from "./EditCommentsModal";
import DeleteCommentsModal from "./DeleteCommentsModal";

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState();

  useEffect(() => {
    fetch("/api/comments/current")
      .then((res) => res.json())
      .then((data) => setComments(data.comments))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }, []);

  const refreshComments = () => {
    fetch("/api/comments/current")
      .then((res) => res.json())
      .then((data) => setComments(data.comments))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
  };

  console.log("comments");
  console.log(comments);

  return (
    <div>
      <h1>Comments</h1>
      <div className="purchases">
        {comments.length === 0 ? (
          <p>You have not made any comments.</p>
        ) : (
          comments.map((comment) => {
            return (
              <div key={comment.id} className="comment_div">
                <div className="comment">{comment.comment}</div>
                <div className="modal">
                  <OpenModalMenuItem
                    itemText="Edit"
                    modalComponent={
                      <EditCommentsModal commentId={comment.id} />
                    }
                  />
                </div>
                <div className="modal">
                  <OpenModalMenuItem
                    itemText="Delete"
                    modalComponent={
                      <DeleteCommentsModal
                        commentId={comment.id}
                        refreshComments={refreshComments}
                      />
                    }
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CommentsPage;
