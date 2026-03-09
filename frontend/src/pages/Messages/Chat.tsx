import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Input, Button, Avatar } from 'antd'
import { LeftOutlined, UserOutlined } from '@ant-design/icons'
import { getChatHistory, sendMessage } from '../../api/message'
import { getUserById } from '../../api/user'
import type { Message, User } from '../../types'
import { imageUrl } from '../../utils/request'
import { useUserStore } from '../../store/useUserStore'
import dayjs from 'dayjs'

export default function Chat() {
  const { userId } = useParams<{ userId: string }>()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId')
  const productTitle = searchParams.get('productTitle') ? decodeURIComponent(searchParams.get('productTitle')!) : null
  const navigate = useNavigate()
  const { user } = useUserStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [content, setContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchHistory = () =>
    getChatHistory(Number(userId)).then((res) => {
      setMessages(res.data)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }).catch(() => {})

  useEffect(() => {
    getUserById(Number(userId)).then((res) => setOtherUser(res.data))
    fetchHistory()
    const timer = setInterval(fetchHistory, 3000)
    return () => clearInterval(timer)
  }, [userId])

  const handleSend = async () => {
    if (!content.trim()) return
    await sendMessage({
      receiverId: Number(userId),
      productId: productId ? Number(productId) : undefined,
      content: content.trim(),
    })
    setContent('')
    fetchHistory()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <LeftOutlined onClick={() => navigate(-1)} style={{ fontSize: 18, cursor: 'pointer' }} />
        <Avatar size={32} src={imageUrl(otherUser?.avatar)} icon={<UserOutlined />} style={{ margin: '0 10px' }} />
        <span style={{ fontSize: 16, fontWeight: 500 }}>{otherUser?.nickname || '...'}</span>
      </div>

      {/* Related item banner */}
      {productTitle && (
        <div style={{ background: '#fff7f0', padding: '8px 16px', fontSize: 12, color: '#4caf7d', borderBottom: '1px solid #ffe4d0' }}>
          Asking about: {productTitle}
        </div>
      )}

      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f5f5f5' }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              {!isMine && <Avatar size={32} src={imageUrl(otherUser?.avatar)} icon={<UserOutlined />} style={{ marginRight: 8, flexShrink: 0 }} />}
              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  background: isMine ? '#4caf7d' : '#fff',
                  color: isMine ? '#fff' : '#333',
                  padding: '8px 12px',
                  borderRadius: isMine ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 11, color: '#ccc', marginTop: 2, textAlign: isMine ? 'right' : 'left' }}>
                  {dayjs(msg.createdAt).format('HH:mm')}
                </div>
              </div>
              {isMine && <Avatar size={32} src={imageUrl(user?.avatar)} icon={<UserOutlined />} style={{ marginLeft: 8, flexShrink: 0 }} />}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 16px', background: '#fff', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message..."
          style={{ borderRadius: 20 }}
        />
        <Button
          type="primary"
          onClick={handleSend}
          disabled={!content.trim()}
          style={{ background: '#4caf7d', borderColor: '#4caf7d' }}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
