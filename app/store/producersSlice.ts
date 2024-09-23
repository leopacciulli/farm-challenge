import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Producer } from '../types/producer';

interface ProducersState {
  producers: Producer[];
}

const initialState: ProducersState = {
  producers: [
    {
      cpfCnpj: '548.059.654-5',
      name: 'Leonardo Pacciulli',
      farmName: 'Fazenda Santana',
      city: 'Campinas',
      state: 'São Paulo - SP',
      totalArea: 500,
      agriculturalArea: 100,
      vegetationArea: 200,
      crops: ['Soy', 'Coffee']
    },
    {
      cpfCnpj: '32.980.450/0001-85',
      name: 'João Soares de Oliveira',
      farmName: 'LTDA Farm Zenda PJ',
      city: 'Baixada',
      state: 'Rio de Janeiro - RJ',
      totalArea: 450,
      agriculturalArea: 225,
      vegetationArea: 100,
      crops: ['Soy', 'Coffee', 'Cotton']
    },
    {
      cpfCnpj: '123.321.552-12',
      name: 'Maria da Silva',
      farmName: 'Farm Legal Mem',
      city: 'Campinas',
      state: 'São Paulo - SP',
      totalArea: 1500,
      agriculturalArea: 750,
      vegetationArea: 250,
      crops: ['Coffee', 'Cotton']
    },
  ],
};

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.producers.push(action.payload);
    },
    updateProducer: (state, action: PayloadAction<Producer>) => {
      const index = state.producers.findIndex(producer => producer.cpfCnpj === action.payload.cpfCnpj);
      if (index !== -1) {
        state.producers[index] = action.payload;
      }
    },
    deleteProducer: (state, action: PayloadAction<string>) => {
      state.producers = state.producers.filter(producer => producer.cpfCnpj !== action.payload);
    },
  },
});

export const { addProducer, updateProducer, deleteProducer } = producersSlice.actions;

export default producersSlice.reducer;
