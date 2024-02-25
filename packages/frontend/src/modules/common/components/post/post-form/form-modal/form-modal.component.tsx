import React from 'react';
import {
  ModalProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';

import { FormikForm } from '../formik';
import { IPost } from '../../../../types/todo/post.types';

interface FormModalProps extends Omit<ModalProps, 'children'> {
  initialData?: IPost;
  formType: 'NEW' | 'REPLY';
}

export const FormModal = ({ isOpen, onClose, initialData, formType }: FormModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{initialData ? `Reply to ${initialData.userName}` : 'New POST'}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormikForm initialData={initialData} formType={formType} />
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  </Modal>
);
