<template>
  <div>
    <div class="month-navigation">
      <button @click="previousMonth">Previous month</button>
      <!-- <h2>{{ currentMonth }}</h2> -->
      <button @click="nextMonth">Next month</button>
    </div>
    <div class="calendar">
      <div class="day-names">
        week
        <!-- <div class="day-name" v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </div> -->
      </div>
      <div class="days">
        Day
        <!-- <div class="week" v-for="day in week">
          <div class="day" v-for="hour in day">{{ hour }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      daysOfWeek: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      hours: Array.from({length: 24}, (_, i) => `${i}:00`),
    };
  },
  computed: {
    week() {
      return [
        ["Пн 0", "Пн 1", "Пн 2", "Пн 3", "Пн 4", "Пн 5", "Пн 6"],
        ["Вт 0", "Вт 1", "Вт 2", "Вт 3", "Вт 4", "Вт 5", "Вт 6"],
        ["Ср 0", "Ср 1", "Ср 2", "Ср 3", "Ср 4", "Ср 5", "Ср 6"],
        ["Чт 0", "Чт 1", "Чт 2", "Чт 3", "Чт 4", "Чт 5", "Чт 6"],
        ["Пн 0", "Пн 1", "Пн 2", "Пн 3", "Пн 4", "Пн 5", "Пн 6"],
      ];
    },
  },
};
</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-areas:
    "h"
    "d";
  flex-wrap: wrap;
  max-width: 100%;
}
.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.day-names {
  grid-template-areas: "h";
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  text-align: center;
}

.day-name {
  flex: 1;
  border-right: 1px solid #ccc;
  padding: 15px 10px;
}
.days {
  grid-template-areas: "d";
}
.week {
  display: flex;
  flex-direction: column;
}

.day {
  position: relative;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  text-align: center;
  padding: 15px 10px;
  font-size: 16px;
}
.current-day {
  background-color: #fbfad4;
}
.day:hover {
  cursor: pointer;
}

.outside-month {
  color: #bbb;
  background-color: #eff1f3;
}
button {
  background-color: #243de2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

button:hover {
  background-color: #0d58c1;
}
.events {
  display: flex;
  flex-direction: column;
  top: 5px;
  left: 5px;
}

.event {
  color: #fff;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 2px 0;
  text-overflow: clip;
}
.event-title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  width: auto;
}
</style>
