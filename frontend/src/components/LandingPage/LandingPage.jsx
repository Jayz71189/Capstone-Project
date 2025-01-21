import { useEffect, useState } from "react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { useDispatch } from "react-redux";
// import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
// import { PiDotsThreeOutlineFill } from "react-icons/pi";
// import { thunkLoadLikes } from "../../redux/likes";
// import { thunkLoadPurchase } from "../../store/purchases";
// import LikeModal from "../LikeModal/LikeModal";
// import CommentsModal from "../CommentsModal/CommentsModal";
// import PurchaseModal from "../PurchaseModal/PurchaseModal";
import GiftTile from "../GiftTile";
// import SignupFormModal from "../SignupFormModal/SignupFormModal";
// import LoginFormModal from "../LoginFormModal/LoginFormModal";
// import GiftModal from "../GiftModal/GiftModal";
import { useModal } from "../../context/Modal";
import { thunkCreateGift } from "../../store/gifts";
import "./LandingPage.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateGiftsModal from "../CreateGiftModal/CreateGiftModal";

function LandingPage() {
  const [gifts, setGifts] = useState([]);
  // const [sessionGifts, setSessionGifts] = useState([]);
  //   const [users, setUsers] = useState();
  const [errors, setErrors] = useState();
  //   const [view, setView] = useState("all");
  //   const [fillHeart, setFillHeart] = useState("");
  //   const [isActive, setIsActive] = useState("all");
  //   const { setModalContent, closeModal } = useModal();
  const { closeModal } = useModal();
  //   const navigate = useNavigate();
  const dispatch = useDispatch();
  const giftList = useSelector((state) => Object.values(state.gifts));
  // const sessionUser = useSelector((state) => state.session.user);
  //   const likes = useSelector((state) => state.likes);
  // const purchases = useSelector((state) => state.purchases);

  useEffect(() => {
    fetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data.Gifts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
    //   // dispatch(thunkLoadFollows());
    //   // dispatch(thunkLoadLikes());
  }, [errors, dispatch, closeModal]);

  useEffect(() => {
    dispatch(thunkCreateGift());
  }, [dispatch]);

  const refreshGifts = async () => {
    fetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data.Gifts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
    // dispatch(thunkLoadPurchase());
    // dispatch(thunkLoadLikes());
    dispatch, closeModal;
  };

  // useEffect(() => {
  //   fetch(`/api/gifts/${giftId}/purchases`)
  //     .then((res) => res.json())
  //     .then((data) => setSessionGifts(data.Gifts))
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //         console.log(errors);
  //       }
  //     });
  // }, [sessionUser, errors, closeModal]);

  //   useEffect(() => {
  //     fetch("/api/users/others")
  //       .then((res) => res.json())
  //       .then((data) => setUsers(data.Users))
  //       .catch(async (res) => {
  //         const data = await res.json();
  //         if (data && data.errors) {
  //           setErrors(data.errors);
  //           console.log(errors);
  //         }
  //       });
  //   }, [sessionUser, errors, closeModal]);

  //   const switchView = (viewType) => {
  //     setView(viewType);
  //     setIsActive(viewType);
  //   };

  //   const fill_heart = (giftId) => {
  //     setFillHeart((prev) => ({
  //       ...prev,
  //       [giftId]: !prev[giftId],
  //     }));
  //   };

  //   const OpenSignupFormModal = () => {
  //     setModalContent(<SignupFormModal closeModal={closeModal} />);
  //   };

  //   const OpenLoginFormModal = () => {
  //     setModalContent(<LoginFormModal closeModal={closeModal} />);
  //   };

  //   const heart = (giftId) => (fillHeart[giftId] ? <FaHeart /> : <FaRegHeart />);

  //   const display = sessionUser ? (view === "all" ? gifts : sessionGifts) : gifts;

  console.log("gift");
  console.log(gifts);
  console.log("giftList");
  console.log(giftList);
  // console.log("giftList");
  // console.log(giftList);

  return (
    <div className="landing-page">
      {Array.isArray(gifts) && gifts.length > 0 ? (
        gifts.map((gift) => (
          <GiftTile key={gift.id} gift={gift} refreshGifts={refreshGifts} />
        ))
      ) : (
        <div>No gifts available</div>
      )}
      <div className="modal">
        <OpenModalMenuItem
          itemText="Create Gift"
          modalComponent={
            <CreateGiftsModal giftId={gifts.id} refreshGifts={refreshGifts} />
          }
        />
      </div>
    </div>

    //     <>
    //       <h1>Gifts</h1>
    //       {gifts?.map(({ id, gift }) => (
    //         <p key={id}>{gift}</p>
    //       ))}
    //       <h1>Gift Lists</h1>
    //       {giftList?.map(({ id, gift }) => (
    //         <p key={id}>{gift}</p>
    //       ))}
    //     </>
  );
}

