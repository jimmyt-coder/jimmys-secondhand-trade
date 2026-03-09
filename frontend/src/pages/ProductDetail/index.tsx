import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Image, Tag, Avatar, Divider, Space, message, Popconfirm, Input, List } from 'antd'
import { HeartOutlined, HeartFilled, MessageOutlined, LeftOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons'
import { getProductDetail, updateProductStatus, deleteProduct } from '../../api/product'
import { addFavorite, removeFavorite } from '../../api/favorite'
import { getComments, addComment, deleteComment } from '../../api/comment'
import type { Product } from '../../types'
import { imageUrl } from '../../utils/request'
import { useUserStore } from '../../store/useUserStore'
import dayjs from 'dayjs'

const CONDITION_MAP: Record<number, string> = { 5: 'Brand New', 4: 'Like New', 3: 'Very Good', 2: 'Good', 1: 'Fair' }

interface CommentVO {
  id: number
  userId: number
  userNickname: string
  userAvatar: string | null
  content: string
  createdAt: string
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useUserStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [comments, setComments] = useState<CommentVO[]>([])
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const pid = Number(id)
    getProductDetail(pid).then((res) => {
      setProduct(res.data)
      setFavorited(res.data.favorited)
    })
    getComments(pid).then((res) => setComments(res.data))
  }, [id])

  if (!product) return null

  const isMine = user?.id === product.sellerId

  const toggleFavorite = async () => {
    if (!isLoggedIn()) { navigate('/login'); return }
    try {
      if (favorited) { await removeFavorite(product.id); setFavorited(false) }
      else { await addFavorite(product.id); setFavorited(true) }
    } catch {}
  }

  const handleContact = () => {
    if (!isLoggedIn()) { navigate('/login'); return }
    navigate(`/messages/${product.sellerId}?productId=${product.id}&productTitle=${encodeURIComponent(product.title)}`)
  }

  const handleMarkSold = async () => {
    await updateProductStatus(product.id, 1)
    message.success('Marked as sold')
    setProduct({ ...product, status: 1 })
  }

  const handleDelete = async () => {
    await deleteProduct(product.id)
    message.success('Listing deleted')
    navigate(-1)
  }

  const handleAddComment = async () => {
    if (!isLoggedIn()) { navigate('/login'); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      await addComment(product.id, commentText.trim())
      setCommentText('')
      const res = await getComments(product.id)
      setComments(res.data)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(product.id, commentId)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  const images = product.images?.length ? product.images : product.coverImage ? [product.coverImage] : []

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', maxWidth: 800, margin: '0 auto' }}>
      {/* Top navigation */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: '1px solid #f0f0f0' }}>
        <LeftOutlined onClick={() => navigate(-1)} style={{ fontSize: 18, cursor: 'pointer' }} />
        <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500 }}>Item Details</span>
      </div>

      {/* Images */}
      <div style={{ background: '#fff' }}>
        <Image.PreviewGroup>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
            {images.length > 0 ? images.map((url, i) => (
              <Image
                key={i}
                src={imageUrl(url) || ''}
                width={images.length === 1 ? '100%' : 280}
                height={280}
                style={{ objectFit: 'contain', background: '#f5f5f5' }}
                wrapperStyle={{ flexShrink: 0, display: 'block' }}
              />
            )) : (
              <div style={{ width: '100%', height: 280, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No Images</div>
            )}
          </div>
        </Image.PreviewGroup>

        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#4caf7d' }}>¥{product.price}</span>
            {product.status === 1 && <Tag color="default">Sold</Tag>}
            {product.status === 2 && <Tag color="warning">Unlisted</Tag>}
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{product.title}</div>
          <Space style={{ marginBottom: 12 }}>
            <Tag>{product.categoryName}</Tag>
            <Tag color="orange">{CONDITION_MAP[product.conditionLevel]}</Tag>
            <span style={{ color: '#999', fontSize: 12 }}>Views: {product.viewCount}</span>
          </Space>

          {product.description && (
            <>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{product.description}</div>
            </>
          )}

          <Divider style={{ margin: '12px 0' }} />

          {/* Seller info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate(`/user/${product.sellerId}`)}>
            <Avatar size={44} src={imageUrl(product.sellerAvatar)} icon={<UserOutlined />} />
            <div>
              <div style={{ fontWeight: 500 }}>{product.sellerNickname}</div>
              <div style={{ color: '#999', fontSize: 12 }}>Credit Score: {product.sellerCreditScore}</div>
            </div>
            <Button type="link" style={{ marginLeft: 'auto' }}>View Profile &gt;</Button>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div style={{ background: '#fff', marginTop: 8, padding: '16px' }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
          Discussion ({comments.length})
        </div>

        {/* Post a comment */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Avatar size={36} src={imageUrl(user?.avatar)} icon={<UserOutlined />} />
          <div style={{ flex: 1, display: 'flex', gap: 8 }}>
            <Input.TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isLoggedIn() ? 'Share your thoughts...' : 'Log in to join the discussion'}
              autoSize={{ minRows: 1, maxRows: 4 }}
              maxLength={500}
              style={{ flex: 1 }}
              onClick={() => { if (!isLoggedIn()) navigate('/login') }}
            />
            <Button
              type="primary"
              loading={submitting}
              disabled={!commentText.trim()}
              onClick={handleAddComment}
              style={{ background: '#4caf7d', borderColor: '#4caf7d', alignSelf: 'flex-end' }}
            >
              Post
            </Button>
          </div>
        </div>

        {/* Comment list */}
        <List
          dataSource={comments}
          locale={{ emptyText: 'No comments yet. Be the first!' }}
          renderItem={(c) => (
            <List.Item
              style={{ padding: '10px 0', alignItems: 'flex-start' }}
              actions={
                user?.id === c.userId
                  ? [
                      <Popconfirm key="del" title="Delete this comment?" onConfirm={() => handleDeleteComment(c.id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
                        <Button type="text" size="small" icon={<DeleteOutlined />} style={{ color: '#ccc' }} />
                      </Popconfirm>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={<Avatar size={36} src={imageUrl(c.userAvatar)} icon={<UserOutlined />} style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${c.userId}`)} />}
                title={
                  <span style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate(`/user/${c.userId}`)}>{c.userNickname}</span>
                    <span style={{ color: '#ccc', fontSize: 11, marginLeft: 8 }}>{dayjs(c.createdAt).format('MM-DD HH:mm')}</span>
                  </span>
                }
                description={<span style={{ color: '#333', fontSize: 14 }}>{c.content}</span>}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Spacer to prevent content hidden behind bottom bar */}
      <div style={{ height: 70 }} />

      {/* Bottom action bar */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 800, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '10px 16px', display: 'flex', gap: 10, zIndex: 100 }}>
        {isMine ? (
          <>
            <Button onClick={() => navigate(`/product/${product.id}/edit`)} style={{ flex: 1 }}>Edit</Button>
            {product.status === 0 && <Button onClick={handleMarkSold} style={{ flex: 1 }}>Mark as Sold</Button>}
            <Popconfirm title="Delete this listing?" onConfirm={handleDelete} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
              <Button danger style={{ flex: 1 }}>Delete</Button>
            </Popconfirm>
          </>
        ) : (
          <>
            <Button icon={favorited ? <HeartFilled style={{ color: '#4caf7d' }} /> : <HeartOutlined />} onClick={toggleFavorite} style={{ flex: 1 }}>
              {favorited ? 'Saved' : 'Save'}
            </Button>
            <Button type="primary" icon={<MessageOutlined />} onClick={handleContact} style={{ flex: 2, background: '#4caf7d', borderColor: '#4caf7d' }}>
              Contact Seller
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
