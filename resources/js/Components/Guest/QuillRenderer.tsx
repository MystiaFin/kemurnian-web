import sanitizeHtml from 'sanitize-html'
import './QuillRenderer.css'

interface QuillRendererProps {
  content: string
  className?: string
}

function processQuillHTML(html: string): string {
  let processed = html
  processed = processed.replace(/<ol>/g, '<ul>')
  processed = processed.replace(/<\/ol>/g, '</ul>')
  processed = processed.replace(/data-list="bullet"/g, 'data-list-type="bullet"')
  processed = processed.replace(/data-list="ordered"/g, 'data-list-type="ordered"')
  processed = processed.replace(/<li[^>]*>\s*<p>/g, '<li>')
  processed = processed.replace(/<\/p>\s*<\/li>/g, '</li>')
  processed = processed.replace(/<span class="ql-ui"[^>]*><\/span>/g, '')
  return processed
}

export default function QuillRenderer({ content, className = '' }: QuillRendererProps) {
  if (!content) return null

  const processed = processQuillHTML(content)

  const cleanContent = sanitizeHtml(processed, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'u', 'span', 'div'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class', 'data-list-type'],
      img: ['src', 'width', 'height', 'alt'],
    },
    allowedSchemes: ['http', 'https', 'data'],
  })

  return (
    <div className={`quill-renderer ${className}`}>
      <div
        dangerouslySetInnerHTML={{ __html: cleanContent }}
        className="quill-content"
      />
    </div>
  )
}
