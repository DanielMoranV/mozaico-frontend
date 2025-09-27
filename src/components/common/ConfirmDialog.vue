<template>
  <v-dialog
    v-model="isOpen"
    max-width="400"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="cancel"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirm"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  message: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
});

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

const confirm = () => {
  emit('confirm');
  isOpen.value = false;
};

const cancel = () => {
  emit('cancel');
  isOpen.value = false;
};
</script>