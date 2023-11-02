import {ref, computed} from "vue";
import {useEventsStore} from "../store/events";

export function useLocalEvents(weeks) {
  let currentEvents = ref([]);
  const store = useEventsStore();

  const eventsInRange = (startDate, endDate) => {
    return store.eventsWithHolidays.filter((event) => {
      if (
        (event.startDate <= startDate && event.endDate >= endDate) ||
        (event.startDate >= startDate && event.endDate <= endDate)
      ) {
        return true;
      }

      if (
        (event.startDate <= startDate && event.endDate >= startDate) ||
        (event.startDate <= endDate && event.endDate >= endDate)
      ) {
        return true;
      }

      if (event.repeat == "monthly") {
        return true;
      }

      if (event.repeat === "annually") {
        const eventStartMonthDay =
          event.startDate.getMonth() * 100 + event.startDate.getDate();
        const eventEndMonthDay =
          event.endDate.getMonth() * 100 + event.endDate.getDate();

        const startMonthDay = startDate.getMonth() * 100 + startDate.getDate();
        const endMonthDay = endDate.getMonth() * 100 + endDate.getDate();

        if (endMonthDay < startMonthDay) {
          return (
            eventStartMonthDay >= startMonthDay ||
            eventEndMonthDay <= endMonthDay
          );
        } else {
          return (
            (eventStartMonthDay >= startMonthDay &&
              eventStartMonthDay <= endMonthDay) ||
            (eventEndMonthDay >= startMonthDay &&
              eventEndMonthDay <= endMonthDay)
          );
        }
      }

      return false;
    });
  };

  const getEventsForDay = (date) => {
    return currentEvents.filter((event) => {
      if (
        date.getTime() >= event.startDate.getTime() &&
        date.getTime() <= event.endDate.getTime()
      ) {
        return true;
      }

      if (event.repeat === "annually") {
        const targetMonthDay = date.getMonth() * 100 + date.getDate();
        const eventStartMonthDay =
          event.startDate.getMonth() * 100 + event.startDate.getDate();
        const eventEndMonthDay =
          event.endDate.getMonth() * 100 + event.endDate.getDate();

        return (
          targetMonthDay >= eventStartMonthDay &&
          targetMonthDay <= eventEndMonthDay
        );
      }

      if (event.repeat === "monthly") {
        if (event.startDate.getDate() > event.endDate.getDate()) {
          if (date.getDate() >= event.startDate.getDate()) {
            return true;
          }
          if (date.getDate() <= event.endDate.getDate()) {
            return true;
          }
        }
        return (
          date.getDate() >= event.startDate.getDate() &&
          date.getDate() <= event.endDate.getDate()
        );
      }
      return false;
    });
  };

  const weeksWithEvents = computed(() => {
    const startDate = weeks.value[0][0].date;
    const endDate = weeks.value[weeks.value.length - 1][6].date;
    currentEvents = eventsInRange(startDate, endDate);
    return weeks.value.map((week) => {
      return week.map((day) => {
        day.events = getEventsForDay(day.date);
        return day;
      });
    });
  });
  return {weeksWithEvents};
}
