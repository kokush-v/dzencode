import React, { ChangeEventHandler, useState } from 'react';
import { HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { BsFileEarmarkArrowUp } from 'react-icons/bs';
import { GoFile } from 'react-icons/go';

interface FileUploadProps {
  setFile: (file: File) => void;
}

const FileUpload = ({ setFile }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      setFile(acceptedFiles[0]);
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '1px solid gray',
        borderRadius: '5px',
        padding: '.5em 1em',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      <p>
        <Icon as={BsFileEarmarkArrowUp} /> Drag and drop files here or click to browse.
      </p>
      <ul>
        {uploadedFiles.map((file) => {
          return file.type === 'text/plain' ? (
            <HStack justifyContent={'center'} key={file.name}>
              <Icon as={GoFile} />
              <Text>{file.name}</Text>
            </HStack>
          ) : (
            <VStack margin={'.4em'} justifyContent={'center'} key={file.name}>
              <img src={URL.createObjectURL(file)} />
              <Text>{file.name}</Text>
            </VStack>
          );
        })}
      </ul>
    </div>
  );
};
export default FileUpload;
