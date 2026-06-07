import axios from 'axios'
import type { Book, ImageLinks } from '@/types/book'

const BASE_URL = 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org'

export const OPEN_LIBRARY_SEARCH_FIELDS =
  'key,title,author_name,first_publish_year,cover_i,subject,first_sentence,ratings_average,number_of_pages_median'

export interface OpenLibrarySearchDoc {
  key: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
  first_sentence?: string | { value?: string } | string[]
  ratings_average?: number
  number_of_pages_median?: number
}

export interface OpenLibrarySearchResponse {
  docs: OpenLibrarySearchDoc[]
}

export interface OpenLibraryWork {
  key: string
  title?: string
  description?: string | { value?: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  authors?: { author: { key: string } }[]
  links?: { title?: string; url?: string }[]
}

export interface OpenLibraryAuthor {
  name?: string
}

export function workIdFromKey(key: string): string {
  return key.replace(/^\/works\//, '')
}

function coverUrl(coverId?: number): ImageLinks | undefined {
  if (!coverId) return undefined

  const url = `${COVERS_URL}/b/id/${coverId}-M.jpg`
  return { smallThumbnail: url, thumbnail: url }
}

function parseTextField(value?: string | { value?: string } | string[]): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0] ?? ''
  return value.value ?? ''
}

export function formatRating(rating?: number): number | undefined {
  if (rating == null) return undefined
  return Math.round(rating * 10) / 10
}

export function mapSearchDocToBook(doc: OpenLibrarySearchDoc): Book {
  const id = workIdFromKey(doc.key)

  return {
    id,
    volumeInfo: {
      title: doc.title ?? '',
      authors: doc.author_name ?? null,
      description: parseTextField(doc.first_sentence),
      publishedDate: doc.first_publish_year?.toString() ?? '',
      pageCount: doc.number_of_pages_median ?? 0,
      categories: doc.subject ?? [],
      imageLinks: coverUrl(doc.cover_i),
      averageRating: formatRating(doc.ratings_average),
      previewLink: `${BASE_URL}/works/${id}`,
    },
  }
}

export function mapWorkToBook(work: OpenLibraryWork, authorNames: string[]): Book {
  const id = workIdFromKey(work.key)
  const previewLink = work.links?.[0]?.url ?? `${BASE_URL}/works/${id}`

  return {
    id,
    volumeInfo: {
      title: work.title ?? '',
      authors: authorNames.length ? authorNames : null,
      description: parseTextField(work.description),
      publishedDate: work.first_publish_date ?? '',
      pageCount: 0,
      categories: work.subjects ?? [],
      imageLinks: coverUrl(work.covers?.[0]),
      averageRating: undefined,
      previewLink,
    },
  }
}

export async function enrichBooksWithDescriptions(bookList: Book[]): Promise<Book[]> {
  return Promise.all(
    bookList.map(async (book) => {
      if (book.volumeInfo.description.trim()) return book

      try {
        const { data } = await axios.get<OpenLibraryWork>(`${BASE_URL}/works/${book.id}.json`)
        const description = parseTextField(data.description)
        if (!description) return book

        return {
          ...book,
          volumeInfo: { ...book.volumeInfo, description },
        }
      } catch {
        return book
      }
    }),
  )
}
