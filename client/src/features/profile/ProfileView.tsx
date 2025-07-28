import React, { useState } from "react";
import useProfile from "../../hooks/useProfile";
import { Link } from "react-router-dom";
import AvatarUpload from "./AvatarUpload";

export const ProfileView: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const { profile, error } = useProfile();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="p-4 font-semibold text-red-500 bg-red-100 rounded">
          Error: {error}
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="p-4 text-gray-600 bg-gray-100 rounded">
          No profile found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-md px-6 py-8 mx-auto mt-10 bg-white border border-gray-200 shadow-xl rounded-2xl">
      <div className="mb-4">
        <AvatarUpload
          userId={profile.id}
          onUploadSuccess={(url) => setAvatarUrl(avatarUrl || url)}
        />
      </div>

      <h1 className="mb-2 text-2xl font-bold text-gray-800">{profile.name}</h1>

      <div className="space-y-1 text-gray-600">
        <p>
          <span className="font-semibold">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {profile.role}
        </p>
        <p>
          <span className="font-semibold">Gender:</span> {profile.gender}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Last Updated:</span>{" "}
          {new Date(profile.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          to="/edit-profile"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Edit Profile
        </Link>
        <Link
          to="/delete-profile"
          className="px-4 py-2 text-white bg-red-600 runded hover:bg-red-700"
        >
          Delete Profile
        </Link>
      </div>
    </div>
  );
};
