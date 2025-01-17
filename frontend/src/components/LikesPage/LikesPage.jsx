import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { thunkLoadLikes } from "../../store/likes";
import { thunkLoadPurchase } from "../../store/purchases";
import LikeModal from "../LikeModal/LikeModal";
import CommentsModal from "../CommentsModal/CommentsModal";
import PurchaseModal from "../PurchaseModal/PurchaseModal";
// import PostModal from '../PostModal/PostModal';
import { useModal } from "../../context/Modal";
import "./LikesPage.css";

function LikesPage() {
  const [likes, setLikes] = useState([]);
  const [errors, setErrors] = useState();
  const [fillHeart, setFillHeart] = useState("");
  const { setModalContent, closeModal } = useModal();
  const [purchaseStatus, setPurchaseStatus] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    fetch("/api/likes/current")
      .then((res) => res.json())
      .then((data) => setLikes(data.Likes))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });

    dispatch(thunkLoadPurchase());
    dispatch(thunkLoadLikes());
  }, [dispatch, errors]);

  const refreshLikes = async () => {
    fetch("/api/likes/current")
      .then((res) => res.json())
      .then((data) => setLikes(data.Likes))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });

    dispatch(thunkLoadPurchase());
    dispatch(thunkLoadLikes());
  };

  //   const refreshGifts = async () => {
  //     fetch("/api/likes/current")
  //       .then((res) => res.json())
  //       .then((data) => setLikes(data.likes))
  //       .catch(async (res) => {
  //         const data = await res.json();
  //         if (data && data.errors) {
  //           setErrors(data.errors);
  //           console.log(errors);
  //         }
  //       });

  //     dispatch(thunkLoadPurchase());
  //     dispatch(thunkLoadLikes());
  //   };

  const checkPurchaseStatus = async (giftId) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}/purchases`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching purchase status:", error);
      return { is_purchased: false, note: "" };
    }
  };

  useEffect(() => {
    const loadPurchaseStatus = async () => {
      const status = {};
      for (const like of likes) {
        const { is_purchased, note } = await checkPurchaseStatus(like.giftId);
        status[like.giftId] = { is_purchased, note };
      }
      setPurchaseStatus(status);
    };
    if (likes.length > 0) loadPurchaseStatus();
  }, [likes]);

  const fill_heart = (giftId) => {
    setFillHeart((prev) => ({
      ...prev,
      [giftId]: !prev[giftId],
    }));
  };

  const heart = (giftId) => (fillHeart[giftId] ? <FaHeart /> : <FaRegHeart />);

  const refreshPurchases = async () => {
    const updatedPurchaseStatus = {};
    for (const like of likes) {
      const { is_purchased, note } = await checkPurchaseStatus(
        like.poster_username
      );
      updatedPurchaseStatus[like.poster_username] = { is_purchased, note };
    }
    setPurchaseStatus(updatedPurchaseStatus);
  };

  const openPurchaseModal = (like) => {
    const userFollowStatus = purchaseStatus[like.poster_username] || {
      is_following: false,
      note: "",
    };
    setModalContent(
      <PurchaseModal
        userId={like.poster_id}
        isPurchased={userFollowStatus.is_purchased}
        existingNote={userFollowStatus.note}
        refreshPurchases={refreshPurchases}
      />
    );
  };

  return (
    <div className="posts_section_4">
      <section className="posts_section_3">
        <div className="h1_container">
          <h1 id="h1">Likes</h1>
        </div>
        {likes.length === 0 ? (
          <p id="no_posts">You have not liked any gifts.</p>
        ) : (
          [...likes].reverse().map((like) => {
            const openLikesModal = () => {
              setModalContent(
                <LikeModal
                  giftId={like.id}
                  isLiked={true}
                  likeId={like.id}
                  existingNote={like.note}
                  closeModal={closeModal}
                  refreshLikes={refreshLikes}
                />
              );
            };

            const openCommentModal = () => {
              setModalContent(
                <CommentsModal giftId={like.giftId} closeModal={closeModal} />
              );
            };

            // const openPostModal = () => {
            //     setModalContent(<PostModal postId={like.post_id} existingTitle={like.title} existingDescription={like.description} closeModal={closeModal} refreshPosts={refreshPosts} />)
            //   }

            const purchaseButton = purchaseStatus[like.poster_username]
              ?.is_purchased
              ? "Following"
              : "Purchase";

            return (
              <div key={like.gift} className="post_container">
                <div className="user_info">
                  <a
                    style={{ paddingRight: ".8%" }}
                    href={`/${like.poster_username}`}
                    id="user_a_tag"
                  >
                    {like.poster_username}
                  </a>
                  <div id="follow_me" onClick={() => openPurchaseModal(like)}>
                    {purchaseButton}
                  </div>
                </div>
                <img
                  onClick={() => navigate(`/gifts/${like.giftId}`)}
                  src={like.gift}
                  alt={like.description}
                  className="likes_img"
                />
                <div className="added_info_div">
                  <div className="description">{like.description}</div>
                  {/* {sessionUser && sessionUser.id === like.poster_id && (
                                        <div className='manage_like_container'>
                                        <div className='manage_like_icon' onClick={(e) => {e.stopPropagation();openPostModal()}}><FaCog /></div>
                                        </div>
                                    )} */}
                  <div className="likes_container">
                    <div
                      className="heart_icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        fill_heart(like.id);
                        openLikesModal();
                      }}
                    >
                      {heart(like.id)}
                    </div>
                    <div className="likes_count">{like.likes_count}</div>
                  </div>
                  <div className="note_container">
                    <div
                      className="note_icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCommentModal();
                      }}
                    >
                      <FaRegCommentDots />
                    </div>
                    <div className="note">{like.note}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

export default LikesPage;
