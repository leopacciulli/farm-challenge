import axios from "axios";

const brasilApi = axios.create({
  baseURL: 'https://brasilapi.com.br/api/ibge/municipios/v1',
});

export default brasilApi