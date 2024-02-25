import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const fileUpload = async (file: Express.Multer.File | undefined): Promise<string> => {
  if (!file) throw Error('Error');

  const storageRef = ref(getStorage(), `posts/files/${new Date().getTime()}?${file.originalname}`);

  const metadata = {
    contentType: file.mimetype
  };

  const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
