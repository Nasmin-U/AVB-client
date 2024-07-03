import PropTypes from "prop-types";

const OptionCard = ({ title, onClick }) => {
  return (
    <div
      className="option-card bg-white p-8 shadow-lg rounded-lg cursor-pointer hover:bg-primary hover:text-white transition duration-300 ease-in-out transform hover:scale-105 w-64 text-center"
      onClick={onClick}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
};

OptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OptionCard;
