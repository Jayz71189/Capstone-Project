import { csrfFetch } from "../store/csrf";

const LOAD_LIKES = "likes/LOAD_LIKES";
const ADD_LIKE = "likes/ADD_LIKE";
const UPDATE_LIKE = "likes/UPDATE_LIKE";
const DELETE_LIKE = "likes/DELETE_LIKE";

const loadLikes = (likes) => ({
  type: LOAD_LIKES,
  payload: likes,
});

const addLike = (like) => ({
  type: ADD_LIKE,
  payload: like,
});

const updateLike = (like) => ({
  type: UPDATE_LIKE,
  payload: like,
});

const deleteLike = (likeId) => ({
  type: DELETE_LIKE,
  payload: likeId,
});

export const thunkLoadLikes = () => async (dispatch) => {
  const response = await fetch("/api/likes/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadLikes(data.likes));
  } else {
    console.error("Failed to load likes.");
  }
};

export const thunkAddLike =
  (giftId, note = "") =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/gifts/${giftId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addLike(data));
      return null;
    } else {
      const errors = await response.json();
      return errors;
    }
  };

export const thunkUpdateLike = (likeId, giftId, note) => async (dispatch) => {
  const response = await csrfFetch(`/api/gifts/${giftId}/likes/${likeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateLike(data));
    return null;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkDeleteLike = (likeId, giftId) => async (dispatch) => {
  const response = await csrfFetch(`/api/gifts/${giftId}/likes/${likeId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteLike(likeId));
  } else {
    console.error("Failed to delete like.");
  }
};

const initialState = {};

const likesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_LIKES: {
      const likes = {};
      action.payload.forEach((like) => (likes[like.id] = like));
      return likes;
    }
    case ADD_LIKE:
      return { ...state, [action.payload.id]: action.payload };
    case UPDATE_LIKE:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_LIKE: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default likesReducer;
