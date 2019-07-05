<template>
    <modal name="updateModal"
         :width="500"
         :height="500"
         @before-open="beforeOpen"
         @before-close="beforeClose"
         >
        <div class="form-horizontal">
          <div class="form-group">
            <div class="col-sm-4">
                <label>Name</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.name"
                    placeHolder="name"
                />
            </div>
            <div class="col-sm-3">
                <label>Expected Time</label>
                <input
                    type="number"
                    class="form-control"
                    v-model="taskEntry.expectedTime"
                    placeHolder="Hours"
                />
            </div>
            <!-- <div class="col-sm-3">
                <label>Actual Time</label>
                <input
                    type="number"
                    class="form-control"
                    v-model="taskEntry.actualTime"
                    placeHolder="Hours"
                />
            </div> -->
            <div class="col-sm-3">
                <label>Working</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.working"
                    placeHolder="Hours"
                />
            </div>
            <div class="col-sm-3">
                <label>break</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.break"
                    placeHolder="Hours"
                />
            </div>
            <div class="col-sm-3">
                <label>distracting</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.distracting"
                    placeHolder="Hours"
                />
            </div>
          </div>
          <div class="form-group">
              <div class="col-sm-12">
                  <label>Comment</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.comment"
                    placeholder="Comment"
                  />
              </div>
          </div>
          <button class="btn btn-primary" v-on:click="updateTask()">Update</button>
          <button v-link="'/time-entries'" class="btn btn-danger" @click="$modal.hide('updateModal')">Cancel</button>
          <hr>
      </div>
    </modal>
</template>

<script>
import {mapState} from 'vuex'
const fb = require('../firebaseConfig.js')

export default {
  name: 'UpdateModal',
  data () {
    return {
      taskEntry: {}
    }
  },
  methods: {
    beforeOpen (event) {
      this.taskEntry = event.params.taskEntry
    },
    updateTask () {
      const taskRef = fb.tasksCollection.doc(this.currentUser.uid).collection(this.selectedDate).doc(this.taskEntry.id);
      taskRef.get().then(taskEntry => {
        if(taskEntry.exist) {
          taskRef.update(this.taskEntry)
        } else {
          taskRef.set(this.taskEntry)
        }
      })

      this.$modal.hide('updateModal')
    }
  },
  computed: {
    ...mapState(['currentUser', 'selectedDate'])
  }
}
</script>