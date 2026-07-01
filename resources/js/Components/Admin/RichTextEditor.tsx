import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const defaultModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ]
}

const defaultFormats = ['header', 'bold', 'italic', 'underline', 'color', 'background', 'list', 'link']

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  modules?: Record<string, unknown>
  formats?: string[]
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
  modules,
  formats,
  className = ''
}: RichTextEditorProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-300 ${className}`}>

      {/*
        This style block forces Quill to drop its internal borders
        without needing any global CSS files or weird Tailwind syntax.
      */}
      <style>{`
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #d1d5db !important; }
        .ql-container.ql-snow { border: none !important; }
      `}</style>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules ?? defaultModules}
        formats={formats ?? defaultFormats}
        placeholder={placeholder}
        className="bg-white"
        readOnly={readOnly}
      />
    </div>
  )
}
