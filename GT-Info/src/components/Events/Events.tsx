import { useFetch } from '../../hooks/useFetch';
import { Carousel } from '../Carousel/Carousel';
import style from './Events.module.scss'

interface Event {
  id: string;
  startDate: string;
  endDate: string;
  text: string;
}

interface EventsResponse {
  status: string;
  data: Event[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' });
}

export function Events() {
  const { data: response, isLoading, error } = useFetch<EventsResponse>(
    'https://gt-infoboardapi-production.up.railway.app/events'
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAhead = new Date(today);
  weekAhead.setDate(today.getDate() + 7);

  if (isLoading) {
    return (
      <div className={style.eventsContainer}>
        <p>Indlæser begivenheder...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.eventsContainer}>
        <p>Fejl: {error}</p>
      </div>
    );
  }

  if (!response || !response.data || response.data.length === 0) {
    return (
      <div className={style.eventsContainer}>
        <p>Ingen begivenheder tilgængelige</p>
      </div>
    );
  }

  const relevantEvents = response.data.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return end >= today && start <= weekAhead;
  });

  return (
    <div className={style.eventsContainer}>
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
    </div>
  );
}
