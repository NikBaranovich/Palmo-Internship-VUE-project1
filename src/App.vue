<template lang="">
  <div>
    <navigation-panel />
    <button @click="saveEvent">Save Event</button>
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {
  collection,
  collectionGroup,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {db} from "@/firebase/index.js";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    getData(user.uid);
  } else {
    console.log("No user is signed in.");
  }
});
async function getData(uid) {
  const userCollectionRef = collection(db, `users/${uid}/events`);
  const GroupDoc = await getDocs(userCollectionRef); //getting all docs for particular user in sub-collection
  GroupDoc.forEach((item) => console.log(item.data())); // loop through each event document in group
}
export default {
  components: {
    NavigationPanel,
  },
  methods: {
    saveEvent() {},
  },
};
</script>
