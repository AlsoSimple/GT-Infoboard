import { DateAndTime } from "./components/DateAndTime/DateAndTime"
import { CanteenMenu } from "./components/CanteenMenu/CanteenMenu";
import { RSSNews } from "./components/RSSNews/RSSNews";
import { Weather } from "./components/Weather/Weather";
import { TechSchedule } from "./components/TechSchedule/TechSchedule";

function App() {

  return (
    <>
    <DateAndTime></DateAndTime>
    <CanteenMenu></CanteenMenu>
    <RSSNews />
    <Weather />
    <TechSchedule />
    </>
  )
}

export default App
