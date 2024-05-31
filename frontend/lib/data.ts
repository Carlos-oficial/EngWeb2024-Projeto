import { ResourceDTO, ResourceForm } from './types';

export const fetchResources = async () => {
  const response = await fetch('http://localhost:5000/resource/');
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error();
  }
  const data: ResourceDTO[] = (await response.json()) as ResourceDTO[];
  return data;
};

export const submitResource = async (data: ResourceForm) => {
  const response = await fetch('http://localhost:5000/resource/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error();
  }

  return response;
};
