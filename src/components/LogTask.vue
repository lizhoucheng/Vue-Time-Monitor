<template>
    <div class="form-horizontal">
        <div class="form-group">
            <div class="col-sm-6">
                <label>Name</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="taskEntry.name"
                    placeHolder="name"
                />
            </div>
            <div class="col-sm-6">
                <label>Expected Time</label>
                <input
                    type="number"
                    class="form-control"
                    v-model="taskEntry.expectedTime"
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
        <button class="btn btn-primary" v-on:click="createTask()">Save</button>
        <button v-link="'/time-entries'" class="btn btn-danger">Cancel</button>
        <hr>
    </div>
</template>

<script>
    import store from '../store'
    const fb = require('../firebaseConfig.js')
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                taskEntry: {
                    actualTime: 0,
                    working: '0%',
                    break: '0%',
                    distracting: '0%',
                    image: 'https://1.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=250'
                }
            }
        },
        methods: {
            save() {
                let taskEntry = this.taskEntry
                if(Object.keys(taskEntry).length > 1) {
                    store.commit('createTask', taskEntry)
                }
                this.taskEntry = {
                    expectedTime: 0,
                    actualTime: 0,
                    working: '0h0m0s',
                    break: '0h0m0s',
                    distracting: '0h0m0s',
                    image: 'https://1.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=250'
                }
            },
            createTask() {
                console.log(this.currentUser)
                console.log(this.selectedDate)
                fb.tasksCollection.doc(this.currentUser.uid).collection(this.selectedDate).doc(new Date().toString()).set({
                    name: this.taskEntry.name,
                    expectedTime: this.taskEntry.expectedTime,
                    actualTime: this.taskEntry.actualTime,
                    working: this.taskEntry.working,
                    break: this.taskEntry.break,
                    distracting: this.taskEntry.distracting,
                    comment: this.taskEntry.comment,
                    createdOn: new Date()
                }).then(ref => {
                    console.log('create task successfully')
                    this.$store.dispatch('fetchTaskEntries')
                    this.$router.push('/task-entries')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        computed: {
            ...mapState(['currentUser', 'selectedDate','taskEntries'])
        }
    }
</script>