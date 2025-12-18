import React from 'react';

const ProfileInfoCard = ({ title, children }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left">{title}</h3>
      <div className="text-gray-700 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ProfileInfoCard;