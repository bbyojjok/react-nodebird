import { nanoid } from 'nanoid';
import { produce } from 'immer';
import { faker } from '@faker-js/faker';

export const initialState = {
  mainPosts: [
    // {
    //   id: 1,
    //   User: {
    //     id: 1,
    //     nickname: 'stlee',
    //   },
    //   content: '첫 번째 게시글 #해시태그 #익스프레스 #dd',
    //   Images: [
    //     {
    //       src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3243&q=80',
    //     },
    //     {
    //       src: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80',
    //     },
    //     {
    //       src: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    //     },
    //   ],
    //   Comments: [
    //     {
    //       User: {
    //         nickname: 'nero',
    //       },
    //       content: '우와~',
    //     },
    //     {
    //       User: {
    //         nickname: 'hero',
    //       },
    //       content: '이얗ㅎ~',
    //     },
    //   ],
    // },
  ],
  imagePaths: [],
  hasMorePost: true,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

export const generateDummyPost = (number) => {
  faker.seed(123);
  return Array(number)
    .fill()
    .map(() => ({
      id: nanoid(),
      User: {
        id: nanoid(),
        nickname: faker.person.firstName(),
      },
      content: faker.lorem.paragraphs(),
      Images: [
        {
          src: faker.image.url(),
        },
      ],
      Comments: [
        {
          User: {
            id: nanoid(),
            nickname: faker.person.firstName(),
          },
          content: faker.lorem.paragraph(),
        },
      ],
    }));
};

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = ({ id, content }) => ({
  id,
  content,
  User: {
    id: 1,
    nickname: 'stlee',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: nanoid(),
  content: data,
  User: {
    id: 1,
    nickname: 'stlee',
  },
});

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.hasMorePost = draft.mainPosts.length < 50;
        break;
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;

      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;

        // const { content, postId, userId } = action.data;
        // const postIndex = state.mainPosts.findIndex((v) => v.id === postId);
        // const post = state.mainPosts[postIndex];
        // const Comments = [dummyComment(content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = { ...post, Comments };

        // return {
        //   ...state,
        //   mainPosts,
        //   addCommentLoading: false,
        //   addCommentDone: true,
        // };
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
