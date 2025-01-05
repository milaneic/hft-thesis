import React, { useEffect, useState } from "react";

interface LastEventProps {
  id: string;
}

const LastEvent: React.FC<LastEventProps> = ({ id }) => {
  const [description, setDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (id) {
      const fetchLastEvent = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/${id}/events/-1`
          );
          if (!res.ok) {
            setErrorMessage("Problem fetching last event");
          }
          const resText = await res.text();
          if (resText) {
            const event = JSON.parse(resText);
            setDescription(event.description);
            setCreatedAt(new Date(event.created_at));
          } else {
            setErrorMessage("No event");
          }
        } catch (error) {
          setErrorMessage("No event");
          console.error(error);
        }
      };

      fetchLastEvent();
    } else {
      setErrorMessage("No event");
    }
  }, [id]);

  return (
    <div>
      {errorMessage ? (
        <strong>{errorMessage}</strong>
      ) : (
        <span>
          {description}{" "}
          {createdAt && (
            <strong>{createdAt.toLocaleDateString("en-UK")}</strong>
          )}
        </span>
      )}
    </div>
  );
};

export default LastEvent;
