import User from "../../models/user";
import Post from "../../models/post";
import jwt from "../../lib/jwt";

export const update = async (ctx) => {
  const info = ctx.request.body;
  let user,
    NextUser,
    PrevUser = ctx.state.user;

  // TODO : 1개의 식으로 나타내기
  NextUser = { ...PrevUser };
  NextUser.info = info;
  console.log(NextUser);

  try {
    // 유저 정보가 바꼇다면 게시글 중에 해당 유저가 쓴 게시글의 정보도
    // 바뀐 유저의 정보로 업데이트
    await Post.updateMany(
      {
        "user._id": {
          $eq: PrevUser._id,
        },
      },
      {
        $set: {
          user: NextUser,
        },
      },
      {
        multi: true,
      }
    );
  } catch (e) {
    console.log(e);
  }
  const _id = NextUser._id;
  try {
    user = await User.findByIdAndUpdate(_id, NextUser, {
      new: true,
    }).exec();

    if (!user) {
      console.log("User Update fail");
      ctx.status = 404;
      return;
    }
  } catch (err) {
    ctx.throw(500, err);
  }

  // 이전 User 닉네임과 이후 User 닉네임이 다를 경우
  if (PrevUser.info.name !== NextUser.info.name) {
    const _ = await Post.findByNameAndUpdate(
      PrevUser.info.name,
      NextUser.info.name
    );
  }

  ctx.body = user;
};

/**
 * GET /api/userinfo/accounts
 * 유저 정보 전달
 */
export const accounts = async (ctx) => {
  let currentUser = await ctx.request.headers.authorization
    .replace("Bearer", "")
    .trim();
  await jwt.verify(currentUser).then((res) => {
    currentUser = res._id;
  });
  try {
    const user = await User.findById(currentUser);
    ctx.status = 200;
    ctx.body = user;
  } catch (e) {
    console.log(e);
  }
};
