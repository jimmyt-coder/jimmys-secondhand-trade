import { useEffect, useState } from 'react'
import { Input, Row, Col, Empty, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getProducts } from '../../api/product'
import { getCategories } from '../../api/category'
import type { Product, Category } from '../../types'
import ProductCard from '../../components/ProductCard'
import InfiniteScroll from './InfiniteScroll'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data))
  }, [])

  const fetchProducts = async (p: number, kw: string, cid?: number, reset = false) => {
    setLoading(true)
    try {
      const res = await getProducts({ page: p, size: 20, keyword: kw || undefined, categoryId: cid })
      const records = res.data.records as Product[]
      setProducts((prev) => reset ? records : [...prev, ...records])
      setHasMore(p < res.data.pages)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(1, keyword, categoryId, true)
  }, [keyword, categoryId])

  const loadMore = () => {
    if (!loading && hasMore) fetchProducts(page + 1, keyword, categoryId)
  }

  return (
    <div>
      {/* Search bar */}
      <div style={{ background: '#4caf7d', padding: '12px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            placeholder="Search for items"
            allowClear
            style={{ borderRadius: 20 }}
            onPressEnter={(e) => setKeyword((e.target as HTMLInputElement).value)}
            onChange={(e) => !e.target.value && setKeyword('')}
          />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ background: '#fff', padding: '8px 24px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        <Select
          style={{ minWidth: 120 }}
          placeholder="All Categories"
          allowClear
          value={categoryId}
          onChange={setCategoryId}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      {/* Product list */}
      <div style={{ padding: '12px 16px', maxWidth: 1400, margin: '0 auto' }}>
        {products.length === 0 && !loading ? (
          <Empty description="No items found" style={{ marginTop: 80 }} />
        ) : (
          <Row gutter={[12, 12]}>
            {products.map((p) => (
              <Col key={p.id} xs={12} sm={8} md={6} lg={4} xl={4}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        )}
        <InfiniteScroll loading={loading} hasMore={hasMore} onLoadMore={loadMore} />
      </div>
    </div>
  )
}
