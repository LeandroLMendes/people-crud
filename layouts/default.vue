<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app expand-on-hover>
      <v-list>
        <v-list-item
          v-for="(item, i) in menu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu offset-y left>
        <template #activator="{ on }">
          <v-btn icon x-larger dark v-on="on">
            <v-avatar :size="avatarSize" color="grey">
              <v-icon :style="'font-size: ' + avatarSize + 'px'">
                mdi-emoticon-happy
              </v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-card tile>
          <v-card-title class="grey--text text--darken-3 py-2">
            <span class="body-1">Visitante</span>
          </v-card-title>

          <v-divider class="grey lighten-3" />

          <v-list dense>
            <v-list-item :to="'/'">
              <v-list-item-icon>
                <v-icon v-text="'mdi-account'" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Edital Perfil'" />
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="'/'">
              <v-list-item-icon>
                <v-icon v-text="'mdi-exit-to-app'" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Sair'" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      top
      right
      :timeout="6000"
    >
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn text dark v-bind="attrs" @click.native="snackbar = {display: false}">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: false,
      title: 'Medprev',
      avatarSize: 44
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu || []
    },
    snackbar: {
      get () {
        return this.$store.state.snackbar
      },
      set (payload) {
        this.$store.commit('setSnackbar', { ...payload })
      }
    }
  }
}
</script>
