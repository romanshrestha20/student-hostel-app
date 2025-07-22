import React from "react";
import { useRoom } from "../../hooks/useRoom.ts";
import type { Room } from "../../types/room.ts";
import { Button, TextArea, TextInput } from "../../components/common";

interface RoomCreateFormProps {
  hostelId: string;
  onRoomCreated: (room: Room) => void;
  onClose: () => void;
}

const RoomCreateForm = ({
  hostelId,
  onRoomCreated,
  onClose,
}: RoomCreateFormProps) => {
  const { createNewRoom } = useRoom();

  const [form, setForm] = React.useState({
    roomType: "",
    price: 0,
    capacity: 1,
    available: true,
    amenities: [] as string[],
    hostelId,
  });

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.roomType) {
      setError("Room Type is required");
      return;
    }

    if (!form.price || form.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const newRoom = await createNewRoom({
        roomType: form.roomType as Room["roomType"],
        price: form.price,
        capacity: form.capacity,
        available: form.available,
        amenities: form.amenities,
        hostelId: form.hostelId,
      });

      if (newRoom) {
        onRoomCreated(newRoom);
        setMessage("Room created successfully!");
        setForm({
          roomType: "",
          price: 0,
          capacity: 1,
          available: true,
          amenities: [],
          hostelId,
        });
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Create Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Room Type"
          value={form.roomType}
          onChange={(e) => setForm({ ...form, roomType: e.target.value })}
          placeholder="e.g. single, double, dormitory, apartment"
          required
          className="w-full"
        />
        <TextInput
          label="Price ($)"
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
          className="w-full"
        />
        <TextInput
          label="Capacity"
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
          required
          className="w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="form-checkbox"
          />
          <span>Available</span>
        </label>
        <TextArea
          label="Amenities (comma separated)"
          value={form.amenities.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              amenities: e.target.value.split(",").map((a) => a.trim()),
            })
          }
          placeholder="WiFi, Air Conditioning, Laundry"
          className="w-full"
        />

        <div>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </div>
  );
};

export default RoomCreateForm;
