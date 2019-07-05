<template>
    <header>
    <div>
        <h3>Today's Tasks</h3>
        <div class="time-entries">
            <p v-if="!currentDateTaskEntries.length"><strong>No Task</strong>
            <div class="list-group">
                <div class="list-group-item text-center time-block" style="margin: 10px" v-for="(taskEntry, index) in currentDateTaskEntries" :key="index">
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
                            <i class="glyphicon glyphicon-time"></i> 
                            {{ taskEntry.expectedTime }} h
                        </h3>
                </div>
            </div>
        </div>
    </div>
    </header>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                taskEntries : []
            }
        },
        methods: {
            handleSelected(event) {
                console.log(event);
            }
        },
        components: {
            Datepicker
        },
        computed: {
            ...mapState(['currentDateTaskEntries'])
        }
    }
</script>

<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
body {
    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
    padding: 1em 2em 2em;
}
input, select {
    padding: .75em .5em;
    font-size: 100%;
    border: 1px solid #ccc;
    width: 100%
}
select {
    height: 2.5em;
}
.example {
    background: #f2f2f2;
    border: 1px solid #ddd;
    padding: 0em 1em 1em;
    margin-bottom: 2em;
}
code,
pre {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #bbb;
    display: block;
    background: #ddd;
    border-radius: 3px;
}
.settings {
    margin: 2em 0;
    border-top : 1px solid #bbb;
    background: #eee;
}
h5 {
    font-size:100%;
    padding: 0;
}
.form-group {
    margin-bottom: 1em;
}
.form-group label {
    font-size: 80%;
    display: block;
}
</style>