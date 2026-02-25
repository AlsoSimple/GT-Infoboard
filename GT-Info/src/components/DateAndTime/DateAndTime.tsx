import { useEffect, useState } from 'react';

export function DateAndTime() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();

      // 24 hour format
      setTime(now.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }));

      // Format date day/month
      const raw = now.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });
      // Capitalize first letter
      setDate(raw.charAt(0).toUpperCase() + raw.slice(1));
    };

    update();
    const interval = setInterval(update, 1000); // update every 1s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>{time}</h1>
      <h2>{date}</h2>
    </div>
  );
}
