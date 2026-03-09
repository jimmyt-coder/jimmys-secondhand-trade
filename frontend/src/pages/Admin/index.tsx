import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tabs, Button, Tag, Popconfirm, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useUserStore } from '../../store/useUserStore'
import {
  adminGetUsers,
  adminUpdateRole,
  adminDeleteUser,
  adminGetProducts,
  adminDeleteProduct,
  adminGetComments,
  adminDeleteComment,
} from '../../api/admin'

export default function Admin() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.user)

  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      message.error('Access denied')
      navigate('/')
    }
  }, [currentUser, navigate])

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await adminGetUsers()
      setUsers(res.data?.records ?? res.data ?? [])
    } catch {
      message.error('Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await adminGetProducts()
      setProducts(res.data?.records ?? res.data ?? [])
    } catch {
      message.error('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchComments = async () => {
    setCommentsLoading(true)
    try {
      const res = await adminGetComments()
      setComments(res.data?.records ?? res.data ?? [])
    } catch {
      message.error('Failed to load comments')
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchProducts()
    fetchComments()
  }, [])

  const userColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Nickname', dataIndex: 'nickname' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'green' : 'default'}>{role}</Tag>
      ),
    },
    { title: 'Credit Score', dataIndex: 'creditScore' },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      render: (v: string) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {record.role === 'USER' && (
            <Button
              size="small"
              onClick={async () => {
                try {
                  await adminUpdateRole(record.id, 'ADMIN')
                  message.success('Role updated')
                  fetchUsers()
                } catch {
                  message.error('Failed to update role')
                }
              }}
            >
              Make Admin
            </Button>
          )}
          {record.id !== currentUser?.id && (
            <Popconfirm
              title="Delete this user? This is irreversible."
              onConfirm={async () => {
                try {
                  await adminDeleteUser(record.id)
                  message.success('User deleted')
                  fetchUsers()
                } catch {
                  message.error('Failed to delete user')
                }
              }}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ]

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: 'On Sale', color: 'green' },
    1: { label: 'Sold', color: 'default' },
    2: { label: 'Unlisted', color: 'orange' },
  }

  const productColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title: string, record: any) => (
        <a onClick={() => navigate(`/product/${record.id}`)}>{title}</a>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (v: number) => `¥${v}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v: number) => {
        const s = statusMap[v] ?? { label: String(v), color: 'default' }
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
    { title: 'Seller', dataIndex: 'sellerNickname' },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      render: (v: string) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Delete this product? This is irreversible."
          onConfirm={async () => {
            try {
              await adminDeleteProduct(record.id)
              message.success('Product deleted')
              fetchProducts()
            } catch {
              message.error('Failed to delete product')
            }
          }}
        >
          <Button size="small" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const commentColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: 'Content',
      dataIndex: 'content',
      render: (v: string) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {v}
        </div>
      ),
    },
    { title: 'User', dataIndex: 'userNickname' },
    { title: 'Product ID', dataIndex: 'productId' },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Delete this comment? This is irreversible."
          onConfirm={async () => {
            try {
              await adminDeleteComment(record.id)
              message.success('Comment deleted')
              fetchComments()
            } catch {
              message.error('Failed to delete comment')
            }
          }}
        >
          <Button size="small" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'users',
      label: 'Users',
      children: (
        <Table
          rowKey="id"
          dataSource={users}
          columns={userColumns}
          loading={usersLoading}
          pagination={{ pageSize: 20 }}
        />
      ),
    },
    {
      key: 'products',
      label: 'Products',
      children: (
        <Table
          rowKey="id"
          dataSource={products}
          columns={productColumns}
          loading={productsLoading}
          pagination={{ pageSize: 20 }}
        />
      ),
    },
    {
      key: 'comments',
      label: 'Comments',
      children: (
        <Table
          rowKey="id"
          dataSource={comments}
          columns={commentColumns}
          loading={commentsLoading}
          pagination={{ pageSize: 20 }}
        />
      ),
    },
  ]

  if (!currentUser || currentUser.role !== 'ADMIN') return null

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div
        style={{
          background: '#4caf7d',
          color: '#fff',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          style={{ color: '#fff' }}
          onClick={() => navigate(-1)}
        />
        <span style={{ fontSize: 18, fontWeight: 600 }}>Admin Panel</span>
      </div>
      <div style={{ padding: 24 }}>
        <Tabs defaultActiveKey="users" items={tabItems} />
      </div>
    </div>
  )
}
