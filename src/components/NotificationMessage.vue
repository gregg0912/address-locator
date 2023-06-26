<template>
  <div class="notification is-danger is-light">
    <button class="delete" @click="$emit('closeNotif')"></button>
    {{ message }}
  </div>
</template>
<script>
export default {
  name: "NotificationMessage",
  props: {
    message: String,
  },
};
</script>
