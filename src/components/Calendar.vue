<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">Предыдущий месяц</button>
      <h2>{{ currentMonth }}</h2>
      <button @click="nextMonth">Следующий месяц</button>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in calendar" :key="week">
          <td v-for="day in week" :key="day.date" :class="dayClasses(day)">
            {{ day.day }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: new Date(),
      daysOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    };
  },
  computed: {
    calendar() {
      const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
      const lastDay = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        0
      );
      const daysInMonth = lastDay.getDate();
      const firstDayOfWeek = firstDay.getDay();

      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push({ day: "" });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push({ day });
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }
      if (currentWeek.length == 0) {
        return weeks;
      }
      while (currentWeek.length < 7) {
        currentWeek.push({ day: "" });
      }

      weeks.push(currentWeek);

      return weeks;
    },
  },
  methods: {
    prevMonth() {
      const newMonth = new Date(this.currentMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      this.currentMonth = newMonth;
    },
    nextMonth() {
      const newMonth = new Date(this.currentMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      this.currentMonth = newMonth;
    },
    dayClasses(day) {},
  },
};
</script>

<style>
.calendar {
  font-family: Arial, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.calendar-header button:hover {
  background-color: #0056b3;
}

.calendar-header h2 {
  font-size: 20px;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-table th,
.calendar-table td {
  border: 1px solid #ddd;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: center;
}

.calendar-table th {
  background-color: #f0f0f0;
}

.calendar-table td.today {
  background-color: #ffecb3;
}

.calendar-table td.selected {
  background-color: #007bff;
  color: #fff;
}

.calendar-table td:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
