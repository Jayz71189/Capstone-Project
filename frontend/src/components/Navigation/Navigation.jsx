// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CreateGiftModal from "../CreateGiftModal/CreateGiftModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      {sessionUser && (
        <OpenModalButton
          modalComponent={<CreateGiftModal />}
          buttonText="Create New Gift"
        />
      )}
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/likes">My Likes</NavLink>
      </li>
      <li>
        <NavLink to="/comments">My Comments</NavLink>
      </li>

      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
