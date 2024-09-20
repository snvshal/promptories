"use client";

import { useEffect, useState } from "react";

export function TimeAgo({ timestamp }: { timestamp: Date }) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(timestamp).getTime();

      const seconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) return `${seconds}s ago`;
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      if (weeks < 4) return `${weeks}w ago`;
      if (months < 12) return `${months}mo ago`;
      return `${years}y ago`;
    };

    // Set the initial time ago
    setTimeAgo(calculateTimeAgo());

    // Update the time every second
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timestamp]);

  return <span>{timeAgo}</span>;
}
