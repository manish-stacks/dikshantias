"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor, Editor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

// --- Custom Image with Delete ---
import { ImageWithDelete } from "@/components/tiptap-node/image-node/image-with-delete-extension"


// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { LinkPopover, LinkContent, LinkButton } from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

// --- Highlight Button ---
const HighlightButton = ({ editor }: { editor: Editor }) => {
  if (!editor) return null
  return (
    <Button
      onClick={() => editor.chain().focus().toggleHighlight().run()}
      className={`tiptap-button ${editor.isActive("highlight") ? "is-active" : ""}`}
      title="Highlight"
    >
      <HighlighterIcon className="tiptap-button-icon" />
    </Button>
  )
}

// --- Text Color Button ---
const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffcc00']

const TextColorButton = ({ editor }: { editor: Editor }) => {
  if (!editor) return null
  const currentColor = editor.getAttributes("textStyle").color || "#000000"

  return (
    <div className="flex gap-2 items-center">
      {colors.map((color) => (
        <button
          key={color}
           type="button"
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
            currentColor === color ? "border-black" : "border-gray-300 hover:border-gray-600"
          }`}
          style={{ backgroundColor: color }}
          title={`Text color ${color}`}
        />
      ))}
    </div>
  )
}

// --- Main Toolbar ---
const MainToolbarContent = ({ onLinkClick, isMobile, editor }: { onLinkClick: () => void, isMobile: boolean, editor: Editor }) => {
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" editor={editor} />
        <UndoRedoButton action="redo" editor={editor} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1,2,3,4]} portal={isMobile} editor={editor}/>
        <ListDropdownMenu types={["bulletList","orderedList","taskList"]} portal={isMobile} editor={editor}/>
        <BlockquoteButton editor={editor}/>
        <CodeBlockButton editor={editor}/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" editor={editor}/>
        <MarkButton type="italic" editor={editor}/>
        <MarkButton type="strike" editor={editor}/>
        <MarkButton type="code" editor={editor}/>
        <MarkButton type="underline" editor={editor}/>

        <HighlightButton editor={editor}/>
        <TextColorButton editor={editor}/>

        {!isMobile ? <LinkPopover editor={editor}/> : <LinkButton onClick={onLinkClick} editor={editor}/>}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" editor={editor}/>
        <MarkButton type="subscript" editor={editor}/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" editor={editor}/>
        <TextAlignButton align="center" editor={editor}/>
        <TextAlignButton align="right" editor={editor}/>
        <TextAlignButton align="justify" editor={editor}/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" editor={editor}/>
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

// --- Mobile Toolbar ---
const MobileToolbarContent = ({ type, onBack }: { type: string, onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        <LinkIcon className="tiptap-button-icon" />
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    <LinkContent />
  </>
)

// --- Editor Component ---
interface SimpleEditorProps {
  value?: string
  onChange?: (html: string) => void
}

export function SimpleEditor({ value = "", onChange }: SimpleEditorProps) {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = React.useState<"main" | "link">("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: { openOnClick: false, enableClickSelection: true },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading","paragraph"] }),
      TaskList,
      TaskItem.configure({ nested:true }),
      Highlight.configure({ multicolor:true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      TextStyle,
      Color,
      ImageWithDelete, // <-- ✅ Our custom image extension
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
   <div className="flex flex-col w-full">
  <EditorContext.Provider value={{ editor }}>
    {/* Toolbar */}
    <Toolbar className="mb-2">
      {editor && <MainToolbarContent editor={editor} onLinkClick={() => {}} isMobile={false} />}
    </Toolbar>

    {/* Editor */}
    <div className="border rounded bg-white overflow-hidden min-h-[250px]">
      <EditorContent
        editor={editor}
        className="simple-editor-content w-full h-full p-4 min-h-[250px] overflow-auto"
      />
    </div>
  </EditorContext.Provider>
</div>

  )
}
