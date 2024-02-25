import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../consts/app-keys.const';

export const selectUser = () => {
  const { data: user } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    select: (state) => state
  });

  return user;
};
