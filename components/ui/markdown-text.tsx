'use client'

import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownTextProps {
  content?: string
  className?: string
  inline?: boolean
}

const LINK_CLASS_NAME = 'no-underline hover:no-underline focus-visible:no-underline visited:no-underline'

function getComponents(inline: boolean): Components {
  return {
    a: ({ href, className, rel, target, ...props }) => {
      const isExternal = typeof href === 'string' && /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className={cn(LINK_CLASS_NAME, className)}
          target={isExternal ? '_blank' : target}
          rel={isExternal ? 'noopener noreferrer' : rel}
          {...props}
        />
      )
    },
    p: ({ children }) => (inline ? <span>{children}</span> : <p>{children}</p>),
    ul: ({ children }) => <ul className={inline ? 'inline' : 'list-disc pl-5'}>{children}</ul>,
    ol: ({ children }) => <ol className={inline ? 'inline' : 'list-decimal pl-5'}>{children}</ol>,
    li: ({ children }) => (inline ? <span>{children}</span> : <li>{children}</li>),
    code: ({ children }) => <code className="font-mono">{children}</code>,
  }
}

export function MarkdownText({ content, className, inline = false }: MarkdownTextProps) {
  if (!content?.trim()) return null

  const Wrapper = inline ? 'span' : 'div'

  return (
    <Wrapper className={cn(className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={getComponents(inline)}>
        {content}
      </ReactMarkdown>
    </Wrapper>
  )
}
