import { useEffect, useRef } from 'react'
import { Spin } from 'antd'

interface Props {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export default function InfiniteScroll({ loading, hasMore, onLoadMore }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loading) onLoadMore() },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: 16, color: '#999', fontSize: 13 }}>
      {loading ? <Spin /> : hasMore ? 'Scroll down to load more' : products_hint}
    </div>
  )
}

const products_hint = 'All items loaded'
