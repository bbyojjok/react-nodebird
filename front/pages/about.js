import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { Avatar, Card } from 'antd';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  console.log(userInfo);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>stlee | Nodebird</title>
      </Head>
      <AppLayout>
        {userInfo ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts.length}
              </div>,
              <div key="followings">
                팔로잉
                <br />
                {userInfo.Followings.length}
              </div>,
              <div key="follow">
                팔로워
                <br />
                {userInfo.Followers.length}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
              description="노드버드 매니아"
            />
          </Card>
        ) : null}
      </AppLayout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default About;
