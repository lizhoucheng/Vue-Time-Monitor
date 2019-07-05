<template>
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          Vue Task Monitor
        </a>
        <ul class="nav navbar-nav">
          <!-- <router-link tag="li" to="/"><a>Home</a></router-link>
          <router-link tag="li" to="/time-entries"><a>Time Entries</a></router-link> -->
          <li><datepicker
            :bootstrapStyling="true"
            :clearButton="true"
            :inline="false"
            :disabled="buttonDisabled"
            @selected="handleSelected"
        >
          Pick A Day
        </datepicker></li>
        <li><a @click="logout">logout</a></li>
        </ul>
      </div>
    </nav>
</template>

<script>
    import Datepicker from 'vuejs-datepicker'
    import { mapState } from 'vuex'

    const fb = require('../firebaseConfig.js')

    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            },
            handleSelected(event) {
                if(event) {
                  this.$store.commit('setSelectedDate', event.getDate() + '.' + (event.getMonth()+1) + '.'+ event.getFullYear()) // the month is 0-based
                  this.$store.dispatch('fetchTaskEntries')
                  this.$router.push('/task-entries')
                } else {
                  this.$store.commit('setSelectedDate', null)
                  this.$router.push('/home')
                }
            }
        },
        components: {
            Datepicker,
        },
        computed: {
          ...mapState(['buttonDisabled'])
        }
    }
</script>