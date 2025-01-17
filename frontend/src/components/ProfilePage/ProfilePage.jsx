import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkLoadLikes } from "../../store/likes";
import LikeModal from "../LikeModal/LikeModal";
import CommentsModal from "../CommentsModal/CommentsModal";
import GiftModal from "../GiftModal/GiftModal";
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import "./ProfilePage.css";
function ProfilePage() {
  const [gifts, setGifts] = useState([]);
  const [errors, setErrors] = useState();
  const [fillHeart, setFillHeart] = useState("");
  const { setModalContent, closeModal } = useModal();
  const likes = useSelector((state) => state.likes);
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/gifts/current")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => setGifts(data.Gifts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
    dispatch(thunkLoadLikes());
  }, [errors, dispatch]);

  const refreshGifts = async () => {
    fetch("/api/gifts/current")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => setGifts(data.Gifts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
    dispatch(thunkLoadLikes());
  };

  const fill_heart = (giftId) => {
    setFillHeart((prev) => ({
      ...prev,
      [giftId]: !prev[giftId],
    }));
  };

  const heart = (giftId) => (fillHeart[giftId] ? <FaHeart /> : <FaRegHeart />);

  return (
    <div className="gifts_section_4">
      <section className="gifts_section_3">
        <div id="h1_container">
          <h1 id="h1">{sessionUser.username}&apos;s profile</h1>
        </div>
        {gifts.length === 0 ? (
          <p id="no_gifts">You do not have any gifts.</p>
        ) : (
          [...gifts].reverse().map((gift) => {
            const like = Object.values(likes).find(
              (like) => like.gift_id === gift.id
            );
            const isLiked = !!like;
            const likeId = like?.id || null;
            const likeNote = like?.note || "";

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
              setModalContent(
                <CommentsModal giftId={gift.id} closeModal={closeModal} />
              );
            };

            const openGiftModal = () => {
              setModalContent(
                <GiftModal
                  giftId={gift.id}
                  existingName={gift.name}
                  existingDescription={gift.description}
                  closeModal={closeModal}
                  refreshGifts={refreshGifts}
                  existingQuantity={gift.quantity}
                  existingPrice={gift.price}
                />
              );
            };

            return (
              <picture key={gift.id} className="gift_container">
                <div className="user_info">
                  {sessionUser.username}
                  <div
                    className="manage_gift_icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGiftModal();
                    }}
                  >
                    <PiDotsThreeOutlineFill />
                  </div>
                </div>
                <img
                  src={gift.GiftImages?.[0]?.url}
                  alt={gift.description}
                  className="gifts_img"
                  onClick={() => navigate(`/gifts/${gift.id}`)}
                />
                <div className="added_info_div">
                  <div className="description">{gift.description}</div>
                  <div className="manage_gift_container"></div>
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
            );
          })
        )}
      </section>
    </div>
  );
}
export default ProfilePage;
