import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import enUS from 'antd/locale/en_US'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import Publish from './pages/Publish'
import Messages from './pages/Messages'
import Chat from './pages/Messages/Chat'
import Me from './pages/Me'
import UserProfile from './pages/UserProfile'
import Admin from './pages/Admin'

export default function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: '#4caf7d',
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/product/:id/edit" element={<Publish />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:userId" element={<Chat />} />
              <Route path="/me" element={<Me />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}
