import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateGift } from "../../store/gifts";

import "./CreateGiftModal.css";

function CreateGiftModal({ refreshGifts }) {
  const [name, setName] = useState("");
  // const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    // formData.append("previewImage", previewImage);

    setLoading(true);

    const response = await dispatch(thunkCreateGift(formData))
      .then(() => {
        refreshGifts();
      })
      .then(closeModal());
    console.log("formData");
    console.log(formData);

    setLoading(false);

    if (!response.errors) {
      closeModal();
    } else {
      throw new Error("Failed to create gift.");
    }
  };

  return (
    <div id="create-gift-modal">
      <h2 style={{ fontFamily: "Sour Gummy" }}>Create a New Gift</h2>
      <form
        onSubmit={handleSubmit}
        className="form"
        encType="multipart/form-data"
      >
        <label style={{ fontFamily: "Sour Gummy" }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
            maxLength="50"
          />
        </label>
        {/* <label style={{ fontFamily: "Sour Gummy" }}>
          previewImage:
          <textarea
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label> */}
        <label style={{ fontFamily: "Sour Gummy" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
        <button
          type="submit"
          style={{ fontFamily: "Sour Gummy" }}
          disabled={loading}
        >
          {loading ? "Posting..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={closeModal}
          style={{ fontFamily: "Sour Gummy" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateGiftModal;
