import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough } from 'lucide-react';

export default function EditorBubbleMenu({ editor }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (!editor.isFocused) {
        setShow(false);
        return;
      }

      setActive({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
      });

      if (editor.state.selection.empty) {
        setShow(false);
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) return;

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let menuTop = rect.top - 50;
      let menuLeft = rect.left + (rect.width / 2);

      if (rect.width === 0 || rect.height === 0) {
        const startCoords = editor.view.coordsAtPos(editor.state.selection.from);
        const endCoords = editor.view.coordsAtPos(editor.state.selection.to);
        menuTop = Math.min(startCoords.top, endCoords.top) - 50;
        menuLeft = (startCoords.left + endCoords.left) / 2;
      }

      setPosition({ top: menuTop, left: menuLeft });
      setShow(true);
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    editor.on('blur', handleUpdate); 

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      editor.off('blur', handleUpdate);
    };
  }, [editor]);

  if (!show) return null;

  return (
    <div 
      ref={menuRef}
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
      className="fixed z-50 flex items-center bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-600 h-10 px-1 transition-opacity duration-100"
      onMouseDown={(e) => e.preventDefault()} 
    >
      <MenuButton isActive={active.bold} action={() => editor.chain().focus().toggleBold().run()} icon={<Bold size={18} strokeWidth={2.5} />} />
      <MenuButton isActive={active.italic} action={() => editor.chain().focus().toggleItalic().run()} icon={<Italic size={18} />} />
      <MenuButton isActive={active.underline} action={() => editor.chain().focus().toggleUnderline().run()} icon={<UnderlineIcon size={18} />} />
      <div className="w-px h-6 bg-neutral-700 mx-1"></div>
      <MenuButton isActive={active.strike} action={() => editor.chain().focus().toggleStrike().run()} icon={<Strikethrough size={18} />} />
    </div>
  );
}

function MenuButton({ isActive, action, icon }) {
  return (
    <button
      type="button"
      onClick={action}
      className={`p-1.5 transition-colors rounded-md mx-0.5 flex items-center justify-center ${
        isActive 
        ? 'bg-neutral-700 text-green-400 font-semibold' 
        : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}