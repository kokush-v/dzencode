import React from 'react';
import { Tabs, TabList, Tab, TabsProps } from '@chakra-ui/react';

import { PostFilterEnum } from '../post.enums';

interface PostFilterProps extends Omit<TabsProps, 'children'> {}

/* eslint-disable */

export const PostFilter = ({ ...props }: PostFilterProps) => (
  <Tabs {...props}>
    <TabList justifyContent={props.justifyContent} height="100%">
      {Object.values(PostFilterEnum)?.map((value, index) => <Tab key={index}>{value}</Tab>)}
    </TabList>
  </Tabs>
);
