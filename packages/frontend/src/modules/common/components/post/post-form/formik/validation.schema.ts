import * as Yup from 'yup';

export const PostSchema = Yup.object().shape({
  text: Yup.string().min(4, 'Too Short!').required('Required'),
  reCaptcha: Yup.string().required('Required')
});
