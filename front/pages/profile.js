import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  console.log(me);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | Nodebird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me?.followingList} />
        <FollowList header="팔로워" data={me?.followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
