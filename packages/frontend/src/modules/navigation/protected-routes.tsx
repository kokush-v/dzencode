import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { selectUser } from '../common/components/user/user.selector';
import { ROUTER_KEYS } from '../common/consts/app-keys.const';

export const ProtectedRoutes = () => {
  const user = selectUser();

  const navigate = useNavigate();

  if (!user) {
    navigate(ROUTER_KEYS.AUTH.LOGIN);
  }

  return <Outlet />;
};
