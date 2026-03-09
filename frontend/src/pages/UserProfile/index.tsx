import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar, Tabs, List, Row, Col, Button } from 'antd'
import { LeftOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons'
import { getUserById } from '../../api/user'
import { getUserProducts } from '../../api/product'
import { getReviewsByUser } from '../../api/review'
import type { User, Product, Review } from '../../types'
import { imageUrl } from '../../utils/request'
import ProductCard from '../../components/ProductCard'
import { useUserStore } from '../../store/useUserStore'
import dayjs from 'dayjs'

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser, isLoggedIn } = useUserStore()
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const uid = Number(id)
    getUserById(uid).then((res) => setUser(res.data))
    getUserProducts(uid, { page: 1, size: 50 }).then((res) => setProducts(res.data.records))
    getReviewsByUser(uid).then((res) => setReviews(res.data))
  }, [id])

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <LeftOutlined onClick={() => navigate(-1)} style={{ fontSize: 18, cursor: 'pointer' }} />
        <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500 }}>Profile</span>
      </div>

      <div style={{ background: '#4caf7d', padding: '24px 20px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} src={imageUrl(user.avatar)} icon={<UserOutlined />} style={{ border: '2px solid rgba(255,255,255,0.6)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{user.nickname}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>@{user.username}</div>
            {user.bio && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{user.bio}</div>}
          </div>
          {/* Only show message button for other users */}
          {isLoggedIn() && currentUser?.id !== user.id && (
            <Button
              ghost
              icon={<MessageOutlined />}
              onClick={() => navigate(`/messages/${user.id}`)}
            >
              Message
            </Button>
          )}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 24, fontSize: 13 }}>
          <span>Credit <strong>{user.creditScore}</strong></span>
          <span>Listed <strong>{products.length}</strong></span>
          <span>Joined <strong>{dayjs(user.createdAt).format('YYYY-MM')}</strong></span>
        </div>
      </div>

      <div style={{ background: '#fff' }}>
        <Tabs
          centered
          items={[
            {
              key: 'products',
              label: `Listings (${products.length})`,
              children: (
                <Row gutter={[8, 8]} style={{ padding: 8 }}>
                  {products.map((p) => <Col key={p.id} span={12}><ProductCard product={p} /></Col>)}
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
          ]}
        />
      </div>
    </div>
  )
}
