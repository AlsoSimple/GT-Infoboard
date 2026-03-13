import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { Carousel } from '../Carousel/Carousel';
import style from './Events.module.scss'

interface Event {
  id: string;
  startDate: string;
  endDate: string;
  text: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' });
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            startDate: d.startDate instanceof Timestamp ? d.startDate.toDate().toISOString() : d.startDate,
            endDate: d.endDate instanceof Timestamp ? d.endDate.toDate().toISOString() : d.endDate,
            text: d.text,
          } as Event;
        });
        if (!isMounted) return;
        setEvents(data);
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Ukendt fejl ved hentning af begivenheder');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchEvents();

    const refreshInterval = window.setInterval(() => {
      void fetchEvents();
    }, 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

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

  if (!events || events.length === 0) {
    return (
      <div className={style.eventsContainer}>
        <p>Ingen begivenheder tilgængelige</p>
      </div>
    );
  }

  const relevantEvents = events.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return end >= today && start <= weekAhead;
  });

  if (relevantEvents.length === 0) {
    return (
      <div className={style.eventsContainer}>
        <p>Ingen kommende begivenheder denne uge</p>
      </div>
    );
  }

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