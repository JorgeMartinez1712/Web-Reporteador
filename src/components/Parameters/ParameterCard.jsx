import PropTypes from 'prop-types';

const ParameterCard = ({ title, description, iconClass, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-gray-300 p-6 flex items-center cursor-pointer transition-colors duration-300 transform hover:-translate-y-1 hover:border-emerald-500"
    >
      {iconClass && <i className={`${iconClass} text-5xl text-emerald-600 mr-4 flex-shrink-0`}></i>}
      <div className="flex flex-col text-left">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

ParameterCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default ParameterCard;