// import axios, { AxiosResponse } from 'axios';
// import { ResourceDTO } from './types';
// import backendConn  from './backendConn';

// export const fetchResources = async () => {
//   try {
//     const response: AxiosResponse<ResourceDTO[]> = await backendConn.get('/resource/');
//     return response.data;
//   } catch (error :any) {
//     console.error(error.response?.statusText || error.message);
//     throw error;
//   }
// };

// export const submitResource = async (data: FormData) => {
//   try {
//     const response: AxiosResponse = await backendConn.post('/resource/', data);
//     return response;
//   } catch (error :any) {
//     console.error(error.response?.statusText || error.message);
//     throw error;
//   }
// };
