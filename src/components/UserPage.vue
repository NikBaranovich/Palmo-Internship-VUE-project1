<template>
  <div class="user-profile">
    <div class="user-profile-info" v-if="user">
      <img
        :src="
          user.photoURL ||
          'https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg'
        "
        alt="User Photo"
      />
      <div>
        <h2>{{ user.displayName }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
    <div class="user-profile-actions">
      <button @click="isNameModalOpen = true">Edit username</button>
      <button @click="isImageModalOpen = true">Edit image</button>

      <button @click="isPasswordModalOpen = true">Edit password</button>
    </div>
    <modal v-if="isNameModalOpen">
      <template v-slot:header>
        <h2>Edit Username</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="username">New username:</label>
            <input
              class="form-input"
              type="text"
              id="username"
              v-model="username"
            />
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-group">
          <button type="button" @click="isNameModalOpen = false">Cancel</button>
          <button @click="handleUpdateUserName">Update</button>
        </div>
      </template>
    </modal>
    <modal v-if="isImageModalOpen">
      <template v-slot:header>
        <h2>Edit Image</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="image-file">Upload new image</label>
            <input type="file" id="image-file" @change="getFile" />
            <div v-color:red v-if="fileError" class="invalid-input-error">
              {{ fileError }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-group">
          <button type="button" @click="isImageModalOpen = false">
            Cancel
          </button>
          <button @click="uploadImage">Update</button>
        </div>
      </template>
    </modal>
    <modal v-if="isPasswordModalOpen">
      <template v-slot:header>
        <h2>Edit Password</h2>
      </template>
      <template v-slot:body>
        <div>
          <div class="form-group">
            <label for="username">New password:</label>
            <input
              class="form-input"
              type="text"
              id="username"
              v-model="password"
            />
            <div v-color:red v-if="passwordError" class="invalid-input-error">
              {{ passwordError }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-group">
          <button type="button" @click="isPasswordModalOpen = false">
            Cancel
          </button>
          <button @click="handleUpdatePassword">Update</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Modal from "@/components/Modal.vue";
import {formValidationMixin} from "@/mixins/formValidation.js";

export default {
  data() {
    return {
      isNameModalOpen: false,
      isImageModalOpen: false,
      isPasswordModalOpen: false,
      username: "",
      password: "",
      file: null,
      fileError: "",
      passwordError: "",
    };
  },
  components: {
    Modal,
  },
  mixins: [formValidationMixin],
  computed: {
    ...mapState(useAuthorizationStore, ["user"]),
  },
  methods: {
    ...mapActions(useAuthorizationStore, [
      "updateUserImage",
      "updateUserPassword",
      "updateUserName",
    ]),
    handleUpdateUserName() {
      this.updateUserName(this.username);
      this.isNameModalOpen = false;
    },
    handleUpdatePassword(){
      this.passwordError = this.isPasswordInvalid(this.password);
      if (this.passwordError) {
        return;
      }

      this.updateUserPassword(this.password);
      this.isPasswordModalOpen = false;
    },
    async uploadImage() {
      if (this.fileError) {
        return;
      }
      const storage = getStorage();
      const storageRef = ref(storage, `${this.user.uid}/${this.file.name}`);
      await uploadBytes(storageRef, this.file);
      this.updateUserImage(await getDownloadURL(storageRef));
      this.isImageModalOpen = false;
    },
    getFile(event) {
      if (event.target.files[0].type !== "image/jpeg") {
        this.fileError = "Unsupported file format";
        return;
      }
      this.file = event.target.files[0];
      this.fileError = "";
    },
  },
};
</script>
<style scoped>
.user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.user-profile-info {
  display: flex;
  align-items: center;
}

.user-profile-info img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-profile-actions button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.user-profile-actions button:hover {
  background-color: #0056b3;
}
</style>
