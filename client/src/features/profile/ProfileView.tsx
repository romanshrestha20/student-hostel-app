import React from "react";
import useProfile from "../../hooks/useProfile";

export const ProfileView: React.FC = () => {
  const { profile, error } = useProfile();

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="p-4 font-semibold text-red-500 rounded bg-red-50">
          Error: {error}
        </span>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="p-4 font-medium text-gray-500 rounded bg-gray-50">
          No profile found
        </span>
      </div>
    );

  return (
    <div className="flex flex-col items-center max-w-md p-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-4 bg-blue-100 rounded-full h-36 w-36">
        <span className="text-4xl font-bold text-blue-600">
          {profile.name.charAt(0)}
        </span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-800">{profile.name}</h1>
      <p className="mb-1 text-gray-600">
        <span className="font-semibold">Email:</span> {profile.email}
      </p>
      <p className="mb-1 text-gray-600">
        <span className="font-semibold">Role:</span> {profile.role}
      </p>
      <p className="mb-1 text-gray-600">
        <span className="font-semibold">Gender:</span> {profile.gender}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        <span className="font-semibold">Created At:</span>{" "}
        {new Date(profile.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Last Updated:</span>{" "}
        {new Date(profile.updatedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="m-4">
        <button className="px-4 py-2 m-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Edit Profile
        </button>
        <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Delete Profile
        </button>
      </div>
    </div>
  );
};
