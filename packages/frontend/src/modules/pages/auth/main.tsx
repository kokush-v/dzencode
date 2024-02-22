import React from 'react';
import { FormikAuthForm, FormikAuthFormProps } from '../../common/components/auth/form';

export interface AuthPageContainerProps {
  formikAuthFormProps: FormikAuthFormProps;
}

const AuthPageContainer = ({ formikAuthFormProps }: AuthPageContainerProps) => (
  <FormikAuthForm {...formikAuthFormProps} />
);

export default AuthPageContainer;
