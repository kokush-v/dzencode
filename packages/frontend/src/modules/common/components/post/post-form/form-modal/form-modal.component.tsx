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

interface FormModalProps extends Omit<ModalProps, 'children'> {}

export const FormModal = ({ isOpen, onClose }: FormModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>New Post</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormikForm />
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  </Modal>
);
