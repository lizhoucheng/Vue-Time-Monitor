<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>Vue Task Monitor</h1>
                <p>For the complete project, please check out <a href="https://github.com/lizhoucheng">Github</a></p>
            </div>
            <div class="col2" :class="{'signup-form': !showLoginForm && !showForgotPassword}">
                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Master Your Time</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="time@vue.com" id="email1" />

                    <label for="password1">Password</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="secret" id="password1"/>

                    <button @click="login" class="button">Log In</button>

                    <div class="extras">
                        <a @click="togglePasswordReset">Forgot Password</a>
                        <br />
                        <a @click="toggleForm">Create An Account</a>
                    </div>
                </form>
                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset the password</p>
                        
                        <label for="email3">Email:</label>
                        <label v.model.trim="passwordForm.email" type="text" placeholder="vue@time.com" id="email3" />

                        <button @click="resetPassword" class="button">Submit</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Back to Login</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <button @click="togglePasswordReset" class="button">Back to Login</button>
                    </div>
                </form>
                <form v-if="!showForgotPassword && !showLoginForm" @submit.prevent>
                    <h1>Sign Up</h1>

                    <label for="name">name</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="time savier" id="name" />

                    <label for="email2">email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="time@vue.com" id="email2" /> 

                    <label for="password2">Password</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />

                    <button @click="signup" class="button">Sign Up</button>

                    <div class="extras">
                        <a @click='toggleForm'>Back to Log In</a>
                    </div>
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        data() {
            return{
                loginForm:{
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    email: '',
                    password: '',
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                this.showLoginForm = !this.showLoginForm
            },
            togglePasswordReset() {
                if (this.showForgotPassword) {
                    this.showLoginForm = true
                    this.showForgotPassword = false
                    this.passwordResetSuccess = false
                } else {
                    this.showLoginForm = false
                    this.showForgotPassword = true
                } 
            },
            login() {
                this.performingRequest = true

                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    this.$store.dispatch('fetchUserProfile')
                    this.$store.commit('setCurrentDate')
                    this.$store.dispatch('fetchCurrentDateTaskEntries')
                    this.performingRequest = false
                    this.$router.push('/home')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            signup() {
                this.performingRequest = true
                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    console.log('sign up')
                    console.log(user)

                    //create user obj
                    fb.usersCollection.doc(user.user.uid).set({
                        name: this.signupForm.name,
                        title:this.signupForm.title
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/home')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                })
            }
        }
    }
</script>