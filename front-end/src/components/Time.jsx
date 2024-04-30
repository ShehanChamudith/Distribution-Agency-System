import React, { useState, useEffect } from "react";

const Time = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
      const timeString = date.toLocaleTimeString([], timeOptions);
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className="text-white ">{currentTime}</p>
    </div>
  );
};

export default Time;
