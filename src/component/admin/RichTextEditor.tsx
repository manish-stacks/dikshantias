  "use client";

  import { useEditor, EditorContent } from '@tiptap/react';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import { useEffect } from 'react';

  interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
  }

  export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: true }),
        Image,
      ],
      content: value || '',
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'min-h-[400px] outline-none p-2',
        },
      },
      immediatelyRender: false, // ✅ prevents SSR hydration errors
    });

    // Sync editor content if parent value changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || '');
      }
    }, [value, editor]);

    if (!editor) return null;

    return (
      <div className="border rounded p-2">
        {/* Toolbar */}
        <div className="flex gap-2 mb-2">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">Underline</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">Bullet List</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">Ordered List</button>
          <button
            onClick={() => {
              const url = prompt('Enter image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="px-2 py-1 border rounded"
          >
            Image
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter link URL');
              if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            className="px-2 py-1 border rounded"
          >
            Link
          </button>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    );
  }
