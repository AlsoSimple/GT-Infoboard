import React from "react";
import { useFetch } from "../../hooks/useFetch"
import style from './TechSchedule.module.scss'

interface ScheduleItem {
  Education: string;
  StartDate: string;
  Team: string;
  Room: string;
  Subject: string;
}

interface ScheduleApiResponse {
  value?: ScheduleItem[];
}

export function TechSchedule() {
    // Example team-to-color mapping
    const teamColors: Record<string, string> = {
      h1gr: '#F4690C', 
      h2gr: '#F7C894', 
      h3gr: '#146D57', 
      h4gr: '#C23B22', 
      ggr0: '#F0A901', 
      h0gr: '#97BEAC', 
      // fallback/default color
      default: '#B5B5FF',
    };
  
  const [reloadFlag, setReloadFlag] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      if (hour >= 7 && hour < 17) {
        setReloadFlag(f => f + 1);
      }
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);
  const { data, isLoading, error } = useFetch<ScheduleApiResponse>(
    `https://iws.itcn.dk/techcollege/schedules?departmentcode=smed&reloadFlag=${reloadFlag}`
  );

  if (isLoading) {
    return <h1>Loading data... {error}</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }
  
  // Get all today's events for the right education
  const allSchedules = (Array.isArray(data?.value) ? data.value : [])
    .filter((schedule) => schedule.Education === "Grafisk teknik.");

  const now = new Date();
  // Find events for today that are still upcoming
  const todayUpcoming = allSchedules.filter((schedule) => {
    const eventDate = new Date(schedule.StartDate);
    eventDate.setHours(eventDate.getHours() + 1);
    const isToday =
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getDate() === now.getDate();
    return eventDate >= now && isToday;
  });

  let uniqueSchedules: ScheduleItem[] = [];
  if (todayUpcoming.length > 0) {
    // Show next upcoming event per team
    const seenTeams = new Set();
    for (const schedule of todayUpcoming) {
      if (!seenTeams.has(schedule.Team)) {
        uniqueSchedules.push(schedule);
        seenTeams.add(schedule.Team);
      }
    }
  } else {
    // If no more events today, show the last event for each team from today
    const lastEventPerTeam = new Map<string, ScheduleItem>();
    for (const schedule of allSchedules) {
      const eventDate = new Date(schedule.StartDate);
      eventDate.setHours(eventDate.getHours() + 1);
      const isToday =
        eventDate.getFullYear() === now.getFullYear() &&
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getDate() === now.getDate();
      if (isToday) {
        const previousEvent = lastEventPerTeam.get(schedule.Team);
        // Always keep the latest event for each team
        if (!previousEvent || eventDate > new Date(previousEvent.StartDate)) {
          lastEventPerTeam.set(schedule.Team, schedule);
        }
      }
    }
    uniqueSchedules = Array.from(lastEventPerTeam.values());
  }

  return (
    <div className={style.techScheduleContainer}>
      <h2>Dagens Program</h2>
      <div>
        {uniqueSchedules.slice(0, 4).map((schedule) => {
          const teamKey = schedule.Team ? schedule.Team.substring(0, 4) : 'default';
          const color = teamColors[teamKey] || teamColors.default;
          return (
            <ul key={schedule.Team + schedule.StartDate} style={{ backgroundColor: color }}>
              <li>
                {schedule.Room}
              </li>
              <li>
                {
                  teamKey === "h1gr"
                  ? "1. hovedforløb"
                  : teamKey === "h2gr"
                  ? "2. hovedforløb"
                  : teamKey === "h3gr"
                  ? "3. hovedforløb"
                  : teamKey === "h4gr"
                  ? "4. hovedforløb"
                  : teamKey === "ggr0"
                  ? "grundforløb"
                  : teamKey === "h0gr"
                  ? "specialfag"
                  : schedule.Team
                }
              </li>
              <li>
                {schedule.Subject}
              </li>
              {/*
              skal ikke dispayes alligevel
              <li>
                {(() => {
                  const date = new Date(schedule.StartDate);
                  date.setHours(date.getHours() + 1);
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                })()}
              </li> */}
            </ul>
          );
        })}
      </div>
    </div>
  )
}