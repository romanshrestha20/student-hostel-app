import React, { useState, useEffect, type ChangeEvent } from "react";
import { uploadUserAvatar } from "../../api/userApi"; // adjust import path

interface AvatarUploadProps {
  userId: string;
  initialAvatarUrl?: string;
  backendBaseUrl: string;
  onUploadSuccess?: (newAvatarUrl: string) => void; // optional callback
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  initialAvatarUrl,
  backendBaseUrl,
  onUploadSuccess,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialAvatarUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update preview when file selected
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // "user" is the folder/model name in your backend uploads path
      const uploadedAvatarUrl = await uploadUserAvatar(userId, formData);

      // prepend backend base URL to get full URL for image src
      setAvatarUrl(backendBaseUrl + uploadedAvatarUrl);
      if (onUploadSuccess) {
        onUploadSuccess(backendBaseUrl + uploadedAvatarUrl);
      }
      // reset selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError("Upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300 }}>
      <div>
        <img
          src={
            previewUrl || avatarUrl || `${backendBaseUrl}/default-avatar.png`
          }
          alt="User avatar"
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        style={{ marginTop: 8 }}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default AvatarUpload;
