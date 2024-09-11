import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useRouter } from 'next/router';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';

const Profile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!(me && me.id)) {
      router.push('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | Nodebird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me?.Followings} />
        <FollowList header="팔로워" data={me?.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
