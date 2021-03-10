<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
      no-data-text="Nenhum pessoa cadastrada"
      no-results-text="Nenhum pessoa encontrada"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Pessoas</v-toolbar-title>
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Procurar"
            single-line
            hide-details
          />
          <v-spacer />
          <v-btn
            color="primary"
            dark
            class="mb-2"
            :to="`/pessoas/novo`"
          >
            Adiconar
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.type`]="{ item }">
        {{ item.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn icon :to="`/pessoas/${item._id}`">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn icon @click="remove(item._id)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      search: null,
      headers: [
        { text: 'Nome', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Tipo', value: 'type' },
        { text: 'Opções', value: 'actions', sortable: false, align: 'center' }
      ],
      loading: true
    }
  },
  computed: {
    items () {
      return this.$store.state.people
    }
  },
  async beforeMount () {
    await this.$store.dispatch('fetchPeople').finally(() => {
      this.loading = false
    })
  },
  methods: {
    async remove (id) {
      await this.$store.dispatch('destroyPeople', id)
      this.$router.go()
    }
  }
}
</script>
