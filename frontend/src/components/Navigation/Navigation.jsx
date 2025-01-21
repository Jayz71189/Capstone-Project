// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import CreateGiftModal from "../CreateGiftModal/CreateGiftModal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

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
          <img src="/png.webp" alt="App Logo" className="logo-img" />
        </NavLink>
      </div>
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

      {isLoaded && (
        <li className="profile-list">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
