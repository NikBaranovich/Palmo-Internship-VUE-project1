import {ref, computed} from "vue";
import {useRouter, useRoute} from "vue-router";

export function useWeeks() {
  const route = useRoute();
  let displayedMonth;
  if (!route.query.year || !route.query.month) {
    displayedMonth = ref(new Date());

  } else if (isNaN(route.query.year) || isNaN(route.query.month)) {

    displayedMonth = ref(new Date());
  } else if (

    route.query.year < 1970 ||
    route.query.year > 2035 ||
    route.query.month > 11 ||
    route.query.month < 0
  ) {

    displayedMonth = ref(new Date());
  } else {
    
    displayedMonth = ref(new Date(route.query.year, route.query.month, 1));
  }

  const weeks = computed(() => {
    const firstDay = new Date(
      displayedMonth.value.getFullYear(),
      displayedMonth.value.getMonth(),
      1
    );
    const lastDay = new Date(
      displayedMonth.value.getFullYear(),
      displayedMonth.value.getMonth() + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const previousMonthLastDay = new Date(
      displayedMonth.value.getFullYear(),
      displayedMonth.value.getMonth(),
      0
    ).getDate();
    let prevMonthDay = previousMonthLastDay - firstDayOfWeek + 1;

    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(
          displayedMonth.value.getFullYear(),
          displayedMonth.value.getMonth() - 1,
          prevMonthDay
        ),
      });
      prevMonthDay++;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        date: new Date(
          displayedMonth.value.getFullYear(),
          displayedMonth.value.getMonth(),
          day
        ),
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length == 0) {
      return weeks;
    }
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: new Date(
          displayedMonth.value.getFullYear(),
          displayedMonth.value.getMonth() + 1,
          nextMonthDay
        ),
      });
      nextMonthDay++;
    }

    weeks.push(currentWeek);
    return weeks;
  });

  const currentMonth = computed(() => {
    return displayedMonth.value.toLocaleString("en", {
      month: "long",
      year: "numeric",
    });
  });
  return {
    displayedMonth,
    weeks,
    currentMonth,
  };
}
