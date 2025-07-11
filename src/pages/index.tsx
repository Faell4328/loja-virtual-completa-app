import React, { useState } from 'react';
import { useStore } from '../service/useStore';
import { UserProps } from '../interface/user';
import MenuHome from '../components/MenuHome';

export default function Home() {

  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);

  const [ userState, setUserState ] = useState<UserProps | "OFF" | null >(userStore);

  return(
      <MenuHome user={ userState } />
    )
};