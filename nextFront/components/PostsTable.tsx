import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// import { Link } from "react-router-dom";
import Link from 'next/link'
import { Container } from 'common.styles'
import profileDefault from 'assets/img/profile.svg'
import { useRecoilState } from 'recoil'
import { currentUserInfo } from 'store/userInfo'

const PostsTable = (props: any) => {
  const [filter, setFilter] = useState({ text: '최신순', key: 'latest' })
  const [userInfo] = useRecoilState(currentUserInfo)
  useEffect(() => {
    if (props.getPosts) {
      props.getPosts(filter.key)
    }
  }, [filter])
  return (
    <>
      <PostTableHeader>
        <div className="headerTitle">전체</div>
        <div className="filterTab">
          <div
            className={`tab ${filter.text === '최신순' ? 'active' : ''}`}
            onClick={() => setFilter({ text: '최신순', key: 'latest' })}
          >
            최신순
          </div>
          <div
            className={`tab ${filter.text === '오래된순' ? 'active' : ''}`}
            onClick={() => setFilter({ text: '오래된순', key: 'oldest' })}
          >
            오래된순
          </div>
          <div
            className={`tab ${filter.text === '인기순' ? 'active' : ''}`}
            onClick={() => setFilter({ text: '인기순', key: 'hotest' })}
          >
            인기순
          </div>
        </div>
      </PostTableHeader>
      {props.posts.map((item: any, index: number) => {
        return (
          <PostTableBody key={index}>
            <div className="top">
              <div className="left">
                <a className="latestPost">
                  <Link
                    href={
                      item.user._id === userInfo._id
                        ? { pathname: '/mypage' }
                        : { pathname: `/profilepage/${item.user._id}` }
                    }
                    passHref
                  >
                    <div className="profileImg">
                      <img src={profileDefault.src} alt="프로필 기본 이미지" />
                    </div>
                  </Link>
                </a>
                <div className="profileDescript">
                  <div className="name">{item.user.info.nickname}</div>
                  <div className="date">{item.publishedDate.split('T')[0]}</div>
                </div>
              </div>
              <div className="right">
                <div className="count">
                  좋아요 <span>{item.likes}</span>
                </div>
                <div className="count">
                  조회수 <span>{item.views}</span>
                </div>
                <div className="count">
                  댓글{' '}
                  <span>
                    {item.commentIds
                      ? item.commentIds.length
                      : item.comments
                      ? item.comments.length
                      : 0}
                  </span>
                </div>
              </div>
            </div>
            <a className="latestPost">
              {/* <Link href={`/posts/detail/${item._id}`} passHref> */}
              <Link
                href={{
                  pathname: '/posts/detail/[postId]',
                  query: { postId: item._id },
                }}
              >
                <div className="bottom">
                  <div className="left">
                    <div className="postTitle">{item.title}</div>
                    <div
                      className="postContent"
                      dangerouslySetInnerHTML={{ __html: item.body }}
                    />
                    <div>
                      <span className="category">{item.category}</span>
                      {item.tags.map((el: any, idx: any) => {
                        return (
                          <span className="hashtag" key={idx}>
                            #{el}{' '}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </a>
          </PostTableBody>
        )
      })}
    </>
  )
}

export default PostsTable

export const PostTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #333333;
  border-bottom: 1px solid #333333;

  .headerTitle {
    font-size: 20px;
    font-weight: 700;
  }

  .filterTab {
    display: flex;
    align-items: center;

    .tab {
      margin-left: 40px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;

      @media (max-width: 550px) {
        margin-left: 15px;
        font-size: 16px;
      }
      @media (max-width: 305px) {
        margin-left: 5px;
        font-size: 14px;
      }

      &.active {
        font-weight: 700;
        color: #1850a3;
      }
    }
  }
`
export const PostTableBody = styled.div`
  padding: 30px 15px;
  border-bottom: 1px solid #cccccc;

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 25px;

    @media (max-width: 550px) {
      flex-direction: column;
    }

    .left {
      display: flex;
      align-items: center;

      .profileImg {
        margin-right: 15px;

        img {
          width: 70px;

          @media (max-width: 414px) {
            width: 50px;
          }
        }
      }

      .profileDescript {
        .name {
          font-size: 20px;
          font-weight: 500;
          color: #000;

          @media (max-width: 414px) {
            font-size: 18px;
          }
        }

        .date {
          font-size: 16px;
          color: #989898;

          @media (max-width: 414px) {
            font-size: 14px;
          }
        }
      }
    }

    .right {
      display: flex;
      align-items: center;

      @media (max-width: 550px) {
        margin-top: 15px;
      }

      .count {
        margin-left: 15px;
        font-size: 15px;
        color: #989898;

        @media (max-width: 550px) {
          margin-left: 0;
          margin-right: 15px;
        }
      }
    }
  }

  .bottom {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .left {
      .postTitle {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        margin-bottom: 13px;
        font-size: 17px;
        font-weight: 500;
        color: #000;
      }

      .postContent {
        display: -webkit-box;
        word-wrap: break-word;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 57px;
        margin-bottom: 15px;
        line-height: 20px;
        color: #666;
        font-size: 14px;
      }

      .category {
        padding: 2px 15px;
        margin-right: 10px;
        background: #1850a3;
        color: #fff;
        border-radius: 50px;

        @media (max-width: 414px) {
          font-size: 12px;
        }
      }

      .hashtag {
        color: #1850a3;
        font-size: 15px;

        @media (max-width: 414px) {
          font-size: 12px;
        }
      }
    }
  }
`
