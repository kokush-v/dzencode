import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import jimp from 'jimp';

export const photoUpload = async (file: Express.Multer.File | undefined): Promise<string> => {
  if (!file) throw Error('Error');

  const storageRef = ref(getStorage(), `posts/photos/${new Date().getTime()}?${file.originalname}`);

  const metadata = {
    contentType: file.mimetype
  };

  const image = await jimp.read(file.buffer);
  const resizedImage = await image.resize(320, 240).getBufferAsync(file.mimetype);

  const snapshot = await uploadBytesResumable(storageRef, resizedImage, metadata);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
