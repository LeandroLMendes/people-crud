export const state = () => ({
  API_HOST: null,
  menu: [
    {
      icon: 'mdi-account-group',
      title: 'Pessoas',
      to: '/pessoas'
    }
  ],
  snackbar: {
    text: '',
    display: false,
    color: 'info',
    timeout: 6000
  },
  people: []
})

export const mutations = {
  setHOST: (state, payload) => (state.API_HOST = payload || null),
  setMe: (state, payload) => (state.me = payload || null),
  setSnackbar (state, { text, link, display, color, timeout }) {
    state.snackbar = {
      text: text || state.snackbar.text,
      link,
      display,
      color: color || state.snackbar.color,
      timeout: timeout || state.snackbar.timeout
    }
  },
  setPeople: (state, payload) => (state.people = payload || null)
}

export const actions = {
  findPeople (context, id) {
    return this.$axios
      .$get(`/${id}`)
      .then((response) => {
        return response
      })
      .catch(function (error) {
        return error
      })
  },

  fetchPeople (context) {
    return this.$axios
      .$get('/')
      .then((response) => {
        context.commit('setPeople', response)
        return response
      })
      .catch(function (error) {
        return error
      })
  },

  savePeople (context, { ...payload }) {
    if (payload.id) {
      return this.$axios.put(`/${payload.id}`, payload.data).then((response) => {
        context.commit('setSnackbar', { text: 'Salvo com sucesso', display: true, color: 'success' })
        return response
      }).catch(() => {
        context.commit('setSnackbar', { text: 'Error ao salvar', display: true, color: 'error' })
      })
    }

    return this.$axios.post('/', payload.data)
  },

  destroyPeople (context, id) {
    return this.$axios.delete(`${id}`).then((response) => {
      context.commit('setSnackbar', { text: 'Excluido com sucesso', display: true, color: 'success' })
      return response
    }).catch(() => {
      context.commit('setSnackbar', { text: 'Error ao excluir', display: true, color: 'error' })
    })
  }
}
