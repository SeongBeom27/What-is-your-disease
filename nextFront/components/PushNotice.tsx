import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import notice from 'assets/img/bell_icon.svg'
import { Socket } from 'socket.io-client'
import { socketInit } from 'store/socket'
import { useRecoilState, useRecoilValue } from 'recoil'
import API from 'service/api'
import { useRouter } from 'next/router'
interface PushNoticeModel {}
interface PushListsModel {
  _id: string
  sender: string
  receiver: string
  type: 'post' | 'comment' | 'reply' | 'follow' | 'like'
  Info: {
    senderId: string
    postId: string
    commentId: string
  }
  publishedDate: string
}

const PushNotice = (props: PushNoticeModel) => {
  const router = useRouter()
  const socket = useRecoilValue(socketInit)
  const [vis_notice_modal, setVisNoticeModal] = useState(false)
  const [push_list, setPushList] = useState<PushListsModel[]>([])
  const notice_modal_ref = useRef<HTMLDivElement>(null)
  const clickNoticeIcon = () => {
    if (vis_notice_modal) {
      setVisNoticeModal(false)
    } else {
      setVisNoticeModal(true)
    }
  }

  /* 어딜 클릭했는지 확인 */
  const onClickInsideDetector = (e: any) => {
    if (
      notice_modal_ref.current &&
      notice_modal_ref.current!.contains(e.target)
    ) {
      /** CLICK INSIDE -> DO NOTHING */
    } else {
      if (e.target.alt === 'notice') return
      /* CLICK OUTSIDE -> SELECT CLOSE */
      setVisNoticeModal(false)
    }
  }

  const getPushList = async () => {
    await API.user
      .getPushList()
      .then((res) => {
        console.log(res.data)
        setPushList((lists) => [...lists, ...res.data])
      })
      .catch((e) => {
        console.log(e)
      })
  }

  /* 클릭시 닫힘 처리  */
  useEffect(() => {
    window.addEventListener('mousedown', onClickInsideDetector)
    // props.socket.on('push', (data) => {
    //   console.log(data)
    // })
    getPushList()
    return () => {
      window.removeEventListener('mousedown', onClickInsideDetector)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(socket).length !== 0 && !socket.hasListeners('push')) {
      socket.on('push', (data) => {
        setPushList((lists) => [...lists, data])
      })
    }
  }, [socket])

  return (
    <NoticeContainer onClick={() => clickNoticeIcon()}>
      <button className="headerTxt">
        <img src={notice.src} alt="notice" />
      </button>
      <NoticeModal
        ref={notice_modal_ref}
        className={`${vis_notice_modal ? 'vis' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="noticeWrap">
          <div className="noticeHeader">
            <div>
              알림 <span>{push_list.length}</span> 건
            </div>
            <div
              style={{
                textDecoration: 'underline',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              모두 읽음
            </div>
          </div>
          <div className="noticeContents">
            {push_list.map((item) => {
              if (item.type === 'comment') {
                return (
                  <>
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push({
                          pathname: `/posts/detail/${item.Info.postId}`,
                        })
                      }}
                    >
                      {item.sender}님이 회원님의 게시글에 답글을 남겼습니다.
                      <span>{item.publishedDate.split('T')[0]}</span>
                    </div>
                  </>
                )
              } else if (item.type === 'like') {
                return (
                  <>
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push({
                          pathname: `/posts/detail/${item.Info.postId}`,
                        })
                      }}
                    >
                      {item.sender}님이 회원님의 게시글을 게시글을 좋아합니다.
                      <span>{item.publishedDate.split('T')[0]}</span>
                    </div>
                  </>
                )
              } else if (item.type === 'follow') {
                return (
                  <>
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push({
                          pathname: `/profilepage/${item.Info.senderId}`,
                        })
                      }}
                    >
                      {item.sender}님이 회원님을 팔로우 하기 시작했습니다.
                      <span>{item.publishedDate.split('T')[0]}</span>
                    </div>
                  </>
                )
              } else if (item.type === 'reply') {
                return (
                  <>
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push({
                          pathname: `/posts/detail/${item.Info.postId}`,
                        })
                      }}
                    >
                      {item.sender}님이 회원님의 댓글에 답글을 남겼습니다.
                      <span>{item.publishedDate.split('T')[0]}</span>
                    </div>
                  </>
                )
              }
            })}
          </div>
        </section>
      </NoticeModal>
      <div className="prevCount">
        {push_list.length > 100 ? '99+' : push_list.length}
      </div>
    </NoticeContainer>
  )
}

export default PushNotice

export const NoticeContainer = styled.div`
  & .prevCount {
    background: rgba(var(--c37, 237, 73, 86), 1);
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 30px;
    color: white;
    font-weight: 700;
    position: absolute;
    top: 10px;
    right: -11px;
  }
`
export const NoticeModal = styled.div`
  position: absolute;
  right: -20px;
  color: white;
  padding: 15px 15px;
  width: 280px;
  height: 600px;
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 4px;
  color: #000;
  transition: all 0.21s;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  overflow-y: scroll;

  &.vis {
    visibility: visible;
    opacity: 1;
    transform: translateY(3px);
  }
  .noticeWrap {
    display: block;

    .noticeHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #545454;

      span {
        font-weight: 900;
        color: #e96767;
      }
    }

    .noticeContents {
      margin-top: 20px;

      div {
        margin-bottom: 10px;
        cursor: pointer;
        word-break: keep-all;
        padding: 5px;

        &:hover {
          background-color: rgba(220, 220, 220, 0.4);
        }
        span {
          margin-left: 10px;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
`
