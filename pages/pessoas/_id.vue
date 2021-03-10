<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
      <v-row class="mb-3" no-gutters>
        <v-col cols="9">
          <h2 class="font-weight-medium">
            <v-btn icon small color="secondary" style="margin-top: -5px" @click="$router.replace('/pessoas')">
              <v-icon>
                mdi-arrow-left
              </v-icon>
            </v-btn>
            {{ isNew ? 'Nova' : 'Editar' }} Pessoa
          </h2>
        </v-col>
        <v-col cols="3">
          <v-btn
            type="submit"
            :disabled="!valid"
            block
            color="success"
            :loading="loading"
          >
            Salvar
          </v-btn>
        </v-col>
      </v-row>

      <v-card class="pa-3 mb-3">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="type"
              required
              :items="[{value: 'PF', text: 'Pessoa física'}, {value: 'PJ', text: 'Pessoa jurídica'}]"
              label="Tipo"
            />
          </v-col>

          <template v-if="type === 'PJ'">
            <v-col cols="8">
              <v-text-field
                v-model="razaoSocial"
                required
                label="Razão Social *"
                :error-messages="handleErrorMessages('razaoSocial')"
                @blur="$v.razaoSocial.$touch()"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="cnpj"
                v-mask="'##.###.###/####-##'"
                required
                label="CNPJ *"
                :error-messages="handleErrorMessages('cnpj')"
                @blur="$v.cnpj.$touch()"
              />
            </v-col>
          </template>

          <template v-else>
            <v-col cols="5">
              <v-text-field
                v-model="name"
                label="Nome *"
                required
                :error-messages="handleErrorMessages('name')"
                @blur="$v.name.$touch()"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="cpf"
                v-mask="'###.###.###-##'"
                required
                label="CPF *"
                :error-messages="handleErrorMessages('cpf')"
                @blur="$v.cpf.$touch()"
              />
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="sexo"
                required
                :items="[{value: 'M', text: 'Masculino'}, {value: 'F', text: 'Feminino'}]"
                label="Sexo *"
                :error-messages="handleErrorMessages('sexo')"
                @blur="$v.sexo.$touch()"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="birthdate"
                v-mask="'##/##/####'"
                required
                label="Data de Nascimento *"
                prepend-icon="mdi-calendar"
                :error-messages="handleErrorMessages('birthdate')"
                autocomplete="no"
                @blur="$v.birthdate.$touch()"
              />
            </v-col>
          </template>

          <v-col cols="4">
            <v-text-field
              v-model="email"
              label="E-mail"
              :error-messages="handleErrorMessages('email')"
              @blur="$v.email.$touch()"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field
              v-model="phone"
              v-mask="'(##) ####-####'"
              label="Telefone"
              :error-messages="handleErrorMessages('phone')"
              @blur="$v.phone.$touch()"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field
              v-model="celphone"
              v-mask="'(##) #####-####'"
              label="Celular"
              :error-messages="handleErrorMessages('celphone')"
              @blur="$v.celphone.$touch()"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="photo"
              label="Foto (apenas URL)"
            />
          </v-col>
        </v-row>
      </v-card>

      <Addresses ref="addresses" v-model="addresses" />

      <v-row>
        <v-spacer />
        <v-col cols="3">
          <v-btn
            type="submit"
            :disabled="!valid"
            block
            class="mt-3"
            color="success"
            :loading="loading"
          >
            Salvar
          </v-btn>
        </v-col>
      </v-row>
      </address>
    </v-form>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { minLength, email, requiredIf } from 'vuelidate/lib/validators'

import Addresses from '~/components/Addresses.vue'

export default {
  name: 'PersonPage',
  components: {
    Addresses
  },
  mixins: [validationMixin],
  data (vm) {
    return {
      name: null,
      type: 'PF',
      cpf: null,
      cnpj: null,
      phone: null,
      celphone: null,
      razaoSocial: null,
      sexo: null,
      birthdate: null,
      email: null,
      photo: null,
      addresses: [{
        street: null,
        number: null,
        complement: null,
        district: null,
        city: null,
        state: null,
        cep: null
      }],
      loading: false,
      valid: false
    }
  },
  validations: {
    name: { required: requiredIf('isPF'), minLength: minLength(4) },
    razaoSocial: { required: requiredIf('isPJ'), minLength: minLength(4) },
    cpf: {
      required: requiredIf('isPF'),
      minLength: minLength(14)
    },
    cnpj: { required: requiredIf('isPJ'), minLength: minLength(14) },
    phone: { minLength: minLength(14) },
    celphone: { minLength: minLength(15) },
    sexo: { required: requiredIf('isPF') },
    birthdate: { required: requiredIf('isPF'), minLength: minLength(10) },
    email: { email }
  },
  async fetch () {
    if (this.isNew) { return false }
    const data = await this.$store.dispatch('findPeople', this.$route.params.id)
    this.name = data.name
    this.type = data.type
    this.cpf = data.cpf
    this.cnpj = data.cnpj
    this.phone = data.phone
    this.celphone = data.celphone
    this.razaoSocial = data.razaoSocial
    this.sexo = data.sexo
    this.birthdate = data.birthdate
    this.email = data.email
    this.photo = data.photo
    this.addresses = data.addresses
  },
  computed: {
    isPF () {
      return this.type === 'PF'
    },
    isPJ () {
      return this.type === 'PJ'
    },
    isNew () {
      return this.$route.params.id === 'novo'
    }
  },

  methods: {
    async submit () {
      this.$v.$touch()
      this.$refs.addresses.$v.$touch()

      if (this.$v.$invalid || this.$refs.addresses.$v.$invalid) { return false }

      this.loading = true

      const model = {
        name: this.name,
        type: this.type,
        cpf: this.cpf,
        cnpj: this.cnpj,
        phone: this.phone,
        celphone: this.celphone,
        razaoSocial: this.razaoSocial,
        sexo: this.sexo,
        birthdate: this.birthdate,
        email: this.email,
        photo: this.photo,
        addresses: this.addresses
      }

      await this.$store.dispatch('savePeople', {
        id: !this.isNew ? this.$route.params.id : null,
        data: model
      }).finally(() => {
        this.loading = false
      })

      this.$router.push('/pessoas')
    },

    handleErrorMessages (name) {
      const errors = []

      if (!this.$v[name].$dirty) { return errors }

      if (this.$v[name].$params.required) {
        !this.$v[name].required && errors.push('Este Campo é obrigatório.')
      }

      if (this.$v[name].$params.required) {
        !this.$v[name].required && errors.push('Este Campo é obrigatório.')
      }
      if (this.$v[name].$params.minLength) {
        !this.$v[name].minLength && errors.push(`Este Campo não pode ter menos do que ${this.$v[name].$params.minLength.min} caracteres.`)
      }
      if (this.$v[name].$params.email) {
        (!this.$v.email.email) && errors.push('E-mail inválido.')
      }

      return errors
    }

  }
}
</script>
