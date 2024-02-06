'use client'
import React, { useEffect, useState } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="clock">
      <div id="hour">{hours}</div>
      <span>:</span>
      <div id="minute">{minutes}</div>
      <span>:</span>
      <div id="seconds">{seconds}</div>
    </div>
  );
};

export default DigitalClock;