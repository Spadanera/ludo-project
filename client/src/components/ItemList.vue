<script setup lang="ts">
import { getIcon } from "@/services/utils"
const props = defineProps(['subheader', 'done', 'delete'])
const items = defineModel({ default: [] })
</script>

<template>
    <v-list>
        <v-list-subheader v-if="subheader">{{ subheader }}</v-list-subheader>
        <v-list-item :lines="item.note ? 'three' : 'one'" v-for="item in items" density="compact">
            <v-list-item-title><span :class="{ done: done }">{{ item.name }}</span></v-list-item-title>
            <v-list-item-subtitle>
                <span :class="{ done: done }">{{ item.type }} - {{ item.sub_type }}</span><br />
                <span :class="{ done: done }" v-if="item.note">{{ item.note }}</span>
            </v-list-item-subtitle>
            <template v-slot:prepend>
                <v-icon :icon="getIcon(item.sub_type)"></v-icon>
            </template>
            <template v-slot:append>
                <slot :item="item" name="prequantity"></slot>
                <span :class="{ done: done }">{{ item.quantity }}</span>
                <slot :item="item" name="postquantity"></slot>
            </template>
        </v-list-item>
    </v-list>
</template>