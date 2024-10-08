<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { type MasterItem, type Type, ItemTypes, Destinations } from "../../../../models/src"
import Axios from '@/services/client'
import { SnackbarStore } from '@/stores'
import { sortItem, copy } from '@/services/utils';
import Confirm from '@/components/Confirm.vue';
const axios = new Axios()
const snackbarStore = SnackbarStore()

const loading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const confirm = ref<boolean>(false)
const selectedItem = ref<MasterItem>(null)
const items = ref<MasterItem[]>([])
const filter = ref<string>('')

const filteredItems = computed(() => items.value.filter((i: MasterItem) => !filter.value || new RegExp(filter.value, 'i').test(i.name)).sort(sortItem))

function openDialog(item: MasterItem) {
  selectedItem.value = copy<MasterItem>(item)
  dialog.value = true
}

async function updateItem(del: boolean = false) {
  setType()
  if (del) {
    selectedItem.value.status = 'DELETED'
  }
  await axios.EditMasterItems(selectedItem.value)
  dialog.value = false
  getMasterItems()
  snackbarStore.show(del ? "Item eliminato" : "Item aggiornato")
}

async function createItem() {
  setType()
  await axios.CreateMasterItems(selectedItem.value)
  dialog.value = false
  getMasterItems()
  snackbarStore.show("Tavolo creato")
}

async function getMasterItems() {
  loading.value = true
  items.value = await axios.GetAllMasterItems()
  loading.value = false
}

function setType() {
  selectedItem.value.type = ItemTypes.find((t: Type) => t.name === selectedItem.value.sub_type).type
}

onMounted(async () => {
  await getMasterItems()
})
</script>

<template>
  <v-skeleton-loader v-if="loading" type="list-item-three-line"></v-skeleton-loader>
  <div v-else>
    <v-text-field :clearable="true" v-model="filter" label="Cerca"></v-text-field>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">
            Nome
          </th>
          <th class="text-left">
            Tipologia
          </th>
          <th class="text-left">
            Sottotipologia
          </th>
          <th class="text-left">
            Prezzo
          </th>
          <th class="text-left">
            Destinazione
          </th>
          <th class="text-left">
            Disponibile
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.id" @click="openDialog(item)">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.sub_type }}</td>
          <td>{{ item.price }} €</td>
          <td>{{ item.destination }}</td>
          <td>
            <v-icon v-if="item.available" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-title v-if="selectedItem.id">
          Modifica elemento
        </v-card-title>
        <v-card-title v-else>
          Crea nuovo elemento
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="selectedItem.name" label="Nome"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="selectedItem.price" label="Prezzo" type="number"
                  append-inner-icon="mdi-currency-eur"></v-text-field>
              </v-col>
              <v-col>
                <v-switch color="green" label="Disponibile" :false-value="0" :true-value="1" v-model:model-value="selectedItem.available"></v-switch>
              </v-col>
              <v-col cols="12">
                <v-select :items="ItemTypes" label="Tipologia" item-title="name" v-model="selectedItem.sub_type">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.type" :title="item.raw.name"></v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-select :items="Destinations" label="Destinazione" item-value="id" item-title="name" v-model="selectedItem.destination_id">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.location" :title="item.raw.name"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="plain" @click="dialog = false">ANNULLA</v-btn>
          <v-btn color="red" v-if="selectedItem.id" variant="plain" @click="confirm = true">ELIMINA</v-btn>
          <v-btn v-if="selectedItem.id" variant="plain" @click="updateItem()">AGGIORNA</v-btn>
          <v-btn v-else variant="plain" @click="createItem">CONFERMA</v-btn>
        </v-card-actions>
      </v-card>
      <Confirm v-model="confirm">
        <template v-slot:action>
          <v-btn text="Conferma" variant="plain" @click="updateItem(true)"></v-btn>
        </template>
      </Confirm>
    </v-dialog>
  </div>
  <v-fab icon="mdi-plus" app style="position: fixed; right: 10px; bottom: 10px;" location="bottom right" @click="openDialog({
    status: 'ACTIVE'
  } as MasterItem)"></v-fab>
</template>
