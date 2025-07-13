import React from "react";
import { useForm } from "react-hook-form";
import { SelectInput, TextInput } from "../../components/common";
import useProfile from "../../hooks/useProfile";
import type { User } from "../../types/user";
import { Link } from "react-router-dom"; // <- fix import

const EditProfileForm = () => {
  const { profile, handleEditProfile, message, error } = useProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      gender: profile?.gender,
    },
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        gender: profile.gender ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: User) => {
    if (!profile) return;

    const updates: Partial<User> = {};
    if (data.name !== profile.name) updates.name = data.name;
    if (data.email !== profile.email) updates.email = data.email;
    if (data.gender !== profile.gender) updates.gender = data.gender;

    if (Object.keys(updates).length === 0) return;

    handleEditProfile(profile.id, updates);
  };

  if (!profile)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="p-4 font-medium text-gray-500 rounded bg-gray-50">
          No profile found
        </span>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      {message && (
        <div className="mb-4 text-green-500">
          <span className="font-semibold">Success:</span> {message}
        </div>
      )}
      <Link
        to="/profile"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Back to Profile
      </Link>

      <h2 className="mb-4 text-xl font-semibold text-gray-800">Edit Profile</h2>

      <div className="mb-4">
        <TextInput
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
      </div>

      <div className="mb-4">
        <TextInput
          label="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />
      </div>

      {/* Gender selection */}
      <SelectInput
        label="Gender"
        registration={register("gender", { required: "Gender is required" })}
        error={errors.gender?.message}
        options={[
          { value: "", label: "Select Gender" },
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "unisex", label: "Unisex" },
        ]}
      />

      {error && (
        <div className="mb-4 text-red-500">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProfileForm;
