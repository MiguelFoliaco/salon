import { CONSTANT } from "@/constant";

export const getTime = (date = new Date()) => {
    const timeZone = CONSTANT.TIME_ZONE
    date.setHours(date.getHours() + timeZone)
    return date
}