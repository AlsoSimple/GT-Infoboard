import { DateAndTime } from "./components/DateAndTime/DateAndTime"
import { CanteenMenu } from "./components/CanteenMenu/CanteenMenu";
import { RSSNews } from "./components/RSSNews/RSSNews";
import { Weather } from "./components/Weather/Weather";

function App() {

  return (
    <>
    <DateAndTime></DateAndTime>
    <CanteenMenu></CanteenMenu>
    <RSSNews />
    <Weather />
    </>
  )
}

export default App
