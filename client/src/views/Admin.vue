<script setup lang="ts">
import { ref, onMounted } from "vue"
import { type IUser } from '@/stores'
import { RouterLink, RouterView } from 'vue-router';

interface NavigationItem {
  title: string
  prependIcon: string
  to: string,
  value: number
}

const emit = defineEmits(['login', 'reload'])
const user = defineModel<IUser>()

const drawer = ref<boolean>()
const selectedItem = ref<number[]>([0])
const navigationItems = ref<NavigationItem[]>([
  {
    title: "Eventi",
    prependIcon: "mdi-calendar",
    to: "",
    value: 0
  },
  {
    title: "Tavoli",
    prependIcon: "mdi-table-furniture",
    to: "tables",
    value: 2
  },
  {
    title: "Menu",
    prependIcon: "mdi-menu",
    to: "items",
    value: 3
  },
  {
    title: "Utenti",
    prependIcon: "mdi-account-group",
    to: "users",
    value: 1
  },
])

onMounted(() => {
  try {
    selectedItem.value = [navigationItems.value.find(n => n.to === /\/admin\/?(\w*)/.exec(window.location.pathname)[1]).value]
  } catch (error) {
    
  }
})

</script>

<template>
  <v-navigation-drawer v-model="drawer" mobile-breakpoint="sm" width="150">
    <v-list nav v-model:selected="selectedItem">
      <RouterLink :to="`/admin/${item.to}`" v-for="item in navigationItems">
        <v-list-item :prepend-icon="item.prependIcon" :title="item.title" :value="item.value" rounded="0"></v-list-item>
      </RouterLink>
    </v-list>
  </v-navigation-drawer>
  <RouterView></RouterView>
  <v-fab v-show="!drawer" class="hide-xs" icon="mdi-menu" app style="position: fixed; left: 10px; bottom: 10px;" location="bottom left" @click="drawer = !drawer"></v-fab>
</template>

<style scoped>
  .v-list {
    padding: 0 !important
  }
</style>