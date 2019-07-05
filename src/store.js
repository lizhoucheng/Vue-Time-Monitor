import Vuex from 'vuex'
import Vue from 'vue'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

//handle page reload
fb.auth.onAuthStateChanged(user => {
  if(user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
    store.commit('setCurrentDate')
    store.dispatch('fetchCurrentDateTaskEntries')
  }
})

var store = new Vuex.Store({
  state: {
    taskCollection: [],
    taskEntries: [],
    currentDateTaskEntries: [],
    currentUser: null,
    currentDate: null,
    selectedDate: null,
    totalTime: 0,
    buttonDisabled: false,
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setCurrentDate(state) {
      const today = new Date();
      state.currentDate = today.getDate() + '.' + (today.getMonth()+1) + '.' + today.getFullYear()
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setTaskCollection(state, val) {
      state.taskCollection = val
    },
    setTaskEntries(state, val) {
      state.taskEntries = val
    },
    setCurrentDateTaskEntries(state, val) {
      state.currentDateTaskEntries = val
    },
    setSelectedDate(state, val) {
      state.selectedDate = val
    },
    deleteTask(state, taskEntry) {
      let index = state.taskEntries.indexOf(taskEntry)
      state.taskEntries.splice(index, 1)
      fb.tasksCollection.doc(state.currentUser.uid).collection(state.selectedDate).doc(taskEntry.id).delete()
    },
    createTask(state, taskEntry) {
      state.taskEntries.push(taskEntry)
    },
    disableButton(state, val) {
      state.buttonDisabled = val
    }
  },
  actions: {
    fetchUserProfile({commit, state}) {
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    },
    fetchTaskEntries({commit, state}) {
      fb.tasksCollection.doc(state.currentUser.uid).collection(state.selectedDate).orderBy('createdOn').get().then(querySnapshot => {
        let tasksArray = []

        querySnapshot.forEach(doc => {
          let task = doc.data();
          task.id = doc.id
          tasksArray.push(task)
        })

        store.commit('setTaskEntries', tasksArray)
        if(state.selectedDate === state.currentDate) {
          store.commit('setCurrentDateTaskEntries', tasksArray)
        }
      })
    },
    fetchCurrentDateTaskEntries({commit, state}) {
      fb.tasksCollection.doc(state.currentUser.uid).collection(state.currentDate).orderBy('createdOn').get().then(querySnapshot => {
        let taskEntries = []

        querySnapshot.forEach(doc => {
            let task = doc.data();
            task.id = doc.id
            taskEntries.push(task)
        })

        store.commit('setCurrentDateTaskEntries', taskEntries)
      })
    },
    clearData({commit}) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setTaskEntries', [])
      commit('setSelectedDate', null)
    },
    clearDateData({commit}) {
      commit('setTaskEntries', [])
      commit('setSelectedDate', null)
    }
  }
})

export default store