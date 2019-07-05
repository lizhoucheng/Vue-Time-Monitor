<template>
    <div>
        <div class="u-link-white">
            {{ _padNumber(hours) }}h:{{ _padNumber(minutes) }}m:{{ _padNumber(seconds) }}s
            <button class="btn" @click="toggleTimer()" :disabled="buttonDisabled">start</button>
            <button class="btn btn-danger delete-button" @click="toggleTimer()" :disabled="!isRunning">cancel</button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    const fb = require('../firebaseConfig.js')

    export default {
        props: ['category', 'taskEntry'],
        data() {
            return {
                time: 0,
                interval: null,
                isRunning: false,
                hours: 0,
                minutes: 0,
                seconds: 0,
            }
        },
        created() {
            this.processTime();
        },
        watch: {
            taskEntry: function() {
                this.processTime();
            }
        },
        methods: {
            _padNumber: number => (number > 9 || number === 0) ? number : '0' + number,

            _readTimeFromSeconds: function(seconds) {
                const hours = 3600 > seconds ? 0 : parseInt(seconds / 3600, 10)
                return {
                    hours: this._padNumber(hours),
                    seconds: this._padNumber(seconds % 60),
                    minutes: this._padNumber(parseInt(seconds / 60, 10) % 60)
                }
            },
            toggleTimer() {
                console.log("timer: " + this.running)
                if (this.isRunning) {
                    clearInterval(this.interval);
                    // update database
                    const newTotalTime = parseFloat(this.taskEntry.actualTime) + this.hours + (this.minutes / 60.0).toFixed(1)
                    const taskRef = fb.tasksCollection.doc(this.currentUser.uid).collection(this.selectedDate).doc(this.taskEntry.id);
                    if(this.category ==='working') {
                        taskRef.update({
                            working : this.hours+'h'+this.minutes+'m'+this.seconds+'s',
                            actualTime: newTotalTime
                            });
                    } else if(this.category === 'break') {
                        taskRef.update({
                            break : this.hours+'h'+this.minutes+'m'+this.seconds+'s',
                            actualTime: newTotalTime
                            });
                    } else {
                        taskRef.update({
                            distracting : this.hours+'h'+this.minutes+'m'+this.seconds+'s',
                            actualTime: newTotalTime
                            });
                    }
                } else {
                    this.interval = setInterval(this.incrementTime, 1000)
                }

                if(this.isRunning) {
                    this.isRunning = false
                    this.$store.commit('disableButton', false)
                } else {
                    this.isRunning = true
                    this.$store.commit('disableButton', true)
                }
            },
            incrementTime() {
                this.seconds++;
                if(this.seconds === 60) {
                    this.seconds = 0;
                    this.minutes++;
                    if(this.minutes === 60) {
                        this.hours++;
                        this.minutes = 0;
                    }
                }
            },
            processTime() {
                const time = this.taskEntry[`${this.category}`]
                console.log('time: ' + time)
                // if(this.category === 'working') {
                //     time = this.taskEntry.working;
                // }
                const hourIdx = time.indexOf('h')
                const minuIdx = time.indexOf('m')
                const secIdx = time.indexOf('s')
                if(!hourIdx || !minuIdx || !secIdx) {
                    this.hours = 0;
                    this.minutes = 0;
                    this.seconds = 0;
                    return
                }
                this.hours = time.slice(0, hourIdx)
                this.minutes = time.slice(hourIdx+1, minuIdx)
                this.seconds = time.slice(minuIdx+1, secIdx)
            }
        },
        computed: {
            ...mapState(['currentUser', 'selectedDate', 'buttonDisabled']),
        }
    }
</script>