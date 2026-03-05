import { CanteenMenu } from "../../components/CanteenMenu/CanteenMenu"
import { DateAndTime } from "../../components/DateAndTime/DateAndTime"
import { Events } from "../../components/Events/Events"
import { RSSNews } from "../../components/RSSNews/RSSNews"
import { TechSchedule } from "../../components/TechSchedule/TechSchedule"
import { Weather } from "../../components/Weather/Weather"
import style from './InfoMainPageLayout.module.scss'
export const InfoMainPageLayout = () => {
  
  
  return(
    <main className={style.infoMainPageLayout}>
      <CanteenMenu></CanteenMenu>
      <div className={style.infoCenterCol}>
        <div className={style.infoDateWeather}>
          <DateAndTime></DateAndTime>
          <Weather />
        </div>
        <RSSNews />
      </div>
      <div className={style.infoScheduleEvents}>
        <TechSchedule />
        <Events />
      </div>
    </main>
  )
}