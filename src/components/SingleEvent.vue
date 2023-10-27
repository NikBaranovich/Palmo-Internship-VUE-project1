<template>
  <div class="event-info" v-if="event">
    <div :style="{background: event.color}" class="event-color"></div>
    <div class="event-details">
      <h2>{{ event.title }}</h2>
      <p>Start: {{ event.startDate }}</p>
      <p>End: {{ event.endDate }}</p>
      <p>Description: {{ event.description }}</p>
    </div>
    <button @click="editClickHandler">Edit</button>
    <button @click="deleteEventHandler">Delete</button>
    <modal v-if="isModalVisible">
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
          </div>
          <div>
            <label for="event-color">Цвет события</label>
            <input for="event-color" type="color" v-model="editedEvent.color" />
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
          <button type="button" @click="closeModal">Cancel</button>
          <button @click="editEventHandler">Edit</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import {useEventsStore} from "@/store/events.js";
import {mapActions, mapState} from "pinia";
import Modal from "@/components/Modal.vue";
import CustomDateInput from "@/components/UI/CustomDateInput.vue";
import {redirectMixin} from "@/mixins/redirect.js";
import {modalMixin} from "@/mixins/modal.js";

export default {
  data() {
    return {
      isModalVisible: false,
      editedEvent: {
        title: null,
        startDate: null,
        endDate: null,
        description: null,
        color: null,
      },
    };
  },
  mixins: [redirectMixin, modalMixin],
  components: {
    Modal,
    CustomDateInput,
  },
  methods: {
    ...mapActions(useEventsStore, ["editEvent", "deleteEvent"]),
    editClickHandler() {
      this.editedEvent = {...this.event};
      this.openModal();
    },
    editEventHandler() {
      this.editEvent(this.event.id, {...this.editedEvent});
      this.closeModal();
    },
    deleteEventHandler() {
      this.deleteEvent(this.event.id);
      this.goToPage("calendar");
    },
  },
  computed: {
    ...mapState(useEventsStore, ["events"]),
    event() {
      const id = this.$route.params.id;
      console.log(this.events);
      return this.events.find((event) => event.id == id);
    },
  },
};
</script>

<style scoped>
.event-info {
  display: flex;
  margin: 20px 0;
}

.event-color {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.event-details {
  flex: 1;
}

.event-details h2 {
  font-size: 20px;
}

.event-details p {
  margin: 5px 0;
}
</style>
