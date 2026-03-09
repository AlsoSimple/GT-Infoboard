/** Import fetch hook */
import { useFetch } from "../../hooks/useFetch";
import style from './CanteenMenu.module.scss'

/** Interfaces */
interface CanteenDay {
  DayName: string;
  Dish: string;
}

interface CanteenMenuData {
  Days: CanteenDay[];
}

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

  const today = new Date().getDay();

  if (isLoading) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Indlæser...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Fejl: {error}</p>
      </div>
    );
  }

  if (!menu || !menu.Days) {
    return (
      <div className={style.canteenMenuContainer}>
        <h2>Ugens Menu</h2>
        <p>Ingen data tilgængelig</p>
      </div>
    );
  }

  // Only keep today and future days
  const remainingDays = menu.Days.filter(
    (day) => (dayIndex[day.DayName] ?? 0) >= today
  );

  return (
    <div className={style.canteenMenuContainer}>
      <h2>Ugens Menu</h2>
      {remainingDays.map((day) => (
        <p key={day.DayName}>
          {/* Capitalize first letter of day */}
          <strong>{day.DayName.charAt(0).toUpperCase() + day.DayName.slice(1)}:</strong> <p>{day.Dish}</p>
        </p>
      ))}
    </div>
  );
}
