import axios from 'axios';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

export async function getFetch() {
  const response = await axios.get(`${BASE_URL}/events`);
  return response.data;
}
