<template>
  <div id="wrapper">
    <Navigation v-if="currentUser"></Navigation>
    <div class="container">
      <div class="col-sm-3">
        <sidebar v-if="currentUser"></sidebar>
      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar'
  import Navigation from './components/Navigation'
  import store from './store'
  import {mapstate, mapState} from 'vuex'

  const state ={
      date: new Date()
  }

  export default {
    components: {
      'sidebar': Sidebar,
      Navigation
    },
    computed: {
      ...mapState(['currentUser']),
      totalTime () {
        return store.state.totalTime
      }
    }
  }
</script>