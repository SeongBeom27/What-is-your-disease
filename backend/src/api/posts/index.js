const Router = require('koa-router');
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

// 최신 게시물
posts.get('/latest', postsCtrl.latest);

// 인기 게시물
posts.get('/hot', postsCtrl.hot);

// 필터 게시물 (필터링 테이블 작성 필요)
posts.get('/', postsCtrl.category);

// 특정 유저 게시물 -> 자신일 경우 자신의 _id값 전달
posts.get('/user/:id', postsCtrl.user);

// 필터 게시물 (필터링 테이블 작성 필요)
posts.get('/filter/:id', postsCtrl.filter);

export default posts;
