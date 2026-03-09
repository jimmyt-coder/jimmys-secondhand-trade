import { useEffect, useState } from 'react'
import { Avatar, Button, Tabs, List, Modal, Form, Input, message, Popconfirm, Card, Tag } from 'antd'
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'
import { getMyProducts, deleteProduct } from '../../api/product'
import { getFavorites } from '../../api/favorite'
import { getReviewsByUser } from '../../api/review'
import { updateMe } from '../../api/user'
import type { Product, Review } from '../../types'
import { imageUrl } from '../../utils/request'
import { Row, Col } from 'antd'
import ProductCard from '../../components/ProductCard'
import ImageUpload from '../../components/ImageUpload'
import dayjs from 'dayjs'

export default function Me() {
  const navigate = useNavigate()
  const { user, isLoggedIn, setUser, logout } = useUserStore()
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [editVisible, setEditVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    getMyProducts({ page: 1, size: 50 }).then((res) => setMyProducts(res.data.records))
    getFavorites({ page: 1, size: 50 }).then((res) => setFavorites(res.data.records))
    if (user) getReviewsByUser(user.id).then((res) => setReviews(res.data))
  }, [])

  if (!user) return null

  const handleEdit = async (values: any) => {
    const avatar = values.avatarList?.[0] || user.avatar
    await updateMe({ nickname: values.nickname, bio: values.bio, avatar })
    setUser({ ...user, nickname: values.nickname, bio: values.bio, avatar })
    message.success('Profile saved')
    setEditVisible(false)
  }

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id)
    setMyProducts((prev) => prev.filter((p) => p.id !== id))
    message.success('Listing deleted')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = [
    {
      key: 'products',
      label: `Listings (${myProducts.length})`,
      children: (
        <Row gutter={[8, 8]} style={{ padding: '8px' }}>
          {myProducts.map((p) => (
            <Col key={p.id} xs={12} sm={8} md={6}>
              <Card
                hoverable
                cover={
                  <img
                    src={imageUrl(p.coverImage) || 'https://placehold.co/300x300?text=No+Image'}
                    style={{ height: 160, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${p.id}`)}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=No+Image' }}
                  />
                }
                styles={{ body: { padding: '8px 10px' } }}
              >
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  {p.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#4caf7d', fontWeight: 600 }}>¥{p.price}</span>
                  {p.status === 1 && <Tag color="default" style={{ margin: 0, fontSize: 11 }}>Sold</Tag>}
                  {p.status === 2 && <Tag color="warning" style={{ margin: 0, fontSize: 11 }}>Unlisted</Tag>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    style={{ flex: 1, fontSize: 12 }}
                    onClick={() => navigate(`/product/${p.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this listing?"
                    onConfirm={() => handleDeleteProduct(p.id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} style={{ flex: 1, fontSize: 12 }}>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: 'favorites',
      label: `Saved (${favorites.length})`,
      children: (
        <Row gutter={[8, 8]} style={{ padding: '8px' }}>
          {favorites.map((p) => <Col key={p.id} span={12}><ProductCard product={p} /></Col>)}
        </Row>
      ),
    },
    {
      key: 'reviews',
      label: `Reviews (${reviews.length})`,
      children: (
        <List
          style={{ padding: '0 16px' }}
          dataSource={reviews}
          renderItem={(r) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={imageUrl(r.reviewerAvatar)} icon={<UserOutlined />} />}
                title={<span>{r.reviewerNickname} · {'★'.repeat(r.score)}</span>}
                description={
                  <>
                    <div>{r.content}</div>
                    <div style={{ fontSize: 11, color: '#ccc' }}>{r.productTitle} · {dayjs(r.createdAt).format('YYYY-MM-DD')}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', maxWidth: 900, margin: '0 auto' }}>
      {/* Profile header */}
      <div style={{ background: '#4caf7d', padding: '30px 20px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={72} src={imageUrl(user.avatar)} icon={<UserOutlined />} style={{ border: '2px solid rgba(255,255,255,0.6)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.nickname}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>@{user.username}</div>
            {user.bio && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{user.bio}</div>}
          </div>
          <Button icon={<EditOutlined />} size="small" ghost onClick={() => {
            form.setFieldsValue({ nickname: user.nickname, bio: user.bio })
            setEditVisible(true)
          }}>Edit</Button>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 24, fontSize: 13 }}>
          <span>Credit <strong>{user.creditScore}</strong></span>
          <span>Listed <strong>{myProducts.length}</strong></span>
          <span>Saved <strong>{favorites.length}</strong></span>
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ background: '#fff' }}>
        <Tabs centered items={tabs} />
      </div>

      <div style={{ padding: 16 }}>
        <Button block danger onClick={handleLogout}>Log Out</Button>
      </div>

      {/* Edit profile modal */}
      <Modal title="Edit Profile" open={editVisible} onCancel={() => setEditVisible(false)} onOk={() => form.submit()} okText="Save" okButtonProps={{ style: { background: '#4caf7d', borderColor: '#4caf7d' } }}>
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item label="Avatar" name="avatarList">
            <ImageUpload maxCount={1} value={user.avatar ? [user.avatar] : []} onChange={(urls) => form.setFieldValue('avatarList', urls)} />
          </Form.Item>
          <Form.Item label="Nickname" name="nickname" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={3} maxLength={200} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
