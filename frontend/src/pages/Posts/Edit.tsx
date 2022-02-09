import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/Button'
import API from 'service/api'
import ReactQuill, { Quill } from 'react-quill'
import { Select, Tag, Input } from 'antd'
import { TweenOneGroup } from 'rc-tween-one'
import ImageResize from 'quill-image-resize-module'
import 'react-quill/dist/quill.snow.css'
import { PostModel } from 'model/postsModel'
import { categoryList } from 'static/constant'
import { Container, Title } from 'common.styles'
import { PostEditContainer, HashTagSection } from './styles'

interface IPostsEditProps {}

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
  const history = useHistory()
  const quill_ref = useRef<ReactQuill>()
  const saveInputRef = useRef(null)
  const [pushState, setPushState] = useState<PostModel>({} as PostModel)
  const [posts_title, setPostsTitle] = useState('')
  const [edit_contents, setEditContents] = useState('')
  const [filter, setFilter] = useState(
    pushState.category ? pushState.category : categoryList[0],
  )

  const { Option } = Select

  const [tagState, setTagState] = useState({
    tags: ['DR.U'],
    inputVisible: false,
    inputValue: '',
  })

  const handleClose = (removedTag: any) => {
    const tags = tagState.tags.filter((tag) => tag !== removedTag)
    console.log(tags)
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

    console.log(tags)

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

  const tagChild = tagState.tags.map(forMap)

  const imageHandler = (e: any) => {
    // 이미지를 업로드 할 input element 생성
    const input = document.createElement('input')
    input.setAttribute('name', 'file')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.setAttribute('style', 'display: none')
    document.body.appendChild(input)

    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      console.log(file)

      // 백엔드 서버 경로에 이미지를 저장하고 이미지 경로를 받아오기
      const res = await API.post.uploadImage(file as File)
      const file_path = res.data as string[]

      const range = quill_ref.current?.getEditor().getSelection()?.index
      if (range !== null && range !== undefined) {
        let quill = quill_ref.current?.getEditor()

        quill?.setSelection(range, 1)

        file_path.forEach((item) => {
          quill?.insertEmbed(range + 1, 'image', `http://localhost:4000${item}`)
        })
      }
    }
    console.log(e)
  }

  // useMemo를 사용하지 않으면, 키를 입력할 때마다, imageHandler 때문에 focus가 계속 풀리게 됨.
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
          // 이미지 핸들러가 들어갈 키
          image: imageHandler,
        },
      },
    }),
    [],
  )

  const handleSubmitPost = async () => {
    if (posts_title === '') {
      return alert('제목을 입해주세요')
    }
    const req_data = {
      title: posts_title,
      body: edit_contents,
      category: filter,
      tags: [...tagState.tags],
    }

    await API.post
      .createPost(req_data)
      .then((res) => {
        history.push(`/posts/detail/${res.data._id}`, {
          is_create_state: true,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onClickEdit = async () => {
    if (posts_title === '') {
      return alert('제목을 입해주세요')
    }
    const req_data = {
      title: posts_title,
      body: edit_contents,
      category: filter,
    }
    await API.post
      .editPost(pushState._id, req_data)
      .then((res) => {
        alert('게시물 수정에 성공했습니다.')
        history.goBack()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const isEditButton = () => {
    if (pushState._id) {
      return (
        <>
          <Button type="button" onClick={onClickEdit}>
            수정
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button type="button" onClick={handleSubmitPost}>
            작성
          </Button>
        </>
      )
    }
  }

  useEffect(() => {
    const path_state = history.location.state as PostModel
    if (path_state) {
      setPostsTitle(path_state.title)
      setEditContents(path_state.body)
      setTagState({ ...tagState, tags: path_state.tags })
      setPushState(path_state)
    }
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <PostEditContainer>
      <Title
        style={{
          marginBottom: 40,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        게시글 작성
      </Title>
      <Container className="wrap">
        <Select defaultValue="백신" style={{ width: 250 }}>
          {categoryList.map((category, idx) => (
            <Option key={idx} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <Input
          id="posts_title"
          type="text"
          placeholder="제목을 입력해주세요"
          value={posts_title}
          onChange={(e) => setPostsTitle(e.target.value)}
        />
        <ReactQuill
          ref={(element) => {
            if (element !== null) {
              quill_ref.current = element
            }
          }}
          formats={formats}
          value={edit_contents}
          onChange={setEditContents}
          modules={modules}
          theme="snow"
          placeholder="내용을 입력해주세요."
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
                {tagChild}
              </TweenOneGroup>
            </div>
            <div className="hashWrap">
              <Input
                className="hashInput"
                placeholder="해시태그를 입력하세요."
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
                추가
              </Button>
            </div>
          </>
        </HashTagSection>
        <div className="btnWrap">{isEditButton()}</div>
      </Container>
    </PostEditContainer>
  )
}
