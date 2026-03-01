'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

function generateSafeId(text: string): string {
  let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  // Ensure ID doesn't start with a number (CSS selector requirement)
  if (/^\d/.test(id)) {
    id = 'heading-' + id
  }
  return id
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches = [...content.matchAll(headingRegex)]

    const extractedHeadings: Heading[] = matches.map((match) => {
      const level = match[1].length
      const text = match[2]
      const id = generateSafeId(text)
      return { id, text, level }
    })

    setHeadings(extractedHeadings)

    // Set up intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-10% 0% -66%' }
    )

    // Observe all headings in the document
    const headingElements = document.querySelectorAll('h2, h3')
    headingElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [content])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block fixed right-4 top-24 w-56 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">On this page</p>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-sm smooth-transition px-3 py-1.5 rounded-md ${
                activeId === heading.id
                  ? 'text-accent font-medium bg-accent/5'
                  : 'text-foreground/60 hover:text-foreground/80'
              } ${heading.level === 3 ? 'ml-4' : ''}`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
