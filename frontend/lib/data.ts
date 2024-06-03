import { ResourceDB, ResourceDTO, ResourceForm, UserDTO } from './types';

export const listResources = async () => {
  try {
    const response = await fetch('/api/resources');
    const data = (await response.json()) as ResourceDTO[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listResourcesByUser = async (userEmail: string) => {
  try {
    const response = await fetch('/api/resources?userEmail=' + userEmail);
    const data = (await response.json()) as ResourceDTO[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getUser = async (userEmail: string) => {
  try {
    const response = await fetch('/api/users/' + userEmail);
    const data = (await response.json()) as UserDTO;
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUserFavorites = async (userEmail: string) => {
  try {
    const response = await fetch('/api/users/' + userEmail + '/favorites');
    const data = (await response.json()) as string[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getResourceFavorites = async (userEmail: string) => {
  try {
    const response = await fetch('/api/resources/' + userEmail + '/favorites');
    const data = (await response.json()) as string[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addFavorite = async (userEmail: string, resourceId: string) => {
  try {
    console.log('ADDING FAV');
    await fetch('/api/users/' + userEmail + '/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: resourceId, add: true }),
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const rmFavorite = async (userEmail: string, resourceId: string) => {
  try{
    console.log("ADDING FAV")
    await fetch('/api/users/' + userEmail + '/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite:resourceId, add: false }),
    }); 
  }  catch (error) {
    throw new Error((error as Error).message);
  }
};

export const submitResource = async (formData: ResourceForm) => {
  try {
    const resource: Partial<ResourceDB> = {
      title: formData.title,
      description: formData.description,
      documentType: formData.documentType,
      documentFormat: formData.documentFormat,
      hashtags: formData.hashtags,
      subjectId: formData.subjectId,
      courseId: formData.courseId,
      createdAt: formData.createdAt,
      file: formData.file[0].name,
      userEmail: formData.userEmail,
    };

    const response = await fetch('/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) {
      throw new Error('Failed to submit resource');
    }

    const data = (await response.json()) as ResourceDTO;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
