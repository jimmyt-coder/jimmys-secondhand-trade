import { Form, Input, Button, Card, Tabs, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../api/auth'
import { getMe } from '../../api/user'
import { useUserStore } from '../../store/useUserStore'

export default function Login() {
  const navigate = useNavigate()
  const { setToken, setUser } = useUserStore()
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()

  const handleLogin = async (values: any) => {
    try {
      const res = await login(values)
      setToken(res.data.token)
      const userRes = await getMe()
      setUser(userRes.data)
      message.success('Logged in successfully')
      navigate('/')
    } catch {}
  }

  const handleRegister = async (values: any) => {
    try {
      await register(values)
      message.success('Account created. Please log in.')
      loginForm.setFieldsValue({ account: values.username })
    } catch {}
  }

  const loginTab = (
    <Form form={loginForm} onFinish={handleLogin} layout="vertical">
      <Form.Item name="account" label="Username / Email" rules={[{ required: true }]}>
        <Input size="large" placeholder="Enter your username or email" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password size="large" placeholder="Enter your password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large"
        style={{ background: '#4caf7d', borderColor: '#4caf7d' }}>
        Log In
      </Button>
    </Form>
  )

  const registerTab = (
    <Form form={registerForm} onFinish={handleRegister} layout="vertical">
      <Form.Item name="username" label="Username" rules={[{ required: true, min: 2, max: 20 }]}>
        <Input size="large" placeholder="2–20 characters" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input size="large" placeholder="Enter your email" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
        <Input.Password size="large" placeholder="At least 6 characters" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large"
        style={{ background: '#4caf7d', borderColor: '#4caf7d' }}>
        Sign Up
      </Button>
    </Form>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 360, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#4caf7d' }}>SecondHand</div>
          <div style={{ color: '#999', fontSize: 13 }}>Give your stuff a second life</div>
        </div>
        <Tabs
          centered
          items={[
            { key: 'login', label: 'Log In', children: loginTab },
            { key: 'register', label: 'Sign Up', children: registerTab },
          ]}
        />
      </Card>
    </div>
  )
}
