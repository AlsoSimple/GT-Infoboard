import { DateAndTime } from "./components/DateAndTime/DateAndTime"
import { CanteenMenu } from "./components/CanteenMenu/CanteenMenu";
import { RSSNews } from "./components/RSSNews/RSSNews";
import { Weather } from "./components/Weather/Weather";
import { TechSchedule } from "./components/TechSchedule/TechSchedule";
import { Events } from "./components/Events/Events";

function App() {

  return (
    <>
    <DateAndTime></DateAndTime>
    <Weather />
    <CanteenMenu></CanteenMenu>
    <RSSNews />
    <Events />
    <TechSchedule />
    </>
  )
}

export default App
