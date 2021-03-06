import React, { useState, useRef, useMemo, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Button from 'components/Button'
import API from 'service/api'
import { Select, Tag, Input } from 'antd'
import TweenOneGroup from 'rc-tween-one/lib/TweenOneGroup'
// import ImageResize from 'quill-image-resize-module'
import 'react-quill/dist/quill.snow.css'
import { PostModel } from 'model/postsModel'
import { categoryList } from 'static/constant'
import { Container } from 'common.styles'
import { PostEditContainer, HashTagSection } from 'styles/posts/styles'
import dynamic from 'next/dynamic'
import { getDiseasePeriod } from 'shared/function'
import { BASE_URL } from 'shared/api_constant'
import { Spin } from 'antd'
import { SP } from 'next/dist/shared/lib/utils'
import { GetServerSideProps } from 'next'

interface IPostsEditProps {}
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false },
)

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]
export default function PostsEdit(props: IPostsEditProps) {
  const router = useRouter()
  const quill_ref = useRef<any>()
  const saveInputRef = useRef(null)
  const [pushState, setPushState] = useState<{ id: string; category: string }>({
    id: '',
    category: '',
  })
  const [posts_title, setPostsTitle] = useState('')
  const [edit_contents, setEditContents] = useState('')
  const [filter, setFilter] = useState(
    pushState.category ? pushState.category : categoryList[0],
  )
  const [period, setPeriod] = useState('early')

  const [loading, setLoading] = useState(false)

  const { Option } = Select

  const [tagState, setTagState] = useState({
    tags: ['DR.U'],
    inputVisible: false,
    inputValue: '',
  })

  const handleClose = (removedTag: any) => {
    const tags = tagState.tags.filter((tag) => tag !== removedTag)
    setTagState({ ...tagState, tags })
  }

  const handleInputChange = (e: any) => {
    setTagState({ ...tagState, inputValue: e.target.value })
  }

  const handleInputConfirm = () => {
    const { inputValue } = tagState
    let { tags } = tagState

    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }

    setTagState({
      tags,
      inputVisible: false,
      inputValue: '',
    })
  }

  const forMap = (tag: any) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault()
          handleClose(tag)
        }}
      >
        # {tag}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    )
  }

  const imageHandler = (e: any) => {
    // ???????????? ????????? ??? input element ??????
    const input = document.createElement('input')
    input.setAttribute('name', 'file')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.setAttribute('style', 'display: none')
    document.body.appendChild(input)

    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]

      // ????????? ?????? ????????? ???????????? ???????????? ????????? ????????? ????????????
      const res = await API.post.uploadImage(file as File)
      const file_path = res.data as string[]

      const range = quill_ref.current?.getEditor().getSelection()?.index
      if (range !== null && range !== undefined) {
        let quill = quill_ref.current?.getEditor()

        quill?.setSelection(range, 1)

        file_path.forEach((item) => {
          quill?.insertEmbed(range + 1, 'image', `${BASE_URL}${item}`)
        })
      }
    }
  }

  // useMemo??? ???????????? ?????????, ?????? ????????? ?????????, imageHandler ????????? focus??? ?????? ????????? ???.
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { size: ['small', false, 'large', 'huge'] },
            { color: ['black', 'red', 'blue', 'green'] },
          ],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
          ['image', 'video'],
        ],
        handlers: {
          // ????????? ???????????? ????????? ???
          image: imageHandler,
        },
      },
    }),
    [],
  )

  const handleSubmitPost = async () => {
    if (posts_title === '') {
      return alert('????????? ???????????????')
    }
    const req_data = {
      title: posts_title,
      body: edit_contents,
      category: filter,
      tags: [...tagState.tags],
      diseasePeriod: period,
    }
    setLoading(true)
    await API.post
      .createPost(req_data)
      .then((res) => {
        router.push(`/posts/detail/${res.data._id}`)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onClickEdit = async () => {
    if (posts_title === '') {
      return alert('????????? ???????????????')
    }
    const req_data = {
      title: posts_title,
      body: edit_contents,
      category: filter,
      tags: [...tagState.tags],
      diseasePeriod: period,
    }
    setLoading(true)
    await API.post
      .editPost(pushState.id, req_data)
      .then((res) => {
        alert('????????? ????????? ??????????????????.')
        router.back()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const isEditButton = () => {
    if (pushState.id) {
      return (
        <>
          <Button type="button" onClick={onClickEdit}>
            ??????
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button type="button" onClick={handleSubmitPost}>
            ??????
          </Button>
        </>
      )
    }
  }

  const handleDiseasePeroid = (e: string) => {
    setPeriod(e)
  }

  useEffect(() => {
    const { id, title, description, tag, category, diseasePeriod } =
      router.query

    // API.post.
    if (id && title && description) {
      setPostsTitle(title as string)
      setEditContents(description as string)
      setTagState({
        ...tagState,
        tags: typeof tag === 'string' ? [tag] : (tag as string[]),
      })
      setPushState({ id: id as string, category: category as string })
      setFilter(category as string)
      setPeriod(diseasePeriod as string)
    }
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <PostEditContainer>
      <Head>
        <title>Dr.u | {pushState.id !== '' ? '??? ??????' : '??? ??????'}</title>
      </Head>
      <Container>
        <Select
          onChange={(value) => setFilter(value)}
          value={filter}
          style={{ width: 250 }}
        >
          {categoryList.map((category, idx) => (
            <Option key={idx} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <Select
          onChange={handleDiseasePeroid}
          value={period}
          style={{ width: 100, marginLeft: '20px' }}
        >
          <Option value="early">??????</Option>
          <Option value="late">??????</Option>
          <Option value="acute">??????</Option>
          <Option value="chronic">??????</Option>
          <Option value="emergency">??????</Option>
          <Option value="cure">??????</Option>
        </Select>
        <Input
          id="posts_title"
          type="text"
          placeholder="????????? ??????????????????"
          value={posts_title}
          onChange={(e) => setPostsTitle(e.target.value)}
        />
        <ReactQuill
          forwardRef={quill_ref}
          formats={formats}
          value={edit_contents}
          onChange={setEditContents}
          modules={modules}
          theme="snow"
          placeholder="????????? ??????????????????."
        />
        <HashTagSection>
          <>
            <div className="hashWrap" style={{ marginBottom: 16 }}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                }}
                onEnd={(e: any) => {
                  if (e.type === 'appear' || e.type === 'enter') {
                    e.target.style = 'display: inline-block'
                  }
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {tagState?.tags?.map(forMap)}
              </TweenOneGroup>
            </div>
            <div className="hashWrap">
              <Input
                className="hashInput"
                placeholder="??????????????? ???????????????."
                ref={saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={tagState.inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
              <Button
                type="button"
                className="addHashtag"
                onClick={handleInputConfirm}
              >
                ??????
              </Button>
            </div>
          </>
        </HashTagSection>
        <div className="btnWrap">
          {loading ? (
            <div className="ta-c">
              <Spin size="large" />
            </div>
          ) : (
            isEditButton()
          )}
        </div>
      </Container>
    </PostEditContainer>
  )
}
