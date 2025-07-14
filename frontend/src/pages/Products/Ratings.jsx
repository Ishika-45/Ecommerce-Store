import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const safeValue = Number(value); // convert to number in case it's a string
  const rating = isNaN(safeValue) ? 0 : Math.max(0, Math.min(safeValue, 5));

  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`text-${color} ml-1`} />
      ))}

      {halfStars === 1 && (
        <FaStarHalfAlt className={`text-${color} ml-1`} />
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`text-${color} ml-1`} />
      ))}

      <span className={`rating-text ml-2 text-${color}`}>
        {text && text}
      </span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
