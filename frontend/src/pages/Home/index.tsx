import * as React from 'react'
import {
  HomeContainer,
  CategoryBanner,
  BlueBanner,
  PopularPostBanner,
  LatestPostBanner,
} from '../../styles/Home.styles'
import Search from '../../components/Search'
import { Link } from 'react-router-dom'
import arrow from '../../assets/img/arrow_right.png'

interface IHomeProps {}

const categories = [
  { id: '0', imgUrl: '/assets/img/vaccine.svg', name: '백신' },
  { id: '1', imgUrl: '/assets/img/cold.svg', name: '감기' },
  { id: '2', imgUrl: '/assets/img/headache.svg', name: '두통' },
  { id: '3', imgUrl: '/assets/img/tooth.svg', name: '치통' },
  { id: '4', imgUrl: '/assets/img/bug.svg', name: '벌레물림' },
  { id: '5', imgUrl: '/assets/img/muscle.svg', name: '근육통' },
  { id: '6', imgUrl: '/assets/img/virus.svg', name: '바이러스' },
  { id: '7', imgUrl: '/assets/img/stomache.svg', name: '복통' },
]

const popularPosts = [
  {
    img: '/assets/img/num1.png',
    category: '카테고리',
    title: '제목',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o',
    author: '작성자',
  },
  {
    img: '/assets/img/num2.png',
    category: '카테고리',
    title: '제목',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o',
    author: '작성자',
  },
  {
    img: '/assets/img/num3.png',
    category: '카테고리',
    title: '제목',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o',
    author: '작성자',
  },
]

export default function Home(props: IHomeProps) {
  return (
    <HomeContainer>
      <Search />
      <CategoryBanner className="wrap">
        <div className="title">인기 카테고리</div>
        <div className="categoryItemContainer">
          {categories.map((item) => {
            return (
              <div className="categoryItem" key={`category: ${item.id}`}>
                <img src={item.imgUrl} alt={`${item.name} 아이콘`} />
                <h2>{item.name}</h2>
              </div>
            )
          })}
        </div>
      </CategoryBanner>
      <BlueBanner>
        <h3>너의 건강상태도 알려줘~!</h3>
        {localStorage.getItem('jwttoken') ? (
          <Link to="/posts/edit">글 쓰러가기</Link>
        ) : (
          <Link to="/login">로그인 하고 글 쓰러가기</Link>
        )}
      </BlueBanner>
      <PopularPostBanner className="wrap">
        <div className="title">인기 게시글</div>
        <div className="popularPostContainer">
          {popularPosts.map((item, idx) => (
            <Link
              to=""
              className="popularPost"
              key={`popularPosts: ${idx.toString()}`}
            >
              <img src={item.img} alt="뱃지" />
              <h2>#{item.category}</h2>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <h4>{item.author}</h4>
            </Link>
          ))}
        </div>
      </PopularPostBanner>
      <LatestPostBanner className="wrap">
        <div className="title">최신 게시글</div>
        <Link to="/posts/lists" className="viewMoreBtn">
          더보기 +
        </Link>
        <div className="latestPostContainer">
          <Link to="" className="latestPost">
            <div className="postTitle">제목들어갈 부분</div>
            <img src={arrow} alt="화살표 아이콘" />
          </Link>
          <Link to="" className="latestPost">
            <div className="postTitle">제목들어갈 부분</div>
            <img src={arrow} alt="화살표 아이콘" />
          </Link>
          <Link to="" className="latestPost">
            <div className="postTitle">제목들어갈 부분</div>
            <img src={arrow} alt="화살표 아이콘" />
          </Link>
        </div>
      </LatestPostBanner>
    </HomeContainer>
  )
}
