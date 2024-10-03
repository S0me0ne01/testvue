<template>
  <div class="request-list-page">
    <v-card>
      <v-card-title>
        <span style="margin-right: 15px">Список заявок</span>
        <v-btn color="green white--text" @click="openCreateOrderDialog">Создать</v-btn>
        <v-spacer></v-spacer>

        <v-autocomplete
          v-model="selectedPremise"
          :items="premises.results"
          item-text="short_address"
          item-value="id"
          label="Фильтр по дому"
          style="max-width: 250px; margin-right: 15px"
          clearable
          hide-details
        ></v-autocomplete>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск (№ заявки)"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredRequests"
        :items-per-page="5"
        :rows-per-page-text="'записей на странице'"
        class="elevation-1"
      >
        <template v-slot:[`item.number`]="{ item }">
          <v-chip color="green" dark>
            {{ item.number }}
          </v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <span v-if="item.created_at">
            {{ item.created_at.substring(0, 10) }}
          </span>
        </template>

        <template v-slot:[`item.applicant`]="{ item }">
          <span>
            {{ item.applicant.last_name }} {{ item.applicant.first_name.substring(0, 1) }}. {{ item.applicant.patronymic_name.substring(0, 1) }}.
          </span>
        </template>

        <template v-slot:[`item.due_date`]="{ item }">
          <span v-if="item.due_date">
            {{ item.due_date.substring(0, 10) }} {{ item.due_date.substring(14, 19) }}
          </span>
        </template>

        <template v-slot:[`item.edit`]="{ item }">
          <v-icon small class="mr-2" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>


    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="newOrder==true">Создание заявки</span>
          <span v-else>Редактирование заявки</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="requestForm">
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="formData.premise_id"
                  :items="premises.results"
                  item-text="short_address"
                  item-value="id"
                  label="Дом"
                  @change="fetchApartments"
                  required
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="formData.apartment_id"
                  :items="apartments.results"
                  item-text="number"
                  item-value="id"
                  label="Квартира"
                  required
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.due_date"
                  label="Срок"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3">
                <v-text-field v-model="formData.applicant.first_name" label="Имя" required></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model="formData.applicant.last_name" label="Фамилия" required></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model="formData.applicant.patronymic_name" label="Отчество"></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model="formData.applicant.username" label="Телефон" required></v-text-field>
              </v-col>
            </v-row>

            <v-textarea v-model="formData.description" label="Описание" required></v-textarea>
          </v-form>

          <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="submitForm">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      search: '',
      selectedPremise: null,
      editDialog: false,
      newOrder: false,
      chosenItem: {},
      errorMessage: '',
      formData: {
        premise_id: null,
        apartment_id: null,
        applicant: {
          first_name: '',
          last_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: '',
      },
      headers: [
        { text: '№', align: 'start', value: 'number' },
        { text: 'Создана', value: 'created_at' },
        { text: 'Адрес', sortable: false, value: 'premise.address' },
        { text: 'Заявитель', sortable: false, value: 'applicant' },
        { text: 'Описание', sortable: false, value: 'description' },
        { text: 'Срок', value: 'due_date' },
        { text: 'Статус', filterable: false, value: 'status.name' },
        { text: 'Изменить', align: 'center', filterable: false, sortable: false, value: 'edit' },
        { text: '', filterable: false, sortable: false, value: 'top' },
      ],
    };
  },

  computed: {
  ...mapState(['requests', 'premises', 'apartments']),
  filteredRequests() {
    return this.requests.filter(request => {
      const address = request.premise?.address || '';
      const matchesSearch = address.toLowerCase().includes(this.search.toLowerCase()) || request.number.toString().includes(this.search);

      const matchesPremise = this.selectedPremise ? request.premise?.id === this.selectedPremise : true;

      return matchesSearch && matchesPremise;
    });
  },
},

  mounted() {
    this.fetchPremises();
  },

  methods: {
    ...mapActions(['fetchRequests', 'fetchPremises', 'fetchApartments', 'createRequest', 'updateRequest']),

    async fetchApartments(premiseId) {
      if (premiseId) {
        await this.$store.dispatch('fetchApartments', premiseId);
      }
    },

    openEditDialog(item) {
      this.chosenItem = item || {};
      this.newOrder = false;
      this.editDialog = true;

      if (item) {
        this.formData = {
          premise_id: item.premise.id,
          apartment_id: item.apartment.id,
          applicant: { ...item.applicant },
          description: item.description,
          due_date: item.due_date ? item.due_date.substring(0, 10) : '',
        };
        this.fetchApartments(item.premise.id);
      }
    },

    openCreateOrderDialog() {
      const today = new Date().toISOString().substring(0, 10);
      this.formData = {
        premise_id: null,
        apartment_id: null,
        applicant: {
          first_name: '',
          last_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: today,
      };
      this.newOrder = true
      this.editDialog = true;
    },

    async submitForm() {
      try {
        const appealId = this.chosenItem.id;

        if (this.formData.due_date && !isNaN(new Date(this.formData.due_date))) {
          this.formData.due_date = new Date(this.formData.due_date).toISOString();
        } else {
          this.formData.due_date = null;
        }

        if (appealId) {
          await this.$store.dispatch('updateRequest', { id: appealId, formData: this.formData });
        } else {
          const createFormData = {
            ...this.formData,
            status_id: 1,
          };
          await this.$store.dispatch('createRequest', createFormData);
        }

        this.editDialog = false;
        this.fetchRequests();
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Ошибка при сохранении данных.';
      }
    }
  },

  created() {
    if (!this.$store.state.authToken) {
      this.$router.push('/login');
    } else {
      this.fetchRequests();
    }
  },
};
</script>
