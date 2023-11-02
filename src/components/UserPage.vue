<template>
  <div class="user-profile">
    <!-- <div class="user-profile-info" v-if="user">
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
    </div> -->
    <div class="padding">
      <div class="col-md-8">
        <div class="card">
          <div class="card-img-top" alt="Card image cap"></div>
          <div class="card-body little-profile text-center">
            <div class="pro-img">
              <div class="image-container">
                <img
                  class="image"
                  :src="
                    user.photoURL ||
                    'https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg'
                  "
                  alt="User Photo"
                />
                <div class="overlay" @click="isImageModalOpen = true">
                  <img
                    class="camera-img"
                    src="https://www.gstatic.com/images/icons/material/system/2x/photo_camera_white_24dp.png"
                  />
                </div>
              </div>
            </div>
            <h3 class="m-b-0">
              {{ user.displayName }}
              <img
                class="edit-name-image"
                src="@/assets/images/pencil-solid.svg"
                @click="isNameModalOpen = true"
              />
            </h3>
            <p>{{ user.email }}</p>
          </div>
          <button class="custom-button" @click="isPasswordModalOpen = true">Edit password</button>
        </div>
      </div>
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
          <div class="">
            <label class="form-label" for="image-file"
              >Select a new image</label
            >
            <input
              class="form-control"
              type="file"
              id="image-file"
              @change="getFile"
            />
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
    handleUpdatePassword() {
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
.padding {
  padding: 3rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-top {
  height: 200px;
  background-color: #455a64;
}

.card-no-border .card {
  border-color: #d7dfe3;
  border-radius: 4px;
  margin-bottom: 30px;
  -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
}

.card-body {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}

.pro-img {
  margin-top: -130px;
  margin-bottom: 20px;
}

.little-profile .pro-img .image {
  width: 180px;
  height: 180px;
  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 100%;
}

html body .m-b-0 {
  margin-bottom: 0px;
}

h3 {
  line-height: 30px;
  font-size: 21px;
}

.btn-rounded.btn-md {
  padding: 12px 35px;
  font-size: 16px;
}

html body .m-t-10 {
  margin-top: 10px;
}

.btn-primary,
.btn-primary.disabled {
  background: #7460ee;
  border: 1px solid #7460ee;
  -webkit-box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
    0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
  box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
    0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
  -webkit-transition: 0.2s ease-in;
  -o-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
}

.btn-rounded {
  border-radius: 60px;
  padding: 7px 18px;
}

.m-t-20 {
  margin-top: 20px;
}

.text-center {
  text-align: center !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.pro-img {
  position: relative;
  display: flex;
  justify-content: center;
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  width: 180px;
  height: 180px;
}

img {
  width: 100%;
  height: auto;
  transition: transform 0.3s;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s;
  cursor: pointer;
}

.edit-button {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.image-container:hover .overlay {
  transform: translateY(0);
}
.camera-img {
  width: 30px;
  height: 30px;
}
.edit-name-image {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.custom-button{
  max-width: 200px;
  margin: 10px auto;
}
</style>
