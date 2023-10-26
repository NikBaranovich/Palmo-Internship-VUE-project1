import {defineStore} from "pinia";
import {collection, addDoc, getDocs} from "firebase/firestore";
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
    fetchEvents() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
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
      onAuthStateChanged(auth, (user) => {
        if (user) {
          addDoc(collection(db, `users/${user.uid}/events`), newEvent)
            .then((data) => {
              this.eventsState.push(newEvent);
            })
            .catch((error) => {
              switch (error.code) {
                case "permission-denied": {
                  console.log("Permission denied!");
                }
              }
            });
        }
      });
    },
  },
});
