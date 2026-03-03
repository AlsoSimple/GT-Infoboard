import events from '../../data/events.json';
import { Carousel } from '../Carousel/Carousel';

interface Event {
  startDate: string;
  endDate: string;
  text: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' });
}

export function Events() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAhead = new Date(today);
  weekAhead.setDate(today.getDate() + 7);

  const relevantEvents = (events as Event[]).filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return end >= today && start <= weekAhead;
  });

  return (
    <Carousel
      items={relevantEvents}
      interval={7000}
      renderItem={(event) => (
        <div>
          <p>
            <strong>{formatDate(event.startDate)}</strong>
            {event.startDate !== event.endDate && (
              <> – {formatDate(event.endDate)}</>
            )}
          </p>
          <p>{event.text}</p>
        </div>
      )}
    />
  );
}
