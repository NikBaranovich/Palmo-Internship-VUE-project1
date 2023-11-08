<template>
  <div class="event-info" v-if="event">
    <div class="event-color" :style="{background: event.color}"></div>
    <div class="event-details">
      <h2 class="event-title">{{ event.title }}</h2>
      <p class="event-time">Start: {{ event.startDate }}</p>
      <p class="event-time">End: {{ event.endDate }}</p>
      <p class="event-repeat">Repeat: {{ event.repeat }}</p>
      <p class="event-description">Description: {{ event.description }}</p>
    </div>
    <div class="button-container">
      <button class="custom-button edit-button" @click="editClickHandler">
        Edit
      </button>
      <button class="custom-button delete-button" @click="deleteEventHandler">
        Delete
      </button>
    </div>
    <modal v-if="isModalVisible" @close="isModalVisible = false">
      <template v-slot:header>
        <h2>Edit event</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="event-title">Event title</label>
            <input
              class="form-input"
              type="text"
              id="event-title"
              v-model="editedEvent.title"
            />
          </div>
          <div class="form-group">
            <label for="event-date">Start date</label>
            <custom-date-input
              class="form-input"
              v-model="editedEvent.startDate"
            />
          </div>
          <div class="form-group">
            <label for="event-date">End date</label>
            <custom-date-input
              class="form-input"
              v-model="editedEvent.endDate"
            />
            <div v-color:red v-if="errors.endDate" class="invalid-input-error">
              {{ errors.endDate }}
            </div>
          </div>
          <div class="form-group">
            <label for="event-color" class="mb-2">Event color</label>
            <input
              class="form-control form-control-color"
              type="color"
              v-model="editedEvent.color"
            />
          </div>
          <div class="form-group">
            <label for="event-repeat">Repeat</label>
            <custom-select
              v-model="editedEvent.repeat"
              class="form-input"
              id="event-repeat"
              :options="repeatOptions"
            />
          </div>
          <div class="form-group">
            <label for="event-description">Описание события</label>
            <textarea
              class="form-input"
              id="event-description"
              rows="4"
              v-model="editedEvent.description"
            ></textarea>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-group">
          <button class="custom-button" @click="isModalVisible = false">
            Cancel
          </button>
          <button class="custom-button" @click="editEventHandler">Edit</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script setup>
import {useEventsStore} from "@/store/events.js";
import {usePageStore} from "@/store/page.js";
import {ref, reactive, computed} from "vue";

const {eventsWithHolidays} = useEventsStore();
const {pageYear, pageMonth} = usePageStore()

import Modal from "@/components/Modal.vue";
import CustomSelect from "@/components/UI/CustomSelect.vue";

import {useFormValidation} from "@/hooks/useFormValidation.js";
const {isEndDateInvalid} = useFormValidation();

import {useRouter, useRoute} from "vue-router";
let router = useRouter();
let route = useRoute();
import CustomDateInput from "@/components/UI/CustomDateInput.vue";

let isModalVisible = ref(false);
const editedEvent = ref({
  title: null,
  startDate: null,
  endDate: null,
  repeat: null,
  description: null,
  color: null,
});
const errors = reactive({
  endDate: "",
});
const repeatOptions = ["none", "monthly", "annually"];

const {editEvent, deleteEvent} = useEventsStore();
const event = computed(() => {
  const id = route.params.id;
  return eventsWithHolidays.find((event) => event.id == id);
});

const editClickHandler = () => {
  editedEvent.value = {...event.value};
  isModalVisible.value = true;
};

const editEventHandler = () => {
  errors.endDate = isEndDateInvalid(newEvent.startDate, newEvent.endDate);
  if (errors.endDate) {
    return;
  }

  editEvent(event.value.id, {...editedEvent.value});
  isModalVisible.value = false;
};

const deleteEventHandler = async () => {
  const error = await deleteEvent(event.value.id);
  if (error) {
    return;
  }
  router.push({
    name: "calendar",
    query: {
      month: pageMonth,
      year: pageYear,
    },
  });
};
</script>

<style scoped>
.event-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: #fff;
  transition: all 0.3s ease;
  margin: 10px;
  margin-top: 30px;
}

.event-color {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-details {
  flex: 1;
}

.event-title {
  font-size: 28px;
  margin: 0;
  color: #333;
}

.event-time {
  margin: 5px 0;
  color: #666;
}

.event-repeat {
  color: #666;
}

.event-description {
  font-style: italic;
  color: #777;
}

.button-container {
  display: flex;
  gap: 15px;
  align-items: center;
}

.edit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  background-color: #2ecc71;
  color: white;
}

.delete-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover,
.edit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
