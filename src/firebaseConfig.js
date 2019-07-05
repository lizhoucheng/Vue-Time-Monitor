import firebase from 'firebase'
import 'firebase/firestore'
import Config from './config.js'

// firebase init goes here
const config = {
    apiKey: Config.apiKey,
    authDomain: Config.authDomain,
    databaseURL: Config.databaseURL,
    projectId: Config.projectId,
    storageBucket: Config.storageBucket,
    messagingSenderId: Config.messagingSenderId,
    appId: Config.appId
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const tasksCollection = db.collection('tasks')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    tasksCollection,
}