import type { NextPage } from 'next'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import {
  Category,
  HomeContainer,
  HotTopic,
  MainBanner,
  Post,
} from 'styles/styles'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import API from 'service/api'
import PostsTable from 'components/PostsTable'
import Pagination from 'components/Pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Container, NoData, Title } from 'common.styles'
import SwiperCore, { Navigation } from 'swiper'
import first from 'assets/img/first.svg'
import second from 'assets/img/second.svg'
import third from 'assets/img/third.svg'
import { useRecoilState } from 'recoil'
import { currentUserInfo } from 'store/userInfo'
import Search from 'components/Search'
import HotKeywords from 'components/HotKeywords'
import { Spin } from 'antd'

const categoryList = [
  { title: '내과', img: '/stomach.svg' },
  { title: '외과', img: '/shoulder.svg' },
  { title: '이비인후과', img: '/nose.svg' },
  { title: '흉부외과', img: '/chest.svg' },
  { title: '비뇨기과', img: '/man.svg' },
  { title: '치과', img: '/tooth.svg' },
  { title: '피부과', img: '/skin.svg' },
  { title: '안과', img: '/eye.svg' },
  { title: '산부인과', img: '/baby.svg' },
  { title: '정형외과', img: '/bone.svg' },
  { title: '성형외과', img: '/plastic_surgery.svg' },
  { title: '정신의학과', img: '/brain.svg' },
  { title: '암센터', img: '/cancer.svg' },
  { title: '재활의학과', img: '/exercise.svg' },
  { title: '응급', img: '/hospital.svg' },
]

const Home: NextPage = (props) => {
  const router = useRouter()
  const [latest_posts, setLatestPosts] = useState([])
  const [hot_posts, setHotPosts] = useState([])
  const [current_page, setCurrentPage] = useState(1)
  const [total_cnt, setTotalCnt] = useState(0)
  const [userInfo, setUserInfo] = useRecoilState(currentUserInfo)
  const [loading_status, setLoadingStatus] = useState({
    hot: 'loading',
    total: 'loading',
  })

  SwiperCore.use([Navigation])

  const getLatestPosts = async (order_by: string, diseasePeriod?: string) => {
    await API.posts
      .getFilterPosts(order_by, current_page, 10, diseasePeriod)
      .then((res) => {
        setTotalCnt(res.data.postTotalCnt)
        setLatestPosts(res.data.data.post)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getHotPosts = async (diseasePeriod?: string) => {
    await API.posts
      .getFilterPosts('hotest', 1, 10, diseasePeriod)
      .then((res) => {
        setHotPosts(res.data.data.post)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getHotKeywords = async () => {
    await API.keywords
      .getKeywords()
      .then((res) => {
        console.log(res.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    getHotPosts()
    getHotKeywords()
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (latest_posts.length !== 0) {
      document.querySelector('#home_posts')?.scrollIntoView({
        behavior: 'auto',
      })
    }
    getLatestPosts('latest')
  }, [current_page])

  return (
    <HomeContainer>
      <Head>
        <title>Dr.u | HOME</title>
      </Head>
      <HotKeywords />
      <MainBanner>
        <Container>
          <h2>너의 건강상태도 알려줘~!</h2>
          {userInfo._id !== '' ? (
            <Link href="/posts/edit">글쓰러 가기</Link>
          ) : (
            <Link href="/login">글쓰러 가기</Link>
          )}
        </Container>
      </MainBanner>
      <Container style={{ marginTop: '90px' }}>
        <Title style={{ marginBottom: 0 }}>원하는 증상을 검색하세요.</Title>
        <Search />
      </Container>
      <Category>
        <Container>
          <Title>카테고리</Title>
          <div className="category">
            {categoryList.map((item, idx) => {
              return (
                <div
                  className="categoryItem"
                  key={idx}
                  onClick={() =>
                    router.push({
                      pathname: `/posts/category/lists/${item.title}`,
                    })
                  }
                >
                  <img src={item.img} alt="아이콘" />
                  <h2>{item.title}</h2>
                </div>
              )
            })}
          </div>
        </Container>
      </Category>
      <HotTopic>
        <Container>
          <Title style={{ marginBottom: 0 }}>Hot 토픽🔥</Title>
          {hot_posts.length === 0 ? (
            <NoData>조회된 결과가 없습니다.</NoData>
          ) : (
            <Swiper
              navigation
              spaceBetween={30}
              breakpoints={{
                1200: {
                  slidesPerView: 3.4,
                },
                // when window width is >= 768px
                850: {
                  slidesPerView: 2.5,
                },
                640: {
                  slidesPerView: 1.5,
                },
              }}
            >
              {hot_posts.slice(0, 10).map((item: any, index) => (
                <SwiperSlide key={item._id}>
                  <Link href={`/posts/detail/${item._id}`} passHref>
                    <div className="slideBox">
                      {index === 0 ? (
                        <img
                          className="rankingImg"
                          src={first.src}
                          alt="1순위 아이콘"
                        />
                      ) : index === 1 ? (
                        <img
                          className="rankingImg"
                          src={second.src}
                          alt="2순위 아이콘"
                        />
                      ) : index === 2 ? (
                        <img
                          className="rankingImg"
                          src={third.src}
                          alt="3순위 아이콘"
                        />
                      ) : null}
                      <h2>#{item.category}</h2>
                      <div className="likes">
                        좋아요 <span>{item.likes}</span> 조회수
                        <span>{item.views}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                      <h4>
                        <span>{item.publishedDate.split('T')[0]}</span>{' '}
                        {item.user.info.nickname}
                      </h4>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Container>
      </HotTopic>
      <Post>
        <Container id="home_posts">
          <PostsTable
            table_title="전체 게시물"
            posts={latest_posts}
            getPosts={getLatestPosts}
          />
          <Pagination
            current_page={current_page}
            total_count={total_cnt}
            per_page={10}
            block={5}
            onChange={setCurrentPage}
          />
        </Container>
      </Post>
    </HomeContainer>
  )
}

export default Home

// const getServerSideProps: GetServerSideProps = async (context) => {

//   const hotPosts = await API.posts.getHotPosts(getHotPosts)

//   return {props: {data: null}}
// }
