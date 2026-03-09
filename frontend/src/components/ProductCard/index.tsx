import { Card, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types'
import { imageUrl } from '../../utils/request'

const CONDITION_MAP: Record<number, string> = {
  5: 'Brand New',
  4: 'Like New',
  3: 'Very Good',
  2: 'Good',
  1: 'Fair',
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.title}
          src={imageUrl(product.coverImage) || 'https://placehold.co/300x300?text=No+Image'}
          style={{ height: 200, objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=No+Image'
          }}
        />
      }
      onClick={() => navigate(`/product/${product.id}`)}
      styles={{ body: { padding: '10px 12px' } }}
    >
      <div style={{ fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {product.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#4caf7d', fontWeight: 600, fontSize: 16 }}>
          ¥{product.price}
        </span>
        <Tag color="default" style={{ fontSize: 11, margin: 0 }}>
          {CONDITION_MAP[product.conditionLevel] || 'Unknown'}
        </Tag>
      </div>
      <div style={{ color: '#999', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{product.sellerNickname}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <EyeOutlined /> {product.viewCount}
        </span>
      </div>
    </Card>
  )
}
