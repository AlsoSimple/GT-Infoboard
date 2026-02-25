import React from "react";
import { useFetch } from "../../hooks/useFetch"

export function TechSchedule() {
  
  const [reloadFlag, setReloadFlag] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setReloadFlag(f => f + 1);
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);
  const { data, isLoading, error } = useFetch<Array<any>>(
    `https://iws.itcn.dk/techcollege/schedules?departmentcode=smed&reloadFlag=${reloadFlag}`
  );
  console.log(data);
  if (isLoading) {
    return <h1>Loading data... {error}</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }
  
  return (
    <div>
      <h2>Dagens Program</h2>
      <div>
        {(Array.isArray(data?.value) ? data.value : [])
        .filter(schedule => schedule.Education === "Grafisk teknik.")
        .slice(0, 4)
        .map((schedule) => (
          <ul>
            <li key={schedule.Team + schedule.StartDate}>
              {schedule.Room}
            </li>
            <li>
              {schedule.Team}
            </li>
            <li>
              {schedule.Subject}
            </li>
            <li>
              {(() => {
                const date = new Date(schedule.StartDate);
                date.setHours(date.getHours() + 1);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              })()}
            </li>
          </ul>
        ))}
      </div>
    </div>
  )
}