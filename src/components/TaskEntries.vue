<template>
    <div>
        <router-link
            v-if="$route.path !== '/task-entries/log-task'"
            v-bind:class="{ disabled: buttonDisabled }"
            to="/task-entries/log-task"
            class="btn btn-primary">
            New Task
        </router-link>

        <div v-if="$route.path === '/task-entries/log-task'">
            <h3>New Task</h3>
        </div>

        <hr>

        <router-view></router-view>

        <div class="time-entries">
            <p v-if="!taskEntries.length"><strong>No Task</strong>

            <div class="list-group">
                <a class="list-group-item" v-for="(taskEntry, index) in taskEntries" :key="index">
                    <div class="row">

                        <div class="col-sm-2 user-details">
                            <img :src="taskEntry.image" class="avatar img-circle img-responsive" />
                        </div>

                        <div class="col-sm-2 text-center time-block">
                            <p class="text-center">
                                <strong>
                                    task {{index + 1}}
                                </strong>
                                <br/>
                                <strong>
                                    {{taskEntry.name}}
                                </strong>
                            </p>
                            <h3 class="list-group-item-text total-time">
                                Expected: <br/>
                                <i class="glyphicon glyphicon-time"></i> 
                                {{ taskEntry.expectedTime }} h
                            </h3>
                            <h3 class="list-group-item-text total-time">
                                Actual: <br/>
                                <i class="glyphicon glyphicon-time"></i> 
                                {{ calculateTotalTime(taskEntry) }} h
                            </h3>
                        </div>

                        <div class="col-sm-7 comment-section">
                            <p>working: <Timer category="working" :taskEntry="taskEntry"></Timer></p>
                            <p>break: <Timer category="break" :taskEntry="taskEntry"></Timer></p>
                            <p>distracting: <Timer category="distracting" :taskEntry="taskEntry"></Timer></p>
                            <p>comment: {{ taskEntry.comment }}</p>
                        </div>

                        <div class="col-sm-1">
                            <button 
                                class="btn btn-xs btn-danger delete-button"
                                @click="deleteTaskEntry(taskEntry)"
                                :disabled="buttonDisabled">
                                X
                            </button>
                            <button 
                                class="btn btn-xs"
                                @click="updateTaskEntry(taskEntry)"
                                :disabled="buttonDisabled">
                                Update
                            </button>
                            <UpdateModal></UpdateModal>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '../store'
    import {mapState} from 'vuex'
    import UpdateModal from './UpdateModal'
    import Timer from './Timer'

    export default {
        data() {
            return {
                test: false,
                workingTimerRunning: [],
                breakTimerRunning: [],
                distractingTimerRunning: [],
            }
        },
        watch: {
            taskEntries: function() {
                if(this.taskEntries) {
                    for(let i = 0; i < this.taskEntries.length; i++) {
                        this.workingTimerRunning.push(false)
                        this.breakTimerRunning.push(false)
                        this.distractingTimerRunning.push(false)
                    }
                }
            }
        },
        methods: {
            deleteTaskEntry(taskEntry) {
                if (window.confirm('Are you sure you want to delete this time entry?')) {
                    store.commit('deleteTask', taskEntry)
                }
            },
            updateTaskEntry(taskEntry) {
                this.$modal.show('updateModal', {taskEntry})
            },
            toggleWorkingTimer(index) {
                console.log('working time: ' + this.workingTimerRunning[index])
                console.log('time index: ' + index)
                this.test = !this.test
                this.workingTimerRunning[index] = !this.workingTimerRunning[index]
            },
            getWorkingTimerVariable(index) {
                console.log('get working variable: ' + index)
                return this.workingTimerRunning[index]
            },
            toggleBreakTimer(index) {
                this.breakTimerRunning[index] = !this.breakTimerRunning[index]
            },
            toggleDistractingTimer(index) {
                this.distractingTimerRunning[index] = !this.distractingTimerRunning[index]
            },
            calculateTotalTime(taskEntry) {
                const workingTime = this.processTime(taskEntry.working)
                const breakTime = this.processTime(taskEntry.break)
                const distractingTime = this.processTime(taskEntry.distracting)

                let seconds = workingTime[2] + breakTime[2] + distractingTime[2]
                let minutes = workingTime[1] + breakTime[1] + distractingTime[1]
                let hours = workingTime[0] + breakTime[0] + distractingTime[0]

                return (seconds / 3600.0 + minutes / 60.0 + hours).toFixed(1)
            },
            processTime(time) {
                const hIdx = time.indexOf('h')
                const mIdx = time.indexOf('m')
                const sIdx = time.indexOf('s')
                let hour = 0, minute = 0, second = 0
                if(hIdx >= 0 && mIdx >= 0 || sIdx >= 0) {
                    hour = parseInt(time.slice(0, hIdx))
                    minute = parseInt(time.slice(hIdx + 1, mIdx))
                    second = parseInt(time.slice(mIdx + 1, sIdx))
                }
                return [hour, minute, second]
            }
        },
        computed: {
            ...mapState(['taskEntries', 'buttonDisabled'])
        },
        components: {
            UpdateModal,
            Timer
        }
    }
</script>

<style>
    .avatar {
        height: 75px;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .user-details {
        background-color: #f5f5f5;
        border-right: 1px solid #ddd;
        margin: -10px 0;
    }
    .time-block {
        padding: 10px;
    }
    .comment-section {
        padding: 20px;
    }
</style>