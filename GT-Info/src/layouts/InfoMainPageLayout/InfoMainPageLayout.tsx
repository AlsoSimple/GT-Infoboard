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
      <div className={style.infoLeftCol}>
        <CanteenMenu></CanteenMenu>
      </div>
      <div className={style.infoCenterCol}>
        <div className={style.infoDateWeather}>
          <DateAndTime></DateAndTime>
        </div>
        <RSSNews />
      </div>
      <div className={style.infoRightCol}>
        <TechSchedule />
        <Events />
      </div>
    </main>
  )
}