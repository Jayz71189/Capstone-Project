// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { useNavigate } from "react-router-dom";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { useModal } from "../../context/Modal";
// import CreateGiftModal from "../CreateGiftModal/CreateGiftModal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  return (
    <ul>
      {/* <div className="session-user">
        {sessionUser && (
          <OpenModalButton
            modalComponent={<CreateGiftModal />}
            buttonText="Create New Gift"
          />
        )}
      </div> */}

      <div className="logo">
        <NavLink to="/">
          <img
            onClick={() => navigate("/")}
            src="/png.webp"
            alt="App Logo"
            className="logo-img"
          />
        </NavLink>
      </div>
      {/* Logged-out View */}
      {!sessionUser ? (
        <div className="auth-links">
          <li onClick={() => setModalContent(<LoginFormModal />)}>
            {" "}
            &nbsp; Log In
          </li>
          <li onClick={() => setModalContent(<SignupFormModal />)}>
            {" "}
            &nbsp; Sign Up
          </li>
        </div>
      ) : (
        <div className="nav-bar">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/likes">My Likes</NavLink>
          </li>
          <li>
            <NavLink to="/comments">My Comments</NavLink>
          </li>
          <li>
            <NavLink to="/profile">My Profile</NavLink>
          </li>
          <li>
            <NavLink to="/purchases">My Purchases</NavLink>
          </li>
        </div>
      )}

      {isLoaded && (
        <li className="profile-list">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
