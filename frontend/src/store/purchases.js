const LOAD_PURCHASES = "purchases/LOAD_PURCHASES";
const ADD_PURCHASES = "purchases/ADD_PURCHASES";
const UPDATE_PURCHASES = "purchases/UPDATE_PURCHASES";
const DELETE_PURCHASES = "purchases/DELETE_PURCHASES";

const loadPurchase = (purchases) => ({
  type: LOAD_PURCHASES,
  payload: purchases,
});

const addPurchase = (purchase) => ({
  type: ADD_PURCHASES,
  payload: purchase,
});

const updatePurchase = (purchase) => ({
  type: UPDATE_PURCHASES,
  payload: purchase,
});

const deletePurchase = (giftId) => ({
  type: DELETE_PURCHASES,
  payload: giftId,
});

export const thunkLoadPurchase = () => async (dispatch) => {
  const response = await fetch("/api/purchases/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadPurchase(data.purchases));
  } else {
    console.error("Failed to load purchases.");
  }
};

export const thunkAddPurchase =
  (userId, note = "") =>
  async (dispatch) => {
    const response = await fetch(`/api/purchases/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addPurchase(data));
      return null;
    } else {
      const errors = await response.json();
      return errors;
    }
  };

export const thunkUpdatePurchase = (userId, note) => async (dispatch) => {
  const response = await fetch(`/api/purchases/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updatePurchase(data));
    return null;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkDeletePurchase = (userId) => async (dispatch) => {
  const response = await fetch(`/api/purchases/${userId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deletePurchase(userId));
  } else {
    console.error("Failed to unfollow.");
  }
};

const initialState = {};

const purchasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PURCHASES: {
      const purchases = {};
      action.payload.forEach(
        (purchase) => (purchases[purchase.giftId] = purchase)
      );
      return purchases;
    }
    case ADD_PURCHASES:
      return { ...state, [action.payload.giftId]: action.payload };
    case UPDATE_PURCHASES:
      return { ...state, [action.payload.giftId]: action.payload };
    case DELETE_PURCHASES: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default purchasesReducer;
