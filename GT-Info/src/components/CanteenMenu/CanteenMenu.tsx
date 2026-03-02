/** Import dummy data */
import canteenMenu from "../../Data/canteenMenu.json";

/** Interfaces */
interface CanteenDay {
  dayName: string;
  dish: string;
}

interface CanteenMenuData {
  days: CanteenDay[];
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
  const menu = canteenMenu as CanteenMenuData;
  const today = new Date().getDay();

  // Only keep today and future days
  const remainingDays = menu.days.filter(
    (day) => (dayIndex[day.dayName] ?? 0) >= today
  );

  return (
    <div>
      {remainingDays.map((day) => (
        <p key={day.dayName}>
          {/* Capitalize first letter of day */}
          <strong>{day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}</strong>: {day.dish}
        </p>
      ))}
    </div>
  );
}
