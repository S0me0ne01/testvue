<template>
  <div class="modal">
    <h3>Edit Request</h3>
    <form @submit.prevent="saveChanges">
      <input v-model="currentRequest.applicant.first_name" placeholder="First Name" />
      <input v-model="currentRequest.applicant.last_name" placeholder="Last Name" />
      <textarea v-model="currentRequest.description" placeholder="Description"></textarea>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['currentRequest']),
  },
  methods: {
    saveChanges() {
      // API call to save changes (PATCH)
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  // Add your styling here
}
</style>
