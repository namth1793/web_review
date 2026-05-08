import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useEffect, useRef, useState } from 'react'
import { adminUploadImage } from '../../api/admin'

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 rounded text-sm transition select-none
        ${active ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-700 mx-1 self-center" />
}

export default function RichTextEditor({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: 'Viết nội dung bài review tại đây...' }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[360px] focus:outline-none px-4 py-4',
      },
    },
  })

  // sync external value (e.g. when editing loads)
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value]) // eslint-disable-line

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setUploading(true)
    try {
      const data = await adminUploadImage(file)
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function setLink() {
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('URL:', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  if (!editor) return null

  const btn = (action, label, title, activeCheck) => ({
    onClick: action, title, active: activeCheck, children: label,
  })

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden focus-within:border-red-500 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-700 bg-gray-850">

        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>↩</ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>↪</ToolBtn>
        <Divider />

        {/* Headings */}
        <ToolBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolBtn>
        <ToolBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolBtn>
        <ToolBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolBtn>
        <Divider />

        {/* Inline marks */}
        <ToolBtn title="Bold" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolBtn>
        <ToolBtn title="Underline" active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolBtn>
        <ToolBtn title="Inline code" active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}>{'<>'}</ToolBtn>
        <Divider />

        {/* Alignment */}
        <ToolBtn title="Left" active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}>≡</ToolBtn>
        <ToolBtn title="Center" active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}>≡·</ToolBtn>
        <ToolBtn title="Right" active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}>·≡</ToolBtn>
        <Divider />

        {/* Lists */}
        <ToolBtn title="Bullet list" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>• —</ToolBtn>
        <ToolBtn title="Numbered list" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolBtn>
        <ToolBtn title="Blockquote" active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>"</ToolBtn>
        <ToolBtn title="Code block" active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{ '{ }' }</ToolBtn>
        <Divider />

        {/* Link */}
        <ToolBtn title="Link" active={editor.isActive('link')} onClick={setLink}>🔗</ToolBtn>

        {/* Horizontal rule */}
        <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolBtn>

        {/* Table */}
        <ToolBtn title="Insert table" onClick={insertTable}>⊞</ToolBtn>
        <Divider />

        {/* Image upload */}
        <label
          title="Upload image to Cloudinary"
          className={`px-2 py-1 rounded text-sm cursor-pointer transition select-none
            ${uploading ? 'opacity-50 cursor-wait' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          {uploading ? '⏳' : '🖼️'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
