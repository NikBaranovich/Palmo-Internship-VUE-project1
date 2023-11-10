<template>
  <div class="custom-modal">
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"> </slot>
        </div>
        <div class="modal-body">
          <slot name="content"> </slot>
        </div>
        <div class="modal-footer">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: var(--modal-color);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-body {
  text-align: center;
}

.modal-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
