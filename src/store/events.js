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

export const useEventsStore = defineStore("events", {
  state: () => ({
    eventsState: [],
  }),
  getters: {
    events: (state) => state.eventsState,
  },
  actions: {
    eventsInRange(startDate, endDate) {
      return this.eventsState.filter((event) => {
        if (
          (event.startDate <= startDate && event.endDate >= endDate) ||
          (event.startDate >= startDate && event.endDate <= endDate)
        ) {
          return true;
        }

        if (
          (event.startDate <= startDate && event.endDate >= startDate) ||
          (event.startDate <= endDate && event.endDate >= endDate)
        ) {
          return true;
        }

        if (event.repeat == "monthly") {
          return true;
        }

        if (event.repeat === "annually") {
          const startMonthDay =
            startDate.getMonth() * 100 + startDate.getDate();
          const endMonthDay = endDate.getMonth() * 100 + endDate.getDate();

          const eventStartMonthDay =
            event.startDate.getMonth() * 100 + event.startDate.getDate();
          const eventEndMonthDay =
            event.endDate.getMonth() * 100 + event.endDate.getDate();

          return (
            (eventStartMonthDay >= startMonthDay &&
              eventStartMonthDay <= endMonthDay) ||
            (eventEndMonthDay >= startMonthDay &&
              eventEndMonthDay <= endMonthDay)
          );
        }

        return false;
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
        console.log("Error!");
        return;
      }
      addDoc(collection(db, `users/${auth.currentUser.uid}/events`), newEvent)
        .then((data) => {
          this.eventsState.push({id: data.id, ...newEvent});
        })
        .catch((error) => {
          switch (error.code) {
            case "permission-denied": {
              console.log("Permission denied!");
            }
          }
        });
    },
    editEvent(id, event) {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.log("Error!");
        return;
      }
      const docRef = doc(db, `users/${auth.currentUser.uid}/events`, id);
      setDoc(docRef, event)
        .then(() => {
          const ev = this.eventsState.find((event) => event.id == id);
          Object.assign(ev, event);
        })
        .catch((error) => {
          switch (error.code) {
            case "permission-denied": {
              console.log("Permission denied!");
            }
          }
        });
    },
    deleteEvent(id) {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.log("Error!");
        return;
      }
      deleteDoc(doc(db, `users/${auth.currentUser.uid}/events`, id));
      const ev = this.eventsState.find((event) => event.id == id);
      this.eventsState.splice(this.eventsState.indexOf(ev), 1);
    },
  },
});
