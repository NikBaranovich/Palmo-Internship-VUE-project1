<template>
  <div>
    <div class="month-navigation">
      <button @click="previousMonth">Предыдущий месяц</button>
      <h2>{{ currentDate }}</h2>
      <button @click="nextMonth">Следующий месяц</button>
    </div>
    <div class="calendar">
      <div class="week day-names">
        <div class="day-name" v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </div>
      </div>
      <div class="week" v-for="week in weeks">
        <div class="day" v-for="day in week" @click="dayClickHandler(day)">
          {{ day.getDate() }}
          <div class="events">
            <div
              class="event"
              v-for="event in getEventsForDay(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
              )"
              :style="{'background-color': event.color}"
              @click="goToPage('singleEvent', {id: event.id})"
            >
              <div class="event-title">{{ event.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal v-if="isModalVisible">
      <template v-slot:header>
        <h2>Добавить новое событие</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="event-title">Заголовок события</label>
            <input
              class="form-input"
              type="text"
              id="event-title"
              v-model="newEvent.title"
            />
          </div>
          <div class="form-group">
            <label for="event-date">Дата начала события</label>
            <custom-date-input
              class="form-input"
              v-model="newEvent.startDate"
            />
          </div>
          <div class="form-group">
            <label for="event-date">Дата конца события</label>
            <custom-date-input class="form-input" v-model="newEvent.endDate" />
          </div>
          <div>
            <label for="event-date">Цвет события</label>
            <input type="color" v-model="newEvent.color" />
          </div>
          <div class="form-group">
            <label for="event-description">Описание события</label>
            <textarea
              class="form-input"
              id="event-description"
              rows="4"
              v-model="newEvent.description"
            ></textarea>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-group">
          <button type="button" @click="closeModal">Отмена</button>
          <button @click="saveNewEvent">Добавить</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import CustomDateInput from "@/components/UI/CustomDateInput.vue";
import {useEventsStore} from "@/store/events.js";
import {mapActions, mapState} from "pinia";

export default {
  data() {
    return {
      currentDate: new Date(),
      newEvent: {
        title: null,
        startDate: null,
        endDate: null,
        description: null,
        color: null,
      },
      isModalVisible: false,
      daysOfWeek: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    };
  },
  components: {
    Modal,
    CustomDateInput,
  },
  methods: {
    ...mapActions(useEventsStore, ["saveEvent"]),
    saveNewEvent() {
      this.saveEvent({...this.newEvent});
      this.closeModal();
    },
    previousMonth() {
      const newMonth = new Date(this.currentDate);
      newMonth.setMonth(newMonth.getMonth() - 1);
      this.currentDate = newMonth;
    },
    nextMonth() {
      const newMonth = new Date(this.currentDate);
      newMonth.setMonth(newMonth.getMonth() + 1);
      this.currentDate = newMonth;
    },
    dayClickHandler(day) {
      var nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      this.newEvent.startDate = day;
      this.newEvent.endDate = day;
      this.newEvent.color = "#33aaff";
      this.newEvent.description = null;
      this.newEvent.title = null;
      this.openModal();
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    handleStartDate(dateInput) {
      this.newEvent.startDate = new Date(dateInput + "T00:00");
    },
    handleEndDate(dateInput) {
      this.newEvent.endDate = new Date(dateInput + "T00:00");
    },
    getEventsForDay(year, month, day) {
      return this.events.filter(
        (event) =>
          year >= event.startDate.getFullYear() &&
          year <= event.endDate.getFullYear() &&
          month >= event.startDate.getMonth() &&
          month <= event.endDate.getMonth() &&
          day >= event.startDate.getDate() &&
          day <= event.endDate.getDate()
      );
    },
    goToPage(name, params) {
      this.$router.push({
        name,
        params,
      });
    },
  },
  computed: {
    ...mapState(useEventsStore, ["events"]),
    weeks() {
      const firstDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );
      const daysInMonth = lastDay.getDate();
      const firstDayOfWeek =
        firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      const previousMonthLastDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        0
      ).getDate();
      let prevMonthDay = previousMonthLastDay - firstDayOfWeek + 1;
      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(
          new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1,
            prevMonthDay
          )
        );
        prevMonthDay++;
      }

      for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(
          new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
          )
        );
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
        currentWeek.push(
          new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            nextMonthDay
          )
        );
        nextMonthDay++;
      }

      weeks.push(currentWeek);

      return weeks;
    },
  },
};
</script>

<style scoped>
.calendar {
  display: flex;
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

.week {
  display: flex;
  width: 100%;
}

.day {
  width: calc(100% / 7);
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  text-align: center;
  padding: 15px 10px;
  font-size: 16px;
}

.day:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.outside-month {
  color: #454545;
  background-color: #fff;
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
  /* background-color: #33aaff; */
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
