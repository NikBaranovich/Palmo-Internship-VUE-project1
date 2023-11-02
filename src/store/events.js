import {defineStore} from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {db} from "@/firebase/index.js";
import axiosInstanse from "@/services/axios.js";
import {toast} from "vue3-toastify";

export const useEventsStore = defineStore("events", {
  state: () => ({
    eventsState: [],
    holidaysState: [],
  }),
  getters: {
    events: (state) => state.eventsState,
    holidays: (state) => state.holidaysState,
    eventsWithHolidays: (state) =>
      state.eventsState.concat(state.holidaysState),
  },
  actions: {
    clearEvents() {
      this.eventsState = [];
    },

    fetchHolidays(year, countryCode) {
      this.holidaysState = [];
      let id = 1;
      axiosInstanse
        .get(`/PublicHolidays/${year}/${countryCode}`)
        .then((response) => {
          response.data.forEach((holiday) => {
            this.holidaysState.push({
              id,
              title: holiday.localName,
              startDate: new Date(holiday.date),
              endDate: new Date(holiday.date),
              description: null,
              repeat: "annually",
              color: "#4CBB17",
            });
            id++;
          });
        })
        .catch((error) => {
          toast.error(`Error while fetching holidays. ${error.message}`);
        });
    },
    getCurrentUser() {
      const auth = getAuth();
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            unsubscribe();
            resolve(user);
          },
          reject
        );
      });
    },
    async fetchEvents() {
      const user = await this.getCurrentUser();
      if (!user || !user.emailVerified) {
        return;
      }
      try {
        const userCollectionRef = collection(db, `users/${user.uid}/events`);
        const GroupDoc = await getDocs(userCollectionRef);
        GroupDoc.forEach((item) => {
          const startDate = new Date(item.data().startDate.seconds * 1000);
          const endDate = new Date(item.data().endDate.seconds * 1000);

          this.eventsState.push({
            id: item.id,
            ...item.data(),
            startDate,
            endDate,
          });
        });
      } catch (error) {
        toast.error(
          `An error occurred while fetching events. ${error.message}`
        );
        return;
      }
    },
    async saveEvent(newEvent) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      try {
        const data = await addDoc(
          collection(db, `users/${auth.currentUser.uid}/events`),
          newEvent
        );
        this.eventsState.push({id: data.id, ...newEvent});
        toast.success("New event added!");
      } catch (error) {
        toast.error(error.message);
      }
    },
    async editEvent(id, updatedEvent) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      try {
        const docRef = doc(db, `users/${auth.currentUser.uid}/events`, id);
        await setDoc(docRef, updatedEvent);
        toast.success("Event updated!");
        const event = this.eventsState.find((event) => event.id == id);
        Object.assign(event, updatedEvent);
      } catch (error) {
        toast.error(error.message);
      }
    },
    async deleteEvent(id) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      try {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/events`, id));
      } catch (error) {
        toast.error(error.message);
        return error;
      }
      const ev = this.eventsState.find((event) => event.id == id);
      this.eventsState.splice(this.eventsState.indexOf(ev), 1);
      return;
    },
  },
});
