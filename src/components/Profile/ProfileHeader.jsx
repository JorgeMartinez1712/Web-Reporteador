import React from 'react';

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow rounded-lg">
      <img
        src={user.profile_photo_url || 'https://via.placeholder.com/150'}
        alt="Foto de perfil"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
      <p className="text-gray-600 mt-1">{user.email}</p>
    </div>
  );
};

export default ProfileHeader;