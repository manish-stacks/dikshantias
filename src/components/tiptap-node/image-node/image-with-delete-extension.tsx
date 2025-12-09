"use client"

import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Image } from "@tiptap/extension-image"
import { X } from "lucide-react"

const ImageComponent = (props) => {
  const { node, editor } = props
  const { src, alt, align } = node.attrs
    
  return (
    <NodeViewWrapper
      className={`relative inline-block group ${
        align === "left"
          ? "float-left mr-2"
          : align === "right"
          ? "float-right ml-2"
          : "mx-auto block"
      }`}
    >
      <img src={src} alt={alt} className="max-w-full h-auto rounded" />

      {/* Delete button */}
      <button
        type="button"
        onClick={() => editor.commands.deleteSelection()}
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
        title="Delete image"
      >
        <X size={14} />
      </button>
    </NodeViewWrapper>
  )
}

export const ImageWithDelete = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: element => {
          if (element.style.float === "left") return "left"
          if (element.style.float === "right") return "right"
          return "center"
        },
        renderHTML: attrs => {
          if (attrs.align === "left") {
            return { style: "float: left; margin-right: 8px;" }
          }
          if (attrs.align === "right") {
            return { style: "float: right; margin-left: 8px;" }
          }
          return { style: "display: block; margin: 0 auto;" }
        },
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
})
