import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AnimatedCard = ({ title, value, link }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const increment = value / (duration / 10);

    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <Link to={link} className="block">
      <div className="bg-gray-800 text-white p-4 shadow rounded text-center hover:bg-gray-700 transition">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-2xl">{displayValue}</p>
      </div>
    </Link>
  );
};

export default AnimatedCard;