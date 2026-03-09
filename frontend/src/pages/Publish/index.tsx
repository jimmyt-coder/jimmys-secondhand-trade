import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, Button, message, Slider } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import { getCategories } from '../../api/category'
import { publishProduct, updateProduct, getProductDetail } from '../../api/product'
import type { Category } from '../../types'
import ImageUpload from '../../components/ImageUpload'
import { useUserStore } from '../../store/useUserStore'

const CONDITION_MARKS = { 1: 'Fair', 2: 'Good', 3: 'Very Good', 4: 'Like New', 5: 'Brand New' }

export default function Publish() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isLoggedIn } = useUserStore()
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    getCategories().then((res) => setCategories(res.data))
    if (isEdit) {
      getProductDetail(Number(id)).then((res) => {
        const p = res.data
        form.setFieldsValue({
          title: p.title,
          description: p.description,
          price: p.price,
          categoryId: p.categoryId,
          conditionLevel: p.conditionLevel,
          images: p.images || (p.coverImage ? [p.coverImage] : []),
        })
      })
    }
  }, [])

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(Number(id), values)
        message.success('Changes saved')
        navigate(`/product/${id}`)
      } else {
        const res = await publishProduct(values)
        message.success('Listing published')
        navigate(`/product/${res.data}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <LeftOutlined onClick={() => navigate(-1)} style={{ fontSize: 18, cursor: 'pointer' }} />
        <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500 }}>{isEdit ? 'Edit Listing' : 'Post a Listing'}</span>
      </div>

      <div style={{ padding: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ conditionLevel: 5 }}>
          <Form.Item label="Photos (first photo is cover)" name="images" rules={[{ required: true, message: 'Please upload at least one photo' }]}>
            <ImageUpload maxCount={9} />
          </Form.Item>

          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input placeholder="Describe your item in one line" maxLength={100} showCount />
          </Form.Item>

          <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Select a category" options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          </Form.Item>

          <Form.Item label="Price (¥)" name="price" rules={[{ required: true, message: 'Please enter a price' }]}>
            <InputNumber min={0.01} precision={2} style={{ width: '100%' }} placeholder="0.00" size="large" prefix="¥" />
          </Form.Item>

          <Form.Item label="Condition" name="conditionLevel">
            <Slider min={1} max={5} step={1} marks={CONDITION_MARKS} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Describe the item's condition, purchase date, usage history, etc." maxLength={1000} showCount />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            style={{ background: '#4caf7d', borderColor: '#4caf7d', marginTop: 8 }}
          >
            {isEdit ? 'Save Changes' : 'Publish Now'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
