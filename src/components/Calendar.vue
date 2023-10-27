<template>
  <div>
    <div class="month-navigation">
      <button @click="previousMonth">Previous month</button>
      <h2>{{ currentMonth }}</h2>
      <button @click="nextMonth">Next month</button>
    </div>
    <div class="calendar">
      <div class="week day-names">
        <div class="day-name" v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </div>
      </div>
      <div class="week" v-for="week in weeks">
        <div
          class="day"
          @click="dayClickHandler(day.date)"
          v-for="day in week"
          :class="{
            'outside-month': day.date.getMonth() != displayedMonth.getMonth(),
            'current-day': areDaysEqual(day.date, currentDate),
          }"
        >
          {{ day.date.getDate() }}
          <div class="events">
            <div
              class="event"
              v-for="event in [...day.events].splice(0, 2)"
              :style="{'background-color': event.color}"
              @click.stop="goToPage('singleEvent', {id: event.id})"
            >
              <div class="event-title">{{ event.title }}</div>
            </div>
          </div>
          <div v-if="day.events.length > 2" @click.stop="moreButtonClick">
            {{ day.events.length - 2 }} More
          </div>
        </div>
      </div>
    </div>

    <modal :style="{color: 'green'}" v-if="isModal2Visible"
      ><template v-slot:header>
        <h2>Add new event</h2>
      </template></modal
    >
    <modal v-if="isModalVisible">
      <template v-slot:header>
        <h2>Add new event</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="event-title">Event title</label>
            <input
              class="form-input"
              type="text"
              id="event-title"
              v-model="newEvent.title"
            />
          </div>
          <div class="form-group">
            <label for="event-date">Start date</label>
            <custom-date-input
              class="form-input"
              v-model="newEvent.startDate"
            />
          </div>
          <div class="form-group">
            <label for="event-date">End date</label>
            <custom-date-input class="form-input" v-model="newEvent.endDate" />
          </div>
          <div>
            <label for="event-color">Цвет события</label>
            <input for="event-color" type="color" v-model="newEvent.color" />
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
import {useAuthorizationStore} from "@/store/authorization.js";

import {mapActions, mapState} from "pinia";
import {redirectMixin} from "@/mixins/redirect.js";
import {modalMixin} from "@/mixins/modal.js";

export default {
  data() {
    return {
      currentDate: null,
      displayedMonth: null,
      newEvent: {
        title: null,
        startDate: null,
        endDate: null,
        description: null,
        color: null,
      },
      isModalVisible: false,
      isModal2Visible: false,
      daysOfWeek: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      currentEvents: [],
      modalPositionX: 50,
      modalPositionY: 50,
    };
  },
  components: {
    Modal,
    CustomDateInput,
  },
  mixins: [redirectMixin, modalMixin],
  methods: {
    ...mapActions(useEventsStore, ["saveEvent", "eventsInRange"]),
    areDaysEqual(firstDay, secondDay) {
      return firstDay.getTime() == secondDay.getTime();
    },
    saveNewEvent() {
      this.saveEvent({...this.newEvent});
      this.closeModal();
    },
    previousMonth() {
      const newMonth = new Date(this.displayedMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      this.displayedMonth = newMonth;
    },
    nextMonth() {
      const newMonth = new Date(this.displayedMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      this.displayedMonth = newMonth;
    },
    moreButtonClick(event) {
      this.modalPositionX = event.pageX;
      this.modalPositionY = event.pageY;
      this.isModal2Visible = true;
    },
    dayClickHandler(day) {
      if (!this.user) {
        this.$router.push({
          name: "login",
        });
      }
      this.newEvent.startDate = new Date(day);
      this.newEvent.endDate = new Date(day);
      this.newEvent.color = "#33aaff";
      this.newEvent.description = null;
      this.newEvent.title = null;
      this.openModal();
    },

    handleStartDate(dateInput) {
      this.newEvent.startDate = new Date(dateInput + "T00:00");
    },
    handleEndDate(dateInput) {
      this.newEvent.endDate = new Date(dateInput + "T00:00");
    },
    getEventsForDay(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return this.currentEvents.filter(
        (event) =>
          year >= event.startDate.getFullYear() &&
          year <= event.endDate.getFullYear() &&
          month >= event.startDate.getMonth() &&
          month <= event.endDate.getMonth() &&
          day >= event.startDate.getDate() &&
          day <= event.endDate.getDate()
      );
    },
  },
  computed: {
    ...mapState(useAuthorizationStore, ["user"]),
    currentMonth() {
      return this.displayedMonth.toLocaleString("en", {
        month: "long",
        year: "numeric",
      });
    },
    ...mapState(useEventsStore, ["events"]),
    weeks() {
      const firstDay = new Date(
        this.displayedMonth.getFullYear(),
        this.displayedMonth.getMonth(),
        1
      );
      const lastDay = new Date(
        this.displayedMonth.getFullYear(),
        this.displayedMonth.getMonth() + 1,
        0
      );
      const daysInMonth = lastDay.getDate();
      const firstDayOfWeek =
        firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      const previousMonthLastDay = new Date(
        this.displayedMonth.getFullYear(),
        this.displayedMonth.getMonth(),
        0
      ).getDate();
      let prevMonthDay = previousMonthLastDay - firstDayOfWeek + 1;

      const startDate = new Date(
        this.displayedMonth.getFullYear(),
        this.displayedMonth.getMonth() - 1,
        prevMonthDay
      );
      const endDate = new Date(
        this.displayedMonth.getFullYear(),
        this.displayedMonth.getMonth() + 1,
        7 - lastDay.getDay()
      );

      this.currentEvents = this.eventsInRange(startDate, endDate);
      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push({
          date: new Date(
            this.displayedMonth.getFullYear(),
            this.displayedMonth.getMonth() - 1,
            prevMonthDay
          ),
          events: this.getEventsForDay(
            new Date(
              this.displayedMonth.getFullYear(),
              this.displayedMonth.getMonth() - 1,
              prevMonthDay
            )
          ),
        });
        prevMonthDay++;
      }

      for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push({
          date: new Date(
            this.displayedMonth.getFullYear(),
            this.displayedMonth.getMonth(),
            day
          ),
          events: this.getEventsForDay(
            new Date(
              this.displayedMonth.getFullYear(),
              this.displayedMonth.getMonth(),
              day
            )
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
            this.displayedMonth.getFullYear(),
            this.displayedMonth.getMonth() + 1,
            nextMonthDay
          ),
          events: this.getEventsForDay(
            new Date(
              this.displayedMonth.getFullYear(),
              this.displayedMonth.getMonth() + 1,
              nextMonthDay
            )
          ),
        });
        nextMonthDay++;
      }

      weeks.push(currentWeek);
      return weeks;
    },
  },
  created() {
    this.currentDate = new Date();
    this.displayedMonth = new Date();
    this.currentDate.setHours(0, 0, 0, 0);
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
