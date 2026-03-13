/** Import fetch hook */
import { useEffect, useState } from 'react';
import { useFetch } from "../../hooks/useFetch";
import style from './CanteenMenu.module.scss'

/** Interfaces */
interface CanteenDay {
  dayName: string;
  dish: string;
}

interface CanteenMenuData {
  Days?: Array<{
    DayName: string;
    Dish: string;
  }>;
  days?: Array<{
    dayName: string;
    dish: string;
  }>;
}

const fallbackMenuUrl = '/canteenMenu.json';

/** Map Danish day names to JS day index (0 = Sunday) */
const dayIndex: Record<string, number> = {
  mandag: 1,
  tirsdag: 2,
  onsdag: 3,
  torsdag: 4,
  fredag: 5,
};

/** Displays the canteen menu: (day: dish)*/
export function CanteenMenu() {
  const { data: menu, isLoading, error } = useFetch<CanteenMenuData>(
    "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json"
  );
  const [fallbackDays, setFallbackDays] = useState<CanteenDay[] | null>(null);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;

    let isMounted = true;

    const fetchFallbackMenu = async () => {
      setIsFallbackLoading(true);
      setFallbackError(null);

      try {
        const response = await fetch(fallbackMenuUrl);
        if (!response.ok) {
          throw new Error(`Fallback status: ${response.status}`);
        }

        const fallbackData = (await response.json()) as CanteenMenuData;
        const parsedDays = Array.isArray(fallbackData.days)
          ? fallbackData.days.map((day) => ({
              dayName: day.dayName,
              dish: day.dish,
            }))
          : [];

        if (!isMounted) return;
        setFallbackDays(parsedDays);
      } catch (err: unknown) {
        if (!isMounted) return;
        setFallbackError(err instanceof Error ? err.message : 'Kunne ikke hente fallback menu');
      } finally {
        if (isMounted) {
          setIsFallbackLoading(false);
        }
      }
    };

    void fetchFallbackMenu();

    return () => {
      isMounted = false;
    };
  }, [error]);

  const today = new Date().getDay();

  const remoteDays = Array.isArray(menu?.Days)
    ? menu.Days.map((day) => ({
        dayName: day.DayName,
        dish: day.Dish,
      }))
    : [];

  const allDays = remoteDays.length > 0 ? remoteDays : fallbackDays ?? [];

  const isMenuLoading = (isLoading && remoteDays.length === 0) || isFallbackLoading;

  if (isMenuLoading) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Indlæser...</p>
      </div>
    );
  }

  if (error && allDays.length === 0) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Fejl: {fallbackError ?? error}</p>
      </div>
    );
  }

  if (!allDays || allDays.length === 0) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Ingen data tilgængelig</p>
      </div>
    );
  }

  // Only keep today and future days
  const remainingDays = allDays.filter(
    (day) => (dayIndex[day.dayName.toLowerCase()] ?? 0) >= today
  );

  return (
    <div className={style.canteenMenuContainer}>
      <h2>Ugens Menu</h2>
      {remainingDays.map((day) => (
        <p key={`${day.dayName}-${day.dish}`}>
          {/* Capitalize first letter of day */}
          <strong>{day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}:</strong> {day.dish}
        </p>
      ))}
    </div>
  );
}