//   return (
//     <div className="gifts_section">
//       <section className="gifts_section_2">
//         {sessionUser && (
//           <div className="landing_page_button_container">
//             <div
//               className={`landing_page_button ${
//                 isActive === "all" ? "active" : ""
//               }`}
//               onClick={() => switchView("all")}
//             >
//               All Gifts
//             </div>
//             <div
//               className={`landing_page_button ${
//                 isActive === "following" ? "active" : ""
//               }`}
//               onClick={() => switchView("following")}
//             >
//               Following
//             </div>
{
  /* </div>
        )}
        {display.length === 0 ? (
          <p
            style={{
              width: "695px",
              fontFamily: "Sour Gummy",
              marginLeft: "10%",
              color: "white",
            }}
          >
            No posts to display
          </p>
        ) : (
          [...display].map((post) => {
            const like = Object.values(likes).find(
              (like) => like.post_id === post.id
            );
            const isLiked = !!like;
            const likeId = like?.id || null;
            const likeNote = like?.note || "";

            const follow = follows[post.user_id];
            const isFollowing = !!follow;
            const followId = follow?.id || null;
            const followNote = follow?.note || "";

            const handleClick = () => {
              if (sessionUser && sessionUser.id === post.id) {
                navigate(`/posts/${post.id}`);
              } else if (sessionUser && sessionUser.id !== post.id) {
                navigate("/");
              } else {
                (e) => e.stopPropagation();
                OpenSignupFormModal();
              }
            };
            const handleUser = () => {
              const user = users?.find((user) => user.id === post.user_id);
              if (user) {
                return user.username;
              }
            };

            const handleHeartIcon = () => {
              if (sessionUser) {
                fill_heart(post.id);
                openLikesModal();
              } else OpenLoginFormModal();
            };

            const handleCommentIcon = () => {
              if (sessionUser) {
                openCommentModal();
              } else OpenLoginFormModal();
            }; */
}

// const openLikesModal = () => {
//   setModalContent(
//     <LikeModal
//       postId={post.id}
//       isLiked={isLiked}
//       likeId={likeId}
//       existingNote={likeNote}
//       closeModal={closeModal}
//     />
//   );
// };

// const openCommentModal = () => {
//   setModalContent(
//     <CommentsModal postId={post.id} closeModal={closeModal} />
//   );
// };

// const openFollowModal = () => {
//   setModalContent(
//     <FollowModal
//       postId={post.id}
//       userId={post.user_id}
//       isFollowing={isFollowing}
//       followId={followId}
//       existingNote={followNote}
//       closeModal={closeModal}
//     />
//   );
// };

//             const openGiftModal = () => {
//               setModalContent(
//                 <GiftModal
//                   giftId={gift.id}
//                   existingName={gift.name}
//                   existingDescription={gift.description}
//                   existingQuantity={gift.quantity}
//                   existingPrice={gift.price}
//                   closeModal={closeModal}
//                   refreshGifts={refreshGifts}
//                 />
//               );
//             };

//             return (
//               <picture key={post.id} className="post_container">
//                 <div className="user_info">
//                   {handleUser()}{" "}
//                   {sessionUser && sessionUser.id !== post.user_id && (
//                     <div
//                       className="follow_text"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         {
//                           openFollowModal();
//                         }
//                       }}
//                     >
//                       {isFollowing ? "Following" : "Follow"}
//                     </div>
//                   )}
//                   {sessionUser && sessionUser.id === post.user_id && (
//                     <div className="comment_dots_container">
//                       <div
//                         className="comment_dots"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openPostModal();
//                         }}
//                       >
//                         <PiDotsThreeOutlineFill />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <img
//                   src={post.image}
//                   alt={post.description}
//                   className="posts_img"
//                   onClick={handleClick}
//                 />
//                 <div className="added_info_div">
//                   <div className="description">{post.description}</div>
//                   <div className="likes_container">
//                     <div
//                       className="heart_icon"
//                       onClick={() => handleHeartIcon()}
//                     >
//                       {heart(post.id)}
//                     </div>
//                     <div className="likes_count">{post.likes}</div>
//                   </div>
//                   <div className="comment_container">
//                     <div
//                       className="comment_icon"
//                       onClick={() => handleCommentIcon()}
//                     >
//                       <FaRegCommentDots />
//                     </div>
//                     <div className="comment_count">{post.comment_count}</div>
//                   </div>
//                 </div>
//               </picture>
//             );
//           })
//         )}
//       </section>
//     </div>
//   );
// }
export default LandingPage;
