<template>
  <div class="calendar-component">
    <div class="month-navigation">
      <button class="custom-button" @click="previousMonth">
        Previous month
      </button>
      <h2>{{ currentMonth }}</h2>
      <button class="custom-button" @click="nextMonth">Next month</button>
    </div>

    <div class="calendar">
      <div class="week day-names">
        <div class="day-name" v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </div>
      </div>

      <div class="week" v-for="week in weeksWithEvents">
        <div
          class="day"
          @click="dayClickHandler(day.date)"
          v-for="day in week"
          :class="{
            'outside-month': day.date.getMonth() != displayedMonth.getMonth(),
          }"
        >
          <div
            class="day-number"
            :class="{'current-day': areDaysEqual(day.date, currentDate)}"
          >
            {{ day.date.getDate() }}
          </div>
          <div class="events">
            <div
              class="event"
              v-for="event in [...day.events].splice(0, 2)"
              :style="{'background-color': event.color}"
              @click.stop="openSingleEvent(event.id)"
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
            <div class="event-title">{{ event.title }}</div>
          </li>
        </ul>
      </template>
    </modal-events>

    <modal v-if="isModalVisible" @close="isModalVisible = false">
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
            <div v-color:red v-if="errors.endDate" class="invalid-input-error">
              {{ errors.endDate }}
            </div>
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
            <label for="event-description">Event description</label>
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
          <button class="custom-button" @click="closeModal">Cancel</button>
          <button class="custom-button" @click="saveNewEvent">Add event</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import {toast} from "vue3-toastify";

import Modal from "@/components/Modal.vue";
import ModalEvents from "@/components/ModalEvents.vue";
import CustomDateInput from "@/components/UI/CustomDateInput.vue";
import CustomSelect from "@/components/UI/CustomSelect.vue";

import {useEventsStore} from "@/store/events.js";
import {useAuthorizationStore} from "@/store/authorization.js";
import {usePageStore} from "@/store/page.js";
import {mapActions, mapState} from "pinia";

import {redirectMixin} from "@/mixins/redirect.js";
import {modalMixin} from "@/mixins/modal.js";
import {formValidationMixin} from "@/mixins/formValidation.js";

import {useWeeks} from "@/hooks/useWeeks.js";
import {useLocalEvents} from "@/hooks/useEvents.js";

export default {
  data() {
    return {
      currentDate: null,
      newEvent: {
        title: null,
        startDate: null,
        endDate: null,
        repeat: null,
        description: null,
        color: null,
      },
      errors: {
        endDate: null,
      },
      isModalVisible: false,
      isModalEventsVisible: false,
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
  mixins: [redirectMixin, modalMixin, formValidationMixin],
  methods: {
    ...mapActions(useEventsStore, ["saveEvent", "fetchHolidays"]),
    ...mapActions(usePageStore, ["setPageDate"]),
    areDaysEqual(firstDay, secondDay) {
      return firstDay.getTime() == secondDay.getTime();
    },
    openSingleEvent(id) {
      const isHoliday = this.holidays.find((holiday) => holiday.id == id);
      if (isHoliday) {
        toast.warning("Holidays cannot be modified!");
        return;
      }
      this.goToPage("singleEvent", {id});
    },
    saveNewEvent() {
      this.errors.endDate = this.isEndDateInvalid(
        this.newEvent.startDate,
        this.newEvent.endDate
      );
      if (this.errors.endDate) {
        return;
      }
      this.saveEvent({...this.newEvent});
      this.closeModal();
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
    previousMonth() {
      const newMonth = new Date(this.displayedMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      if (newMonth.getFullYear() != this.displayedMonth.getFullYear()) {
        this.fetchHolidays(newMonth.getFullYear(), "UA");
      }
      this.displayedMonth = newMonth;
      this.setPageDate(newMonth.getMonth(), newMonth.getFullYear());
      this.$router.push({
        name: "calendar",
        query: {month: newMonth.getMonth(), year: newMonth.getFullYear()},
      });
    },
    nextMonth() {
      const newMonth = new Date(this.displayedMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      if (newMonth.getFullYear() != this.displayedMonth.getFullYear()) {
        this.fetchHolidays(newMonth.getFullYear(), "UA");
      }
      this.displayedMonth = newMonth;

      this.setPageDate(newMonth.getMonth(), newMonth.getFullYear());
      this.$router.push({
        name: "calendar",
        query: {month: newMonth.getMonth(), year: newMonth.getFullYear()},
      });
    },
  },

  computed: {
    ...mapState(useAuthorizationStore, ["user"]),
    ...mapState(usePageStore, ["pageYear", "pageMonth"]),
    ...mapState(useEventsStore, ["events", "holidays", "eventsWithHolidays"]),
  },
  created() {
    this.currentDate = new Date();
    this.currentDate.setHours(0, 0, 0, 0);
  },
  setup() {
    const {displayedMonth, weeks, currentMonth} = useWeeks();
    const {weeksWithEvents} = useLocalEvents(weeks);
    return {
      displayedMonth,
      weeksWithEvents,
      currentMonth,
    };
  },
};
</script>
