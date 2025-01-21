import { csrfFetch } from "../store/csrf";

const CREATE_GIFT = "gifts/CREATE_GIFT";
const UPDATE_GIFT = "gifts/UPDATE_GIFT";
const DELETE_GIFT = "gifts/DELETE_GIFT";

const createGift = (gift) => ({
  type: CREATE_GIFT,
  payload: gift,
});

const updateGift = (gift) => ({
  type: UPDATE_GIFT,
  payload: gift,
});

const deleteGift = (giftId) => ({
  type: DELETE_GIFT,
  payload: giftId,
});

export const thunkCreateGift = (formData) => async (dispatch) => {
  try {
    const giftData = {
      name: formData.get("name"),
      description: formData.get("description"),
      quantity: formData.get("quantity"),
      price: formData.get("price"),
      previewImage: formData.get("previewImage"),
    };
    const response = await csrfFetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(giftData),
    });

    if (!response.ok) {
      const errors = await response.json();

      return errors;
    }

    const newGift = await response.json();
    dispatch(createGift(newGift));

    const giftId = newGift.id;
    const giftImageResponse = await csrfFetch(`/api/gifts/${giftId}/images`, {
      method: "POST",
      body: JSON.stringify({ url: giftData.previewImage, preview: true }),
    });

    if (!giftImageResponse.ok) {
      const errors = await giftImageResponse.json();
      return errors;
    }
    const newGiftImage = await giftImageResponse.json();
    dispatch(createGift(newGiftImage));
    return { gift: newGift, image: newGiftImage };
  } catch (error) {
    console.error("Error creating gift or gift image:", error);
    return { errors: ["An unexpected error occurred."] };
  }
};

export const thunkUpdateGift =
  (giftId, name, description, price, quantity, previewImage) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/gifts/${giftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price,
          quantity,
          previewImage,
        }),
      });
      if (!response.ok) {
        const errors = await response.json();
        return errors;
      }

      const updatedGift = await response.json();
      dispatch(updateGift(updatedGift));

      const giftImageResponse = await csrfFetch(`/api/gifts/${giftId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: previewImage, preview: true }),
      });

      if (!giftImageResponse.ok) {
        const errors = await giftImageResponse.json();
        return errors;
      }
      const updatedGiftImage = await giftImageResponse.json();
      dispatch(updateGift(updatedGiftImage));
      return { gift: updatedGift, image: updatedGiftImage };
      // return null;
    } catch (error) {
      console.error("Error updating gift or gift image:", error);
      return { errors: ["An unexpected error occurred."] };
    }
  };

export const thunkDeleteGift = (giftId) => async (dispatch) => {
  const response = await csrfFetch(`/api/gifts/${giftId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteGift(giftId));
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = { gifts: [] };

const giftsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GIFT: {
      return { ...state, gifts: [action.payload, ...state.gifts] };
    }

    case UPDATE_GIFT: {
      const updatedGifts = state.gifts.map((gift) =>
        gift.id === action.payload.id ? { ...gift, ...action.payload } : gift
      );
      return { ...state, gifts: updatedGifts };
    }

    case DELETE_GIFT: {
      const filteredGifts = state.gifts.filter(
        (gift) => gift.id !== action.payload
      );
      return { ...state, gifts: filteredGifts };
    }

    default:
      return state;
  }
};

export default giftsReducer;
