import {defineStore} from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {db} from "@/firebase/index.js";
import axiosInstanse from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useEventsStore = defineStore("events", () => {
  let eventsState = reactive([]);
  let holidaysState = reactive([]);

  const eventsWithHolidays = computed(() => {
    return eventsState.concat(holidaysState);
  });

  const events = computed(() => {
    return eventsState;
  });
  const holidays = computed(() => {
    return holidaysState;
  });
  const clearEvents = () => {
    eventsState.length = 0;
  };
  const fetchHolidays = (year, countryCode) => {
    holidaysState.length = 0;

    let id = 1;
    axiosInstanse
      .get(`/PublicHolidays/${year}/${countryCode}`)
      .then((response) => {
        response.data.forEach((holiday) => {
          holidaysState.push({
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
  };

  async function fetchEvents(user) {
    if (!user || !user.emailVerified) {
      return;
    }
    try {
      const userCollectionRef = collection(db, `users/${user.uid}/events`);
      const GroupDoc = await getDocs(userCollectionRef);
      GroupDoc.forEach((item) => {
        const startDate = new Date(item.data().startDate.seconds * 1000);
        const endDate = new Date(item.data().endDate.seconds * 1000);

        eventsState.push({
          id: item.id,
          ...item.data(),
          startDate,
          endDate,
        });
      });
    } catch (error) {
      toast.error(`An error occurred while fetching events. ${error.message}`);
      return;
    }
  }
  async function saveEvent(newEvent) {
    const auth = getAuth();
    if (!auth.currentUser) {
      return;
    }
    try {
      const data = await addDoc(
        collection(db, `users/${auth.currentUser.uid}/events`),
        newEvent
      );
      eventsState.push({id: data.id, ...newEvent});
      toast.success("New event added!");
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function editEvent(id, updatedEvent) {
    const auth = getAuth();
    if (!auth.currentUser) {
      return;
    }
    try {
      const docRef = doc(db, `users/${auth.currentUser.uid}/events`, id);
      await setDoc(docRef, updatedEvent);
      toast.success("Event updated!");
      const event = eventsState.find((event) => event.id == id);
      Object.assign(event, updatedEvent);
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function deleteEvent(id) {
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
    const ev = eventsState.find((event) => event.id == id);
    eventsState.splice(eventsState.indexOf(ev), 1);
    return;
  }
  return {
    events,
    holidays,
    eventsWithHolidays,
    clearEvents,
    fetchHolidays,
    fetchEvents,
    saveEvent,
    editEvent,
    deleteEvent,
  };
});
