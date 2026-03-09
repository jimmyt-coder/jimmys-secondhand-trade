import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Badge } from 'antd'
import {
  HomeOutlined,
  PlusCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getUnreadCount } from '../../api/message'
import { useUserStore } from '../../store/useUserStore'

const tabs = [
  { path: '/', icon: HomeOutlined, label: 'Home' },
  { path: '/publish', icon: PlusCircleOutlined, label: 'Sell' },
  { path: '/messages', icon: MessageOutlined, label: 'Messages' },
  { path: '/me', icon: UserOutlined, label: 'Me' },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useUserStore()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) return
    const fetch = () =>
      getUnreadCount()
        .then((res) => setUnread(res.data?.count || 0))
        .catch(() => {})
    fetch()
    const timer = setInterval(fetch, 5000)
    return () => clearInterval(timer)
  }, [isLoggedIn()])

  const handleTabClick = (path: string) => {
    if ((path === '/publish' || path === '/messages' || path === '/me') && !isLoggedIn()) {
      navigate('/login')
      return
    }
    navigate(path)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Top nav (desktop) */}
      <div style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
      }} className="desktop-nav">
      </div>

      <div style={{ paddingBottom: 60, maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </div>

      {/* Bottom tab bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: 600, margin: '0 auto' }}>
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <div
                key={path}
                onClick={() => handleTabClick(path)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: active ? '#4caf7d' : '#999',
                  fontSize: 12,
                  gap: 2,
                }}
              >
                {label === 'Messages' ? (
                  <Badge count={unread} size="small">
                    <Icon style={{ fontSize: 22, color: active ? '#4caf7d' : '#999' }} />
                  </Badge>
                ) : (
                  <Icon style={{ fontSize: 22 }} />
                )}
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
