<template>
  <div class="modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <slot name="header"></slot>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  background-color: var(--secondary-color);
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
 
}

.modal-header h2 {
  margin: 0;
}
.modal-body {
  padding: 20px;
}

.modal-footer {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: right;
}
</style>
