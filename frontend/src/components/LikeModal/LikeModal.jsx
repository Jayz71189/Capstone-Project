import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import {
  thunkAddLike,
  // thunkUpdateLike,
  thunkDeleteLike,
} from "../../store/likes";
import "./LikeModal.css";

function LikeModal({
  giftId,
  isLiked = false,
  likeId = null,
  existingNote = "",
  refreshLikes,
}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [errors, setErrors] = useState({});
  const [alreadyLikedMessage, setAlreadyLikedMessage] = useState("");

  useEffect(() => {
    if (isLiked && likeId) {
      fetch(`/api/${giftId}/likes`)
        .then((res) => res.json())
        .then((data) => {
          setNote(data.note);
        });
    }
  }, [isLiked, likeId, giftId]);

  // const handleInputChange = (event) => {
  //   setNote(event.target.value);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = await dispatch(
      thunkAddLike(giftId, note, setAlreadyLikedMessage)
    );
    if (errors) {
      setErrors(errors);
    } else {
      closeModal();
    }
  };

  // const handleUpdate = async () => {
  //   const errors = await dispatch(thunkUpdateLike(likeId, note));
  //   if (errors) {
  //     setErrors(errors);
  //   } else {
  //     closeModal();
  //     refreshLikes();
  //   }
  // };

  const handleUnlike = async () => {
    await dispatch(thunkDeleteLike(likeId));
    closeModal();
    refreshLikes();
  };

  // const setAlreadyLikedMessage = (message) => {
  //   alert(message); // Or set it to a state variable for display
  // };

  return (
    <div id="like-modal">
      <h2 style={{ marginBottom: "-.2%" }}>
        {isLiked ? "Edit Like" : "Like Gift"}
      </h2>
      {/* Display the already liked error message */}
      {alreadyLikedMessage && <p className="error">{alreadyLikedMessage}</p>}
      {/* General error handling */}
      {errors.error && <p className="error">{errors.error}</p>}
      <form onSubmit={handleSubmit}>
        {/* <label>
          Note:
          <textarea
            value={note}
            onChange={handleInputChange}
            placeholder="Add a note..."
          />
        </label> */}
        <div id="button_box">
          {!isLiked && (
            <button className="like_buttons" type="submit">
              Like
            </button>
          )}
          {isLiked && (
            <div>
              {/* <button
                className="like_buttons"
                type="button"
                onClick={handleUpdate}
              >
                Edit
              </button> */}
              <button
                className="like_buttons"
                type="button"
                onClick={handleUnlike}
              >
                Unlike
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default LikeModal;
