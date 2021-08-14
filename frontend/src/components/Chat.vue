<template>
  <div>
    <p>&nbsp;</p>
    <div id="app" class="container">
      <div v-if="!authenticatedUser" class="jumbotron">
        <h1>Welcome to Static Web Apps chat</h1>
        <hr />
        <button class="btn btn-dark btn-lg" v-on:click="login()">
          <i class="fab fa-github"></i>&nbsp; Sign in with GitHub
        </button>
      </div>
      <div v-if="authenticatedUser">
        <div class="row">
          <div class="col-sm-9">
            <h3>
              <img
                src="https://docs.microsoft.com/en-us/azure/media/index/static-apps.svg"
                style="height: 32px"
              />
              &nbsp;&nbsp;Static Web Apps Chat
            </h3>
          </div>
          <div class="col-sm-3 text-right">
            <a :href="`https://github.com/${authenticatedUser.userDetails}`">
              <img
                :src="`https://github.com/${authenticatedUser.userDetails}.png`"
                style="width: 24px"
              />
              {{ authenticatedUser.userDetails }}
            </a>
            <a
              href="#"
              @click.prevent="logout"
              class="text-info small text-muted"
              >[Logout]</a
            >
          </div>
        </div>
        <div class="row" v-if="ready">
          <div class="signalr-demo col-sm">
            <hr />
            <form v-on:submit.prevent="sendNewMessage">
              <input
                type="text"
                v-model="newMessage"
                id="message-box"
                class="form-control"
                placeholder="Type message here..."
                autocomplete="off"
              />
            </form>
          </div>
        </div>
        <div class="row" v-if="!ready">
          <div class="col-sm">
            <div>Loading...</div>
          </div>
        </div>
        <div v-if="ready">
          <transition-group name="slide-fade" tag="div">
            <div class="row" v-for="message in messages" :key="message.id">
              <div class="col-sm">
                <hr />
                <div style="vertical-align: top">
                  <div style="display: inline-block; vertical-align: top">
                    <a :href="`https://github.com/${message.sender}`">
                      <img
                        :src="`https://github.com/${message.sender}.png`"
                        style="width: 64px"
                      />
                    </a>
                  </div>
                  <div
                    style="
                      display: inline-block;
                      padding-left: 12px;
                      max-width: 90%;
                      vertical-align: top;
                    "
                  >
                    <div>
                      <a :href="`https://github.com/${message.sender}`">
                        <span class="text-info small"
                          ><strong>{{ message.sender }}</strong></span
                        >
                      </a>&nbsp;
                      <span
                        class="text-info small text-muted"
                        :title="message.timestamp"
                        >{{ message.ago }}</span
                      >
                    </div>
                    <div>
                      {{ message.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as timeago from 'timeago.js'
import * as signalR from '@microsoft/signalr'

export default {
  name: 'Chat',
  data() {
    return {
      username: '',
      newMessage: '',
      messages: [],
      ready: false,
      authenticatedUser: null,
      counter: 0,
    }
  },
  methods: {
    async sendNewMessage() {
      const message = this.newMessage
      this.newMessage = ''
      await axios.post('/api/messages', {
        text: message
      })
    },
    login() {
      location.href = '/.auth/login/github'
    },
    logout() {
      location.href = '/.auth/logout'
    },
    addNewMessage(message) {
      message.id = message.RowKey || this.counter++
      message.ago = timeago.format(message.timestamp)
      this.messages.unshift(message)
    },
  },
  mounted: async function () {
    setInterval(
      function updateTimes() {
        this.messages.forEach((m) => (m.ago = timeago.format(m.timestamp)))
      }.bind(this),
      10000
    )

    this.authenticatedUser = await axios
      .get('/.auth/me')
      .then((resp) => resp.data.clientPrincipal)
      .catch(() => null)

    if (this.authenticatedUser) {
      const messageHistory = await axios
        .get('/api/messages')
        .then((resp) => resp.data)

      for (const message of messageHistory.reverse()) {
        this.addNewMessage(message)
      }

      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api')
        .withAutomaticReconnect()
        .build()

      connection.on('newMessage', this.addNewMessage.bind(this))
      connection.onclose(() => console.log('disconnected'))

      await connection.start()
      this.ready = true
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
