/** Import dummy data */
import canteenMenu from "../../Data/canteenMenu.json";

/** Displays the canteen menu: (day: dish) */
export function CanteenMenu() {
  return (
    <div>
      {canteenMenu.days.map((day) => (
        <p key={day.dayName}>
          {/* Capitalize first letter of day*/}
          <strong>{day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}</strong>: {day.dish}
        </p>
      ))}
    </div>
  );
}
