import React from "react";
import useProfile from "../../hooks/useProfile";

export const ProfileView: React.FC = () => {
  const { profile, error } = useProfile();

  if (error) return <div>Error: {error}</div>;

  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <p>Gender: {profile.gender}</p>
      <p>
        Created At:{" "}
        {new Date(profile.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};
