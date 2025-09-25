<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Pedido' : 'Nuevo Pedido' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idCliente"
                :items="clienteStore.clientes"
                item-title="nombreCompleto"
                item-value="idCliente"
                label="Cliente"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idMesa"
                :items="mesaStore.mesas"
                item-title="numeroMesa"
                item-value="idMesa"
                label="Mesa"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idEmpleado"
                :items="usuarioStore.usuarios"
                item-title="nombre"
                item-value="idUsuario"
                label="Empleado"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.tipoServicio"
                :items="tiposServicioItems"
                label="Tipo de Servicio *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.estado"
                :items="estadosPedidoItems"
                label="Estado *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.observaciones"
                label="Observaciones"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" v-if="form.tipoServicio === 'DELIVERY'">
              <v-text-field
                v-model="form.direccionDelivery"
                label="Dirección de Delivery *"
                variant="outlined"
                :rules="form.tipoServicio === 'DELIVERY' ? [reglasValidacion.requerido] : []"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-pedido')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import { EstadoPedido, TipoServicio } from '@/types/enums';
import type { PedidoRequestDTO } from '@/types/pedido';
import { useClienteStore } from '@/stores/clienteStore';
import { useMesaStore } from '@/stores/mesaStore';
import { useUsuarioStore } from '@/stores/usuarioStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: PedidoRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-pedido']);

const clienteStore = useClienteStore();
const mesaStore = useMesaStore();
const usuarioStore = useUsuarioStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const estadosPedidoItems = computed(() =>
  Object.values(EstadoPedido).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

const tiposServicioItems = computed(() =>
  Object.values(TipoServicio).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);

onMounted(() => {
  clienteStore.fetchClientes();
  mesaStore.fetchMesas();
  usuarioStore.fetchUsuarios(); // Assuming employees are users
});
</script>
