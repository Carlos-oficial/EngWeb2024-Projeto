import {
  ResourceDTO,
  SubjectDB,
  UserDTO,
  CourseDB,
  DocumentTypeDB,
  UserDB,
  UserSignUp,
} from './types';

export const listResources = async () => {
  try {
    const response = await fetch('/api/resources');
    const data = (await response.json()) as ResourceDTO[];

    // get favorites nr for each resource
    await Promise.all(
      data.map(async (resource) => {
        const favorites = await getResourceFavorites(resource._id);
        resource.favoritesNr = favorites.length;
      }),
    );

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listFavoriteResources = async (userEmail: string) => {
  try {
    const userFavorites = await getUserFavorites(userEmail);
    const favoriteResources = (await fetch(
      '/api/resources?' +
        new URLSearchParams({ ids: userFavorites.toString() }).toString(),
    )) as ResourceDTO[];
    return favoriteResources;
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

export const getResourceFavorites = async (resourceId: string) => {
  try {
    const response = await fetch('/api/resources/' + resourceId + '/favorites');
    const data = (await response.json()) as string[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addFavorite = async (userEmail: string, resourceId: string) => {
  try {
    await fetch('/api/users/' + userEmail + '/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resourceId: resourceId }),
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const removeFavorite = async (userEmail: string, resourceId: string) => {
  try {
    await fetch('/api/users/' + userEmail + '/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resourceId: resourceId }),
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const submitResource = async (formData: FormData) => {
  try {
    const response = await fetch('/api/resources', {
      method: 'POST',
      body: formData,
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

export const listSubjects = async () => {
  try {
    const response = await fetch('/api/subjects');
    const data = (await response.json()) as SubjectDB[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addSubject = async (subject: string, courseId: string) => {
  try {
    const response = await fetch('/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: subject, courseId: courseId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add subject');
    }

    const data = (await response.json()) as SubjectDB;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listCourses = async () => {
  try {
    const response = await fetch('/api/courses');
    const data = (await response.json()) as CourseDB[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addCourse = async (course: string) => {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: course }),
    });

    if (!response.ok) {
      throw new Error('Failed to add course');
    }

    const data = (await response.json()) as CourseDB;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listDocumentTypes = async () => {
  try {
    const response = await fetch('/api/documentTypes');
    const data = (await response.json()) as DocumentTypeDB[];
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addDocumentType = async (documentType: string) => {
  try {
    const response = await fetch('/api/documentTypes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: documentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to add document type');
    }

    const data = (await response.json()) as DocumentTypeDB;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const signUp = async (userInfo: UserSignUp) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error("Couldn't sign up");
    }

    const data = (await response.json()) as UserDB;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
