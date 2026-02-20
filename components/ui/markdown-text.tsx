'use client'

import { Icon } from '@iconify/react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownTextProps {
  content?: string
  className?: string
  inline?: boolean
}

const LINK_CLASS_NAME = 'inline-url-link'

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
        >
          <span className="inline-flex items-center gap-1">
            <span className="inline-url-link-text">{props.children}</span>
            <Icon aria-hidden="true" icon="mingcute:arrow-right-up-fill" className="inline-url-link-icon h-3 w-3 shrink-0" />
          </span>
        </a>
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
  const blockSpacingClass = inline ? '' : '[&_p+p]:mt-4'

  return (
    <Wrapper className={cn(blockSpacingClass, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={getComponents(inline)}>
        {content}
      </ReactMarkdown>
    </Wrapper>
  )
}
