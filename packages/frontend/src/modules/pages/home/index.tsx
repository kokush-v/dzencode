import React from 'react';
import { PostContainer } from '../../common/components/post/post-container';
import { UserHeader } from '../../common/components/user/user-header';

const HomePageContainer = () => (
  <>
    <UserHeader />
    <PostContainer />
  </>
);

export default HomePageContainer;
