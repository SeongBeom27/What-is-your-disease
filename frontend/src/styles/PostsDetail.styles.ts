import styled from 'styled-components'

export const PostsDetailContainer = styled.div`
  padding-top: 170px;

  & .postTitle {
    font-size: 26px;
    font-weight: 500;
    margin-top: 100px;
    margin-bottom: 30px;
  }

  & .postInfo {
    display: flex;
    gap: 60px;

    & div {
      font-size: 22px;
      margin-bottom: 10px;

      &.hashtag {
        span {
          cursor: pointer;
          &:hover {
            color: #666;
          }
        }
      }
    }
  }

  & .createdAt {
    margin-top: 10px;
    text-align: right;
  }

  & .commentsCnt {
    font-size: 22px;
    margin-bottom: 20px;
  }

  & .postContents {
    margin-bottom: 50px;
    padding: 30px 0;
    font-size: 20px;
    * img {
      max-width: 100%;
    }
  }

  .commentsBtn {
    width: 120px;
    height: 30px;
    font-size: 16px;
    background: #999;
    color: white;
  }
`

export const CreateComment = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 10px;
  textarea {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    padding: 10px;
    outline: none;
    resize: none;
  }

  button {
    height: 80px;
  }
`

export const CommentsSection = styled.div`
  padding: 0 20px;
  margin: 15px 0 50px;
  border: 1px solid #c4c4c4;
  border-radius: 8px;

  .comment {
    padding: 30px 0;
    border-bottom: 1px solid #f4f4f4;

    &:last-of-type {
      border: none;
    }

    span {
      margin-right: 20px;
    }

    .removeComment,
    .removeReply {
      color: red;
    }

    .replyBtn {
      width: fit-content;
      height: fit-content;
      background: transparent;

      img {
        position: relative;
        top: 3px;
        margin-left: 20px;
      }
    }

    .replyWrap {
      margin-top: 20px;
      padding: 5px 20px 20px;
      background: #f4f4f4;
      border-radius: 6px;

      .reply {
        margin-top: 20px;
      }
    }
  }
`
export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  & .delBtn {
    background-color: gray;
  }
`
