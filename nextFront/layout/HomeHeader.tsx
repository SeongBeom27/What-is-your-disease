import React, { useEffect, useState, useRef } from 'react'
import { HeaderContainer, ProfileContainer, HeaderModal } from './styles'
// import { Link, useHistory, useLocation } from "react-router-dom";
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import API from 'service/api'
import { currentUserInfo } from 'store/userInfo'
import { Container } from 'common.styles'
import logo from '../assets/img/hlogo.svg'
import profile from '../assets/img/profile.svg'
import { Header } from 'antd/lib/layout/layout'
import Image from 'next/link'

export default function HomeHeader() {
  const location = useRouter()
  const history = useRouter()

  const profile_modal_ref = useRef<HTMLDivElement>(null)

  const [userInfo, setUserInfo] = useRecoilState(currentUserInfo)
  const [border, setBorder] = useState('rgba(255,255,255,0)')
  const [background, setBackground] = useState('transparent')

  const [vis_modal, setVisModal] = useState(false)

  const scrollHandler = () => {
    if (window.scrollY < 40) {
      setBackground('transparent')
      setBorder('rgba(255,255,255,0)')
    } else {
      setBackground('#fff')
      setBorder('#ccc')
    }
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

  const clickProfileIcon = () => {
    if (vis_modal) {
      setVisModal(false)
    } else {
      setVisModal(true)
    }
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

  useEffect(() => {
    if (
      // typeof window !== undefined &&
      // window?.localStorage.getItem("jwttoken") &&
      !userInfo.info.name &&
      userInfo.info.name !== '' &&
      location.pathname !== '/infoForm'
    ) {
      alert('회원정보 작성 후 이용 바랍니다.')
      history.push('/infoForm')
    } else {
      getUserInfo()
    }

    window.addEventListener('scroll', scrollHandler)
  }, [location.pathname])

  /* 클릭시 닫힘 처리  */
  useEffect(() => {
    window.addEventListener('mousedown', onClickInsideDetector)

    return () => {
      window.removeEventListener('mousedown', onClickInsideDetector)
    }
  }, [])

  return (
    <>
      <HeaderContainer
        style={{
          background: background,
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: border,
          transition: '0.21s',
        }}
      >
        <Container className="flexWrap headerContainer">
          <Link href="/" passHref>
            <img className="logo" src={logo.src} alt="logo" />
          </Link>
          <ProfileContainer onClick={() => clickProfileIcon()}>
            {userInfo._id !== '' ? (
              <button className="headerTxt">
                <img src={profile.src} alt="profile" />
              </button>
            ) : (
              <a className="headerText">
                <Link href="/login" passHref>
                  <img src={profile.src} alt="profile" />
                </Link>
              </a>
            )}
            <HeaderModal
              ref={profile_modal_ref}
              className={`${vis_modal ? 'vis' : ''}`}
              onClick={(e: any) => e.stopPropagation()}
            >
              <section className="profileWrap">
                <div>
                  <img src={profile.src} alt="" />
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
    </>
  )
}
