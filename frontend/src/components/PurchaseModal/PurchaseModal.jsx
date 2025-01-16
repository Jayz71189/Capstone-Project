import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import {
  thunkAddPurchase,
  thunkUpdatePurchase,
  thunkDeletePurchase,
} from "../../store/purchases";
import "../PurchasePage/PurchasePage.css";

function PurchaseModal({
  userId,
  isPurchased = false,
  followId = null,
  existingNote = "",
  refreshPurchases,
}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isPurchased && followId) {
      fetch(`/api/follows/${followId}`)
        .then((res) => res.json())
        .then((data) => {
          setNote(data.note);
        });
    }
  }, [isPurchased, followId]);

  const handleInputChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = await dispatch(thunkAddPurchase(userId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal();
      refreshPurchases();
    }
  };

  const handleUpdate = async () => {
    const errors = await dispatch(thunkUpdatePurchase(userId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal();
      refreshPurchases();
    }
  };

  const handleUnpurchase = async () => {
    await dispatch(thunkDeletePurchase(userId));
    closeModal();
    refreshPurchases();
  };

  return (
    <div id="follow-modal">
      <h2>{isPurchased ? "Edit Purchase" : "Purchase Again?"}</h2>
      {errors.error && <p className="error">{errors.error}</p>}
      <form onSubmit={handleSubmit}>
        <label style={{ fontFamily: "Sour Gummy" }}>
          Add a Note:
          <textarea
            value={note}
            onChange={handleInputChange}
            placeholder="Write a note..."
          />
        </label>
        {!isPurchased && <button type="submit">Purchase</button>}
        {isPurchased && (
          <>
            <button type="button" onClick={handleUpdate}>
              Edit
            </button>
            <button type="button" onClick={handleUnpurchase}>
              Unfollow
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default PurchaseModal;
