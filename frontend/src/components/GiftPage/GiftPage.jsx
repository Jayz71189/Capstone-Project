import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkLoadLikes } from "../../store/likes";
import LikeModal from "../LikeModal/LikeModal";
import CommentsModal from "../CommentsModal/CommentsModal";
import GiftModal from "../GiftModal/GiftModal";
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import "./GiftPage.css";

function GiftPage() {
  const [gift, setGift] = useState([]);
  const [errors, setErrors] = useState();
  const [fillHeart, setFillHeart] = useState("");
  const { setModalContent, closeModal } = useModal();
  const [users, setUsers] = useState();
  const dispatch = useDispatch();
  const giftId_object = useParams();
  const giftId = giftId_object.giftId;
  const likes = useSelector((state) => state.likes);
  const sessionUser = useSelector((state) => state.session.user);
  const like = Object.values(likes).find((like) => like.giftId === gift.id);
  const isLiked = !!like;
  const likeId = like?.id || null;
  const likeNote = like?.note || "";

  useEffect(() => {
    fetch(`/api/gifts/${giftId}`)
      .then((res) => res.json())
      .then((data) => setGift(data))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    dispatch(thunkLoadLikes());
  }, [giftId, dispatch]);

  const refreshGifts = async () => {
    fetch(`/api/gifts/${giftId}`)
      .then((res) => res.json())
      .then((data) => setGift(data))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
    dispatch(thunkLoadLikes());
  };

  useEffect(() => {
    fetch("/api/users/others")
      .then((res) => res.json())
      .then((data) => setUsers(data.Users))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
  }, [sessionUser, errors]);

  const fill_heart = (giftId) => {
    setFillHeart((prev) => ({
      ...prev,
      [giftId]: !prev[giftId],
    }));
  };

  const heart = (giftId) => (fillHeart[giftId] ? <FaHeart /> : <FaRegHeart />);

  const openLikesModal = () => {
    setModalContent(
      <LikeModal
        giftId={gift.id}
        isLiked={isLiked}
        likeId={likeId}
        existingNote={likeNote}
        closeModal={closeModal}
      />
    );
  };

  const openCommentModal = () => {
    setModalContent(<CommentsModal giftId={gift.id} closeModal={closeModal} />);
  };

  const openGiftModal = () => {
    setModalContent(
      <GiftModal
        giftId={gift.id}
        existingName={gift.name}
        existingDescription={gift.description}
        exisitngQuanity={gift.quantity}
        existingPrice={gift.price}
        existingPreviewImage={gift.previewImage}
        closeModal={closeModal}
        refreshGifts={refreshGifts}
      />
    );
  };

  const handleUser = () => {
    const user = users?.find((user) => user.id === gift.user_id);
    if (user) {
      return user.username;
    }
  };

  return (
    <div className="gift_section">
      <section className="gift_section_2">
        <picture className="gift_picture">
          <div className="user_info">
            {" "}
            {handleUser()}
            {sessionUser && sessionUser.id === gift.user_id && (
              <div className="comment_dots_container">
                <div
                  className="comment_dots"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGiftModal();
                  }}
                >
                  <PiDotsThreeOutlineFill />
                </div>
              </div>
            )}
          </div>
          <img
            src={gift.GiftImages?.at(-1)?.url}
            alt={gift.description}
            className="post_img"
          />
          <div className="added_info_container">
            <div className="gift_description">{gift.description}</div>
            <div className="likes_container">
              <div
                className="heart_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  fill_heart(gift.id);
                  {
                    openLikesModal();
                  }
                }}
              >
                {heart(gift.id)}
              </div>
              <div className="likes_count">{gift.likes}</div>
            </div>
            <div className="comment_container">
              <div
                className="comment_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  openCommentModal();
                }}
              >
                <FaRegCommentDots />
              </div>
              <div className="comment_count">{gift.comment_count}</div>
            </div>
          </div>
        </picture>
      </section>
    </div>
  );
}
export default GiftPage;
