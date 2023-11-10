<template>
  <div class="user-profile" v-if="user">
    <div class="padding">
      <div class="col-md-8">
        <div class="card">
          <div class="card-img-top" alt="Card image cap"></div>
          <div class="card-body little-profile text-center">
            <div class="pro-img">
              <div class="image-container">
                <img
                  class="image"
                  referrerpolicy="no-referrer"
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
          <button class="custom-button" @click="isPasswordModalOpen = true">
            Change password
          </button>
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
              @input="validateUsername"
            />
            <div v-color:red v-if="usernameError" class="invalid-input-error">
              {{ usernameError }}
            </div>
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
              @input="validatePassword"
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
<script setup>
import {useAuthorizationStore} from "@/store/authorization.js";
import {storeToRefs} from "pinia";
import {
  getStorage,
  ref as dbRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {ref} from "vue";
import Modal from "@/components/Modal.vue";

let isNameModalOpen = ref(false);
let isImageModalOpen = ref(false);
let isPasswordModalOpen = ref(false);
let username = ref("");
let password = ref("");
let file = ref(null);
let usernameError = ref("");
let fileError = ref("");
let passwordError = ref("");

const {user} = storeToRefs(useAuthorizationStore());
import {useFormValidation} from "@/hooks/useFormValidation.js";

const {isPasswordInvalid, isNameInvalid, isImageFileInvalid} =
  useFormValidation();
const {updateUserImage, updateUserPassword, updateUserName} =
  useAuthorizationStore();

const validateUsername = () => {
  usernameError.value = isNameInvalid(username.value);
};
const validatePassword = () => {
  passwordError.value = isPasswordInvalid(password.value);
};
const handleUpdateUserName = () => {
  validateUsername();

  if (usernameError.value) {
    return;
  }
  updateUserName(username.value);
  isNameModalOpen.value = false;
};
const handleUpdatePassword = () => {
  validatePassword();

  if (passwordError.value) {
    return;
  }

  updateUserPassword(password.value);
  isPasswordModalOpen.value = false;
};
const uploadImage = async () => {
  fileError.value = isImageFileInvalid(file.value);

  if (fileError.value) {
    return;
  }
  const storage = getStorage();
  const storageRef = dbRef(storage, `${user.value.uid}/${file.value.name}`);
  await uploadBytes(storageRef, file.value);
  updateUserImage(await getDownloadURL(storageRef));
  isImageModalOpen.value = false;
};
const getFile = (event) => {
  fileError.value = isImageFileInvalid(event.target.files[0]);
  if (fileError.value) {
    return;
  }
  file.value = event.target.files[0];
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

 .card {
  border-color: var(--primary-accent) !important;

  background-color: var(--secondary-color-contrast) !important;
  border-radius: 4px;
  margin-bottom: 30px;
  -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
}

.card-body {
  -ms-flex: 1 1 auto;
  background-color: var(--secondary-color-contrast);
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
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  transform: translateY(100%);
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
.custom-button {
  max-width: 200px;
  margin: 10px auto;
}
</style>
