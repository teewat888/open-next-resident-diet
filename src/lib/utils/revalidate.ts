import { revalidatePath } from 'next/cache';

interface PATH_OBJ {
  [key: string]: string;
}

const PATH: PATH_OBJ = {
  HOME: '/',
  CLIENT: '/admin/client',
};

export const revalidateAllPath = () => {
  Object.keys(PATH).forEach((key) => {
    revalidatePath(PATH[key]);
  });
};

export const revalidateHome = () => revalidatePath(PATH.HOME);
export const revalidateClient = () => revalidatePath(PATH.CLIENT);
