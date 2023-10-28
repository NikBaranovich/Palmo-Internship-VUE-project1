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

          <div
            v-if="day.events.length > 2"
            @click.stop="moreButtonClick($event, day)"
          >
            {{ day.events.length - 2 }} More
          </div>
        </div>
      </div>
    </div>

    <modal-events
      :coords="{
        left: modalPositionX + 'px',
        top: modalPositionY + 'px',
      }"
      v-if="isModalEventsVisible"
    >
      <template v-slot:header>
        <span class="event-date"
          >{{
            selectedDay.date.toLocaleDateString("en-EN", {weekday: "long"})
          }}, {{ selectedDay.date.getDate() }}</span
        >
        <button @click="isModalEventsVisible = false" class="close-button">
          ✕
        </button>
      </template>
      <template v-slot:content>
        <ul class="events">
          <li
            v-for="event in selectedDay.events"
            :key="event.id"
            class="event"
            :style="{'background-color': event.color}"
            @click.stop="goToPage('singleEvent', {id: event.id})"
          >
            {{ event.title }}
          </li>
        </ul>
      </template>
    </modal-events>
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
            <label for="event-start-date">Start date</label>
            <custom-date-input
              class="form-input"
              id="event-start-date"
              v-model="newEvent.startDate"
            />
          </div>
          <div class="form-group">
            <label for="event-end-date">End date</label>
            <custom-date-input
              class="form-input"
              id="event-end-date"
              v-model="newEvent.endDate"
            />
          </div>
          <div class="form-group">
            <label for="event-repeat">Repeat</label>
            <custom-select
              v-model="newEvent.repeat"
              class="form-input"
              id="event-repeat"
              :options="repeatOptions"
            />
          </div>
          <div>
            <label for="event-color">Event color</label>
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
import ModalEvents from "@/components/ModalEvents.vue";
import CustomDateInput from "@/components/UI/CustomDateInput.vue";
import CustomSelect from "@/components/UI/CustomSelect.vue";

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
        repeat: null,
        description: null,
        color: null,
      },
      isModalVisible: false,
      isModalEventsVisible: false,
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      currentEvents: [],
      modalPositionX: 0,
      modalPositionY: 0,
      selectedDay: null,
      repeatOptions: ["none", "monthly", "annually"],
    };
  },
  components: {
    Modal,
    CustomDateInput,
    ModalEvents,
    CustomSelect,
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
    moreButtonClick(event, date) {
      this.selectedDay = date;
      this.modalPositionX = event.pageX;
      this.modalPositionY = event.pageY;
      this.isModalEventsVisible = true;

      const modalWidth = 320;

      const windowWidth = window.innerWidth;

      let modalPositionX = event.pageX;
      let modalPositionY = event.pageY;

      if (modalPositionX + modalWidth > windowWidth) {
        modalPositionX = windowWidth - modalWidth;
      }

      if (modalPositionX - modalWidth < 0) {
        modalPositionX = 0 + modalWidth;
      }

      this.modalPositionX = modalPositionX;
      this.modalPositionY = modalPositionY;
      this.isModalEventsVisible = true;
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
      this.newEvent.repeat = "none";
      this.newEvent.title = null;
      this.openModal();
    },
    getEventsForDay(date) {
      return this.currentEvents.filter((event) => {
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

          // Проверяем, находится ли заданный день внутри диапазона дней события
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
