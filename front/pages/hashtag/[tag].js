import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import { END } from 'redux-saga';
import axios from 'axios';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePost, loadPostsLoading } = useSelector((state) => state.post);
  const pageTitle = `#${tag}의 게시글`;

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1]?.id;
          dispatch({ type: LOAD_HASHTAG_POSTS_REQUEST, lastId, data: tag });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts, tag]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`#${tag}의 게시글`} />
        <meta property="og:title" content={`#${tag}의 게시글`} />
        <meta property="og:description" content={`#${tag}의 게시글`} />
        <meta property="og:image" content={'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/hashtag/${tag}`} />
      </Head>
      <AppLayout>
        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: params.tag,
  });

  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default hashtag;
