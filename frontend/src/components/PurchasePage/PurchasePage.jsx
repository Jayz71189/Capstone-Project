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
      .then((data) => setPurchases(data.purchases))
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
      .then((data) => setPurchases(data.purchases))
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
      <h1 style={{ marginLeft: "2.5px" }}>Follows</h1>
      <div className="purchases">
        {purchases.length === 0 ? (
          <p>You are not following any users.</p>
        ) : (
          purchases.reverse().map((purchase) => {
            return (
              <div key={purchase.id} className="purchase_div">
                <div>
                  <a href={`/${purchase.purchase_username}`} id="user_tag">
                    {follow.purchase_username}
                  </a>
                </div>
                <div className="purchase-modal_">
                  <OpenModalMenuItem
                    itemText="Manage"
                    modalComponent={
                      <PurchaseModal
                        purchaseId={purchase.id}
                        userId={purchase.purchase_id}
                        ispurchased={true}
                        refreshFollows={refreshPurchases}
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
