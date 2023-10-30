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
          console.log(error);
        });
    },
    fetchEvents() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          return;
        }
        const userCollectionRef = collection(db, `users/${user.uid}/events`);
        const GroupDoc = await getDocs(userCollectionRef);

        GroupDoc.forEach((item) =>
          this.eventsState.push({id: item.id, ...item.data()})
        );
        this.eventsState = this.eventsState.map((element) => {
          element.startDate = new Date(element.startDate.seconds * 1000);
          element.endDate = new Date(element.endDate.seconds * 1000);
          return element;
        });
      });
    },
    saveEvent(newEvent) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      addDoc(collection(db, `users/${auth.currentUser.uid}/events`), newEvent)
        .then((data) => {
          this.eventsState.push({id: data.id, ...newEvent});
        })
        .catch((error) => {
          return error.code;
        });
    },
    editEvent(id, event) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      const docRef = doc(db, `users/${auth.currentUser.uid}/events`, id);
      setDoc(docRef, event)
        .then(() => {
          const ev = this.eventsState.find((event) => event.id == id);
          Object.assign(ev, event);
        })
        .catch((error) => {
          return error.code;
        });
    },
    deleteEvent(id) {
      const auth = getAuth();
      if (!auth.currentUser) {
        return;
      }
      deleteDoc(doc(db, `users/${auth.currentUser.uid}/events`, id));
      const ev = this.eventsState.find((event) => event.id == id);
      this.eventsState.splice(this.eventsState.indexOf(ev), 1);
    },
  },
});
