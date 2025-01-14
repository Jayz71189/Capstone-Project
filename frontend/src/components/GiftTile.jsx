// import { useNavigate } from "react-router-dom";
import "./GiftTile.css"; // Add styling for individual tiles
import { useNavigate } from "react-router-dom";

const GiftTile = ({ gift }) => {
  const { id, name, quantity, description, price, GiftImages } = gift;

  const navigate = useNavigate();

  // previewImage =
  //   spot.SpotImages.find((image) => image.preview)?.url || "default-image.jpg";

  if (!gift) {
    return <div>Error: Gift data is undefined</div>;
  }

  const handleTileClick = () => {
    navigate(`/gifts/${id}`); // Navigate to the spot's detail page
  };

  const thumbnailUrl = GiftImages?.[0]?.url || "placeholder-image-url.jpg";

  console.log(GiftImages);

  return (
    <div
      className="gift-tile"
      title={gift.name}
      onClick={handleTileClick}
      style={{ cursor: "pointer" }}
    >
      <img src={thumbnailUrl} alt={name} />
      <div className="gift-info">
        <h3>{name}</h3>
        <p>{`${description}`}</p>
        <p>{`Quantity Requested: ${quantity}`}</p>
        <p>{`$${price} / item`}</p>

        <p>
          {/* Star Rating with Icon
          <div className="button-info">
            <i className="fa fa-star" aria-hidden="true"></i>{" "}
            {avgRating === null
              ? "New"
              : `${parseFloat(Number(avgRating)).toFixed(1)} stars`}
          </div> */}
        </p>
      </div>
    </div>
  );
};

export default GiftTile;
