import { useParams } from "react-router-dom";

export const BookingFormWrapper = () => {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) return <p>No room selected for booking.</p>;

  return <BookingForm roomId={roomId} />;
};
