import { Log } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface LastEventNameProp {
  last_event: Log | undefined;
}

const LastEventName: React.FC<LastEventNameProp> = ({ last_event }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (last_event) {
      const fetchLastEvent = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${last_event.eventId}`
        );
        if (!res.ok) {
          setContent("Problem fetching last event");
          return;
        }
        const event = await res.json();
        setContent(event.name);
      };
      fetchLastEvent();
    } else {
      setContent("No event");
    }
  }, [last_event]);

  return <div>{content}</div>;
};

export default LastEventName;
