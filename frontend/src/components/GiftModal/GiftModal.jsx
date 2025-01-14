import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdateGift, thunkDeleteGift } from "../../store/gifts";

function GiftModal({
  giftId,
  existingName,
  existingDescription,
  refreshGifts,
  existingQuantity,
  existingPrice,
}) {
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [quantity, setQuantity] = useState(existingQuantity || "");
  const [price, setPrice] = useState(existingPrice || "");
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await dispatch(
      thunkUpdateGift(giftId, name, description, quantity, price)
    );
    if (errors) {
      alert("Error updating gift");
    } else {
      closeModal();
      refreshGifts();
    }
  };

  const handleDelete = async () => {
    const errors = await dispatch(thunkDeleteGift(giftId));
    if (errors) {
      alert("Error deleting gift");
    } else {
      closeModal();
      refreshGifts();
    }
  };

  return (
    <div id="create-gift-modal">
      <h2 style={{ fontFamily: "Sour Gummy" }}>Edit Gift</h2>
      <form onSubmit={handleSubmit} className="form">
        <label style={{ fontFamily: "Sour Gummy" }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="50"
            placeholder="Optional"
          />
        </label>
        <label style={{ fontFamily: "Sour Gummy" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Write your gift description here"
          />
        </label>
        <label style={{ fontFamily: "Sour Gummy" }}>
          Quantity:
          <textarea
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            placeholder="Quantity"
          />
        </label>
        <label style={{ fontFamily: "Sour Gummy" }}>
          Price:
          <textarea
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Price"
          />
        </label>
        <div>
          <button type="submit" style={{ fontFamily: "Sour Gummy" }}>
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{ fontFamily: "Sour Gummy" }}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default GiftModal;
