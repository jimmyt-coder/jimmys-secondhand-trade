import { useEffect, useState } from 'react'
import { List, Avatar, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { getConversations } from '../../api/message'
import type { Conversation } from '../../types'
import { imageUrl } from '../../utils/request'
import dayjs from 'dayjs'

export default function Messages() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])

  const fetch = () =>
    getConversations().then((res) => setConversations(res.data)).catch(() => {})

  useEffect(() => {
    fetch()
    const timer = setInterval(fetch, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ padding: '12px 16px', background: '#fff', fontSize: 16, fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>
        Messages
      </div>
      <List
        style={{ background: '#fff' }}
        dataSource={conversations}
        renderItem={(item) => (
          <List.Item
            onClick={() => navigate(`/messages/${item.otherUserId}`)}
            style={{ padding: '12px 16px', cursor: 'pointer' }}
          >
            <List.Item.Meta
              avatar={
                <Badge count={item.unreadCount} size="small">
                  <Avatar size={48} src={imageUrl(item.otherUserAvatar)} icon={<UserOutlined />} />
                </Badge>
              }
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.otherUserNickname}</span>
                  <span style={{ color: '#999', fontSize: 12, fontWeight: 400 }}>
                    {dayjs(item.lastMessageTime).format('MM-DD HH:mm')}
                  </span>
                </div>
              }
              description={
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: item.unreadCount > 0 ? '#333' : '#999' }}>
                    {item.lastMessage}
                  </span>
                  {item.productTitle && (
                    <span style={{ fontSize: 11, color: '#4caf7d', flexShrink: 0 }}>
                      [{item.productTitle.slice(0, 8)}]
                    </span>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No messages yet' }}
      />
    </div>
  )
}
