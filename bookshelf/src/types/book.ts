export interface Book {
  id: string
  volumeInfo: volumeInfo
}

export interface volumeInfo {
  averageRating?: number
  title: string
  authors: string[] | null
  description: string
  publishedDate: string
  pageCount: number
  categories: string[]
  imageLinks?: ImageLinks
  previewLink?: string
}

export interface ImageLinks {
  smallThumbnail: string
  thumbnail: string
}
