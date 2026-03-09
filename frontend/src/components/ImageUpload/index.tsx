import { useState } from 'react'
import { Upload, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { uploadImage } from '../../api/file'
import { imageUrl } from '../../utils/request'

interface Props {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxCount?: number
}

export default function ImageUpload({ value = [], onChange, maxCount = 9 }: Props) {
  const [loading, setLoading] = useState(false)

  const fileList: UploadFile[] = value.map((url, i) => ({
    uid: String(i),
    name: `image-${i}`,
    status: 'done',
    url: imageUrl(url) || url,
    thumbUrl: imageUrl(url) || url,
  }))

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setLoading(true)
    try {
      const res = await uploadImage(file as File)
      const url: string = res.data
      onChange?.([...value, url])
      onSuccess?.(url)
    } catch (e) {
      onError?.(e as Error)
      message.error('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (file: UploadFile) => {
    const idx = fileList.findIndex((f) => f.uid === file.uid)
    if (idx !== -1) {
      const next = [...value]
      next.splice(idx, 1)
      onChange?.(next)
    }
  }

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={handleUpload}
      onRemove={handleRemove}
      accept="image/*"
      multiple
    >
      {value.length < maxCount && (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8, fontSize: 12 }}>Upload</div>
        </div>
      )}
    </Upload>
  )
}
