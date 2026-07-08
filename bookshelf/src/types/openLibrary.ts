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
  numFound?: number
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
