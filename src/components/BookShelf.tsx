'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookMetadata } from '@/lib/types'
import { getBookDataManager } from '@/lib/bookData'

interface BookShelfProps {
  onBookSelect?: (bookId: string) => void
}

export default function BookShelf({ onBookSelect: _onBookSelect }: BookShelfProps) {
  const [books, setBooks] = useState<BookMetadata[]>([])
  const [recentBooks, setRecentBooks] = useState<(BookMetadata & { lastRead: Date; progress: import('@/lib/types').ReadingProgress })[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const bookManager = getBookDataManager()
        await bookManager.init()
        
        const allBooks = bookManager.getAllBooks()
        const recent = bookManager.getRecentlyReadBooks(5)
        
        setBooks(allBooks)
        setRecentBooks(recent)
      } catch (error) {
        console.error('書籍データの読み込みエラー:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  // フィルタリングされた書籍リスト
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // カテゴリリスト
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))]

  if (isLoading) {
    return (
      <div className="library-container safe-area flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">書籍を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="library-container safe-area bg-gradient-to-br from-orange-50 to-orange-100">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold">絵本リーダー</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span>📖</span>
                {books.length}冊
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="library-scroll-area">
        {/* 検索セクション */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            {/* 検索バー */}
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="本のタイトル、作者、タグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            {/* カテゴリフィルター */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'すべて' : category}
                </button>
              ))}
            </div>
          </div>

          {/* 最近読んだ本 */}
          {recentBooks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <span className="text-2xl">⏰</span>
                最近読んだ本
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth px-2">
                {recentBooks.map((book) => (
                  <motion.div
                    key={`recent-${book.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Link href={`/book/${book.id}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-32 cursor-pointer hover:shadow-xl transition-shadow duration-300">
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={getBookDataManager().getThumbnailUrl(book)}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                          {/* 読書進捗バッジ */}
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {book.progress.completed ? '完読' : `${Math.round((book.progress.currentSpread / book.progress.totalSpreads) * 100)}%`}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(book.lastRead).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 書籍グリッド */}
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-800">
              <span className="text-2xl">📚</span>
              すべての本
              <span className="ml-2 bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                {filteredBooks.length}冊
              </span>
            </h2>
            
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <span className="text-6xl mb-6 block">📖</span>
                <h3 className="text-xl font-bold text-gray-800 mb-3">本が見つかりません</h3>
                <p className="text-gray-600 mb-4">検索条件を変更してみてください</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    検索をクリア
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 px-2">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={`book-${book.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="gpu-accelerated"
                  >
                    <Link href={`/book/${book.id}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer touch-optimized hover:shadow-xl transition-all duration-300 border border-gray-100 mx-auto max-w-[180px]">
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={getBookDataManager().getThumbnailUrl(book)}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 16vw, 12vw"
                          />
                          {/* 読書進捗表示 */}
                          {(() => {
                            const progress = getBookDataManager().getReadingProgress(book.id)
                            if (progress) {
                              return (
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                                  progress.completed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                }`}>
                                  {progress.completed ? '完読' : `${Math.round((progress.currentSpread / progress.totalSpreads) * 100)}%`}
                                </div>
                              )
                            }
                            return null
                          })()}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 leading-tight text-center">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3 font-medium text-center">{book.author}</p>
                          <div className="flex justify-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <span>📄</span>
                              {book.totalPages}p
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <span>⏱️</span>
                              {book.readingTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}