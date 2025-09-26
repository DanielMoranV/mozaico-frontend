<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Punto de Venta (POS)</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Mesas</v-card-title>
          <v-card-text>
            <v-row v-if="mesaStore.loading">
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p class="mt-2">Cargando mesas...</p>
              </v-col>
            </v-row>
            <v-row v-else-if="mesaStore.mesas.length > 0">
              <v-col
                v-for="mesa in mesaStore.mesas"
                :key="mesa.idMesa"
                cols="12" sm="6" md="4" lg="3"
              >
                <MesaCard :mesa="mesa" @select-mesa="handleSelectMesa" />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" class="text-center">
                <p>No hay mesas disponibles.</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- OrderPanel se renderizará aquí -->
    <OrderPanel
      :mesa-id="selectedMesaId"
      :visible="!!selectedMesaId"
      @close-panel="selectedMesaId = null"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMesaStore } from '@/stores/mesaStore';
import MesaCard from '@/components/pos/MesaCard.vue';
import OrderPanel from '@/components/pos/OrderPanel.vue'; // Se creará en el siguiente paso

const mesaStore = useMesaStore();
const selectedMesaId = ref<number | null>(null);

onMounted(() => {
  mesaStore.fetchMesas();
});

const handleSelectMesa = (mesaId: number) => {
  selectedMesaId.value = mesaId;
};
</script>

<style scoped>
/* Estilos específicos para PosView */
</style>
