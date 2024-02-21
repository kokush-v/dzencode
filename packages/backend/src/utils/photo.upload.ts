import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import sharp from 'sharp';

export const photoUpload = async (file: Express.Multer.File | undefined): Promise<string> => {
  if (!file || file.mimetype.split('/')[0] !== 'image') throw Error('Wrong format');

  const storageRef = ref(getStorage(), `posts/${file.originalname}`);

  const metadata = {
    contentType: file.mimetype
  };

  const resizedPhoto = await sharp(file.buffer).resize(320, 240).toBuffer();

  const snapshot = await uploadBytesResumable(storageRef, resizedPhoto, metadata);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
