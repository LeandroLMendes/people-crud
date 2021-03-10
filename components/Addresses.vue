<template>
  <div>
    <v-row no-gutters class="py-3">
      <h3 class="font-weight-regular d-block">
        Endereços
        <v-btn class="ml-2" small color="primary" @click="addAddress">
          Adicionar
          <v-icon small class="ml-1">
            mdi-plus
          </v-icon>
        </v-btn>
      </h3>
    </v-row>

    <v-card v-for="(address, i) in $v.addresses.$each.$iter" :key="i" class="pa-3 mb-3">
      <v-card-title class="subtitle-2 pa-0 mb-1">
        Endereço {{ parseInt(i)+1 }}
        <v-btn class="ml-1" small color="primary" icon @click="destroyAddress(i)">
          <v-icon small class="ml-1">
            mdi-delete
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-row>
        <v-col cols="10">
          <v-text-field
            v-model="address.street.$model"
            required
            label="Endereço *"
            :error-messages="handleAddressErrorMessages('street', i)"
            @blur="$v.addresses.$each.$iter[i].street.$touch()"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="address.number.$model"
            v-mask="'#######'"
            required
            label="Número *"
            :error-messages="handleAddressErrorMessages('number', i)"
            @blur="$v.addresses.$each.$iter[i].number.$touch()"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="address.complement"
            label="Complemento"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="address.district"
            label="Bairro"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="address.city.$model"
            required
            label="Cidade *"
            :error-messages="handleAddressErrorMessages('city', i)"
            @blur="$v.addresses.$each.$iter[i].city.$touch()"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="address.state.$model"
            required
            label="Estado *"
            :error-messages="handleAddressErrorMessages('state', i)"
            @blur="$v.addresses.$each.$iter[i].state.$touch()"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="address.cep.$model"
            v-mask="'#####-###'"
            required
            label="CEP *"
            :error-messages="handleAddressErrorMessages('cep', i)"
            @blur="$v.addresses.$each.$iter[i].cep.$touch()"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'AddressComponent',
  mixins: [validationMixin],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      addresses: this.value
    }
  },
  watch: {
    value: {
      handler (val) {
        this.addresses = val
      },
      deep: true
    },
    addresses: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  validations: {
    addresses: {
      $each: {
        street: { required },
        number: { required },
        city: { required },
        state: { required },
        cep: { required, minLength: minLength(9) }
      }
    }
  },
  methods: {
    addAddress () {
      this.addresses.push({
        street: null,
        number: null,
        complement: null,
        district: null,
        city: null,
        state: null,
        cep: null
      })
    },

    destroyAddress (i) {
      this.addresses.splice(i, 1)
    },

    handleAddressErrorMessages (name, i) {
      const errors = []

      const element = this.$v.addresses.$each.$iter[i][name]

      if (!element.$dirty) { return errors }

      if (element.$params.required) {
        !element.required && errors.push('Este Campo é obrigatório.')
      }

      if (element.$params.required) {
        !element.required && errors.push('Este Campo é obrigatório.')
      }
      if (element.$params.minLength) {
        !element.minLength && errors.push(`Este Campo não pode ter menos do que ${element.$params.minLength.min} caracteres.`)
      }

      return errors
    }
  }
}
</script>
