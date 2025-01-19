import { useEffect, useState } from "react";
import "./PurchasePage.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PurchaseModal from "../PurchaseModal/PurchaseModal";

function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [errors, setErrors] = useState();

  useEffect(() => {
    fetch("/api/purchases/current")
      .then((res) => res.json())
      .then((data) => setPurchases(data.Purchases))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }, []);

  const refreshPurchases = () => {
    fetch("/api/purchases/current")
      .then((res) => res.json())
      .then((data) => setPurchases(data.Purchases))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
  };

  return (
    <div>
      <h1 style={{ marginLeft: "2.5px" }}>Purchases</h1>
      <div className="purchases">
        {purchases.length === 0 ? (
          <p>You do not have any purchases.</p>
        ) : (
          purchases.reverse().map((purchase) => {
            return (
              <div key={purchase.id} className="purchase_div">
                <div className="purchase_div1">{purchase.giftId} </div>
                <div className="purchase_div2">{purchase.quantity} </div>
                <div className="purchase_div3">{purchase.totalPrice} </div>
                <div>
                  <a href={`/${purchase.purchase_username}`} id="user_tag">
                    {purchase.purchase_username}
                  </a>
                </div>
                <div className="purchase-modal_">
                  <OpenModalMenuItem
                    itemText="Manage"
                    modalComponent={
                      <PurchaseModal
                        purchaseId={purchase.id}
                        giftId={purchase.giftId}
                        totalPrice={purchase.totalPrice}
                        ispurchased={true}
                        refreshPurchases={refreshPurchases}
                        existingNote={purchase.note}
                      />
                    }
                  />
                </div>
                <div className="noted">{purchase.note}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PurchasePage;
