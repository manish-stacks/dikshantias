"use client"

import { Editor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface Props {
  editor: Editor
  align: "left" | "center" | "right"
  label: string
}

export function ImageAlignButton({ editor, align, label }: Props) {
  if (!editor) return null

  return (
    <Button
      onClick={() =>
        editor.chain().focus().updateAttributes("image", { align }).run()
      }
      className={`tiptap-button ${
        editor.getAttributes("image").align === align ? "is-active" : ""
      }`}
      title={`Align ${label}`}
    >
      {label}
    </Button>
  )
}
