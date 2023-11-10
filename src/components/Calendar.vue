<template>
  <div class="calendar-component">
    <div class="month-navigation">
      <button class="custom-button" @click="changeDisplayedMonth(-1)">
        Previous month
      </button>
      <h2>{{ currentMonth }}</h2>
      <button class="custom-button" @click="changeDisplayedMonth(+1)">
        Next month
      </button>
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
              :key="event.id"
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
            @click.stop="goToPage('singleEvent', {params: {id: event.id}})"
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
              @input="validateTitle"
            />
            <div v-color:red v-if="errors.title" class="invalid-input-error">
              {{ errors.title }}
            </div>
          </div>
          <div class="form-group">
            <label for="event-start-date">Start date</label>
            <custom-date-input
              class="form-input"
              id="event-start-date"
              v-model="newEvent.startDate"
              @input="validateEndDate"
            />
          </div>
          <div class="form-group">
            <label for="event-end-date">End date</label>
            <custom-date-input
              class="form-input"
              id="event-end-date"
              v-model="newEvent.endDate"
              @input="validateEndDate"
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
          <div class="form-group">
            <label for="event-color" class="mb-2">Event color</label>
            <input
              class="form-control form-control-color"
              type="color"
              v-model="newEvent.color"
            />
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
          <button class="custom-button" @click="isModalVisible = false">
            Cancel
          </button>
          <button class="custom-button" @click="saveNewEvent">Add event</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {toast} from "vue3-toastify";
import {useRouter} from "vue-router";
let router = useRouter();

//Components
import Modal from "@/components/Modal.vue";
import ModalEvents from "@/components/ModalEvents.vue";
import CustomDateInput from "@/components/UI/CustomDateInput.vue";
import CustomSelect from "@/components/UI/CustomSelect.vue";

//Hooks
import {useWeeks} from "@/hooks/useWeeks.js";
const {displayedMonth, weeks, currentMonth} = useWeeks();

import {useLocalEvents} from "@/hooks/useEvents.js";
const {weeksWithEvents} = useLocalEvents(weeks);

import {useFormValidation} from "@/hooks/useFormValidation.js";
const {isEndDateInvalid, isTitleInvalid} = useFormValidation();

//Store
import {useEventsStore} from "@/store/events.js";
const {holidays, fetchHolidays, saveEvent} = useEventsStore();

import {storeToRefs} from "pinia";
import {useAuthorizationStore} from "@/store/authorization.js";
const {user} = storeToRefs(useAuthorizationStore());

import {usePageStore} from "@/store/page.js";
const {setPageDate} = usePageStore();

let currentDate = ref(new Date());
currentDate.value.setHours(0, 0, 0, 0);
let daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let repeatOptions = reactive(["none", "monthly", "annually"]);

const areDaysEqual = (firstDay, secondDay) => {
  return firstDay.getTime() == secondDay.getTime();
};

const openSingleEvent = (id) => {
  const isHoliday = holidays.find((holiday) => holiday.id == id);
  if (isHoliday) {
    toast.warning("Holidays cannot be modified!");
    return;
  }
  goToPage("singleEvent", {
    params: {id},
  });
};

//Modal
let modalPositionX = ref(0);
let modalPositionY = ref(0);
let isModalVisible = ref(false);
let isModalEventsVisible = ref(false);

let selectedDay = ref(null);

const moreButtonClick = (event, date) => {
  selectedDay = date;
  modalPositionX.value = event.pageX;
  modalPositionY.value = event.pageY;
  isModalEventsVisible.value = true;

  const modalWidth = 320;

  const windowWidth = window.innerWidth;

  if (modalPositionX.value + modalWidth > windowWidth) {
    modalPositionX.value = windowWidth - modalWidth;
  }

  if (modalPositionX.value - modalWidth < 0) {
    modalPositionX.value = 0 + modalWidth;
  }
};

//Add new event
let newEvent = reactive({
  title: null,
  startDate: null,
  endDate: null,
  repeat: null,
  description: null,
  color: null,
});
let errors = reactive({
  title: "",
  endDate: null,
});

const dayClickHandler = (day) => {
  if (!user.value) {
    goToPage("login");
  }

  newEvent.startDate = new Date(day);
  newEvent.endDate = new Date(day);
  newEvent.color = "#33aaff";
  newEvent.description = null;
  newEvent.repeat = "none";
  newEvent.title = null;

  isModalVisible.value = true;
};

const validateTitle = () => {
  errors.title = isTitleInvalid(newEvent.title);
};
const validateEndDate = () => {
  errors.endDate = isEndDateInvalid(newEvent.startDate, newEvent.endDate);
};

const saveNewEvent = () => {
  validateTitle();
  validateEndDate();

  errors.endDate = isEndDateInvalid(newEvent.startDate, newEvent.endDate);
  if (errors.endDate || errors.title) {
    return;
  }

  saveEvent({...newEvent});
  isModalVisible.value = false;
};

//Navigation
function goToPage(name, params) {
  router.push({
    name,
    ...params,
  });
}

const changeDisplayedMonth = (monthChange) => {
  const newMonth = new Date(displayedMonth.value);
  newMonth.setMonth(newMonth.getMonth() + monthChange);

  if (newMonth.getFullYear() != displayedMonth.value.getFullYear()) {
    fetchHolidays(newMonth.getFullYear(), "UA");
  }
  displayedMonth.value = newMonth;

  setPageDate(newMonth.getMonth(), newMonth.getFullYear());
  goToPage("calendar", {
    query: {month: newMonth.getMonth(), year: newMonth.getFullYear()},
  });
};
</script>
