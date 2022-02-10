import React, { useEffect, useRef, useState } from 'react'
import { HeaderContainer, ProfileContainer, HeaderModal } from './styles'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import API from 'service/api'
import { currentUserInfo } from 'store/userInfo'
import { Container } from 'common.styles'
import logo from '../assets/img/hlogo.svg'
import profile from '../assets/img/profile.svg'
import Routes from './Routes'

export default function SubHeader() {
  const location = useLocation()
  const history = useHistory()
  const profile_modal_ref = useRef<HTMLDivElement>(null)

  const [userInfo, setUserInfo] = useRecoilState(currentUserInfo)
  const [vis_modal, setVisModal] = useState(false)

  const clickProfileIcon = () => {
    if (vis_modal) {
      setVisModal(false)
    } else {
      setVisModal(true)
    }
  }

  const logoutHandler = async () => {
    localStorage.removeItem('jwttoken')
    localStorage.removeItem('userInfo')
    setVisModal(false)
    setUserInfo({
      ...userInfo,
      provider: '',
      providerId: '',
      _id: '',
      info: {
        name: '',
        age: '',
        gender: '',
        nickname: '',
        bloodtype: '',
        allergy: [],
        medicines: [],
      },
    })
    history.replace('/')
  }

  const getUserInfo = async () => {
    await API.auth
      .getUserInfo()
      .then((res) => {
        if (res.data === '') {
          return setUserInfo({
            ...userInfo,
            provider: '',
            providerId: '',
            _id: '',
            info: {
              name: '',
              age: '',
              gender: '',
              nickname: '',
              bloodtype: '',
              allergy: [],
              medicines: [],
            },
          })
        }
        setUserInfo({ ...userInfo, ...res.data })
      })
      .catch((e) => {
        console.log(e)
      })
  }
  /* 어딜 클릭했는지 확인 */
  const onClickInsideDetector = (e: any) => {
    if (
      profile_modal_ref.current &&
      profile_modal_ref.current!.contains(e.target)
    ) {
      /** CLICK INSIDE -> DO NOTHING */
    } else {
      if (e.target.alt === 'profile') return
      /* CLICK OUTSIDE -> SELECT CLOSE */
      setVisModal(false)
    }
  }
  /* 클릭시 닫힘 처리  */
  useEffect(() => {
    window.addEventListener('mousedown', onClickInsideDetector)

    return () => {
      window.removeEventListener('mousedown', onClickInsideDetector)
    }
  }, [])
  useEffect(() => {
    if (
      localStorage.getItem('jwttoken') &&
      !userInfo.info.name &&
      userInfo.info.name !== '' &&
      location.pathname !== '/infoForm'
    ) {
      alert('회원정보 작성 후 이용 바랍니다.')
      history.push('/infoForm')
    } else {
      getUserInfo()
    }
  }, [location.pathname])

  return (
    <>
      <HeaderContainer className="sub">
        <Container className="flexWrap">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <ProfileContainer onClick={() => clickProfileIcon()}>
            {userInfo._id !== '' ? (
              <button
                className="headerTxt"
                onClick={() => history.push('/mypage')}
              >
                <img src={profile} alt="profile" />
              </button>
            ) : (
              <Link className="headerTxt" to="/login">
                <img src={profile} alt="profile" />
              </Link>
            )}
            <HeaderModal
              ref={profile_modal_ref}
              className={`${vis_modal ? 'vis' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <section className="profileWrap">
                <div>
                  <img src={profile} alt="" />
                </div>
                <div>
                  <div className="nickname">{userInfo.info.nickname}</div>
                  <div className="buttonWrap">
                    <button onClick={() => history.push('/infoForm')}>
                      회원정보 수정하기
                    </button>
                  </div>
                </div>
              </section>
              <div className="modalLink">
                <button onClick={() => history.push('/mypage')}>
                  마이페이지
                </button>
              </div>
              <div className="modalLink">
                <button onClick={logoutHandler}>로그아웃</button>
              </div>
            </HeaderModal>
          </ProfileContainer>
        </Container>
      </HeaderContainer>
      <Routes />
    </>
  )
}
