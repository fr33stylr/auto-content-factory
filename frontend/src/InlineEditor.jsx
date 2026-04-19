import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import EditorBubbleMenu from './EditorBubbleMenu';

export default function InlineEditor({ initialContent, onContentChange, isEditing }) {
  
  // THE LOOP KILLER: We set the initial HTML exactly once. 
  // If the string already has HTML in it, we bypass the Markdown parser completely!
  const [startingHTML] = useState(() => {
    if (!initialContent) return "";
    if (initialContent.trim().startsWith('<')) return initialContent;
    return marked.parse(initialContent);
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: startingHTML, // Use the locked HTML
    editable: isEditing,
    editorProps: {
      attributes: {
        className: `prose prose-invert max-w-none focus:outline-none min-h-[100px] p-2 transition-colors ${isEditing ? 'bg-white/5 rounded-lg border border-white/10' : ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      // Safely send the HTML up to App.jsx without triggering a reverse loop
      onContentChange(editor.getHTML()); 
    }
  });

  // Only listen for changes to the Edit/Lock switch
  useEffect(() => {
    if (editor && editor.isEditable !== isEditing) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  if (!editor) return null;

  return (
    <div className="relative">
      {isEditing && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}