import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { uploadUserAvatar } from "../../api/userApi";
import useProfile from "../../hooks/useProfile";
import { Loader2 } from "lucide-react";

interface AvatarUploadProps {
  userId: string;
  onUploadSuccess?: (newAvatarUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  onUploadSuccess,
}) => {
  const { profile } = useProfile();
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (profile?.avatar) {
      setAvatarUrl(`${backendBaseUrl}${profile.avatar}`);
    }
  }, [profile?.avatar]);

  useEffect(() => {
    if (!selectedFile) return setPreviewUrl(null);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    // Reset the input to allow re-uploading the same file
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const uploadedPath = await uploadUserAvatar(userId, formData);
      const fullUrl = `${backendBaseUrl}${uploadedPath}`;

      setAvatarUrl(fullUrl);
      onUploadSuccess?.(fullUrl);

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError("Upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <img
        src={previewUrl || avatarUrl || `${backendBaseUrl}/default-avatar.png`}
        alt="User avatar"
        className="object-cover border border-gray-300 rounded-full w-36 h-36"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-sm p-4 text-center border-2 border-dashed rounded-lg cursor-pointer transition ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatarUploadInput"
        />
        <label htmlFor="avatarUploadInput" className="block text-gray-500 cursor-pointer">
          {selectedFile
            ? selectedFile.name
            : "Click or drag an image here to upload"}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
