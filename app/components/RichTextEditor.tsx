'use client';

import { useEffect, useState } from 'react';
import { Extension } from '@tiptap/core';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextSelection } from '@tiptap/pm/state';
import { canJoin } from '@tiptap/pm/transform';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  small?: boolean;
}

function isCurrentBlockEmpty(editor: Editor) {
  return editor.state.selection.$from.parent.content.size === 0;
}

function isInListItem(editor: Editor) {
  return editor.isActive('listItem');
}

/**
 * Shift+Enter starts the next list item (WhatsApp / chat-style).
 * Enter on an empty item leaves the list so a passage can continue after it.
 */
const ListKeys = Extension.create({
  name: 'editorListKeys',
  priority: 1000,
  addKeyboardShortcuts() {
    const nextListItem = () => {
      if (isCurrentBlockEmpty(this.editor)) {
        return this.editor.commands.liftListItem('listItem');
      }
      return this.editor.commands.splitListItem('listItem');
    };

    return {
      // WhatsApp-style: Shift+Enter on a point starts the next point.
      // Outside a list it starts a new paragraph (not a <br> inside the same block).
      'Shift-Enter': () => {
        if (isInListItem(this.editor)) return nextListItem();
        return this.editor.commands.splitBlock();
      },
      Enter: () => {
        if (!isInListItem(this.editor)) return false;
        return nextListItem();
      },
    };
  },
});

function insertEmptyListAfter(editor: Editor, listName: 'bulletList' | 'orderedList') {
  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const { $from } = tr.selection;
      if ($from.depth === 0) return false;

      const listType = state.schema.nodes[listName];
      const listNode = listType?.createAndFill();
      if (!listNode) return false;

      const insertPos = $from.after($from.depth);
      tr.insert(insertPos, listNode);

      const joinPos = insertPos + listNode.nodeSize;
      if (joinPos <= tr.doc.content.size && canJoin(tr.doc, joinPos)) {
        tr.join(joinPos);
      }

      tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1), 1)).scrollIntoView();
      return true;
    })
    .run();
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  small = false,
}: RichTextEditorProps) {
  const [, setTick] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, ListKeys],
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: small ? 'rte-content rte-content--small' : 'rte-content',
        'data-placeholder': placeholder,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const bump = () => setTick((n) => n + 1);
    editor.on('selectionUpdate', bump);
    editor.on('transaction', bump);
    return () => {
      editor.off('selectionUpdate', bump);
      editor.off('transaction', bump);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const incoming = value || '';
    const current = editor.getHTML();
    const norm = current === '<p></p>' ? '' : current;
    if (norm !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const applyList = (listName: 'bulletList' | 'orderedList') => {
    // Already in a list → lift out or switch bullet ↔ numbered
    if (isInListItem(editor)) {
      editor.chain().focus().toggleList(listName, 'listItem').run();
      return;
    }

    const { empty } = editor.state.selection;
    const blockEmpty = isCurrentBlockEmpty(editor);

    // Empty line, or an explicit selection of blocks: wrap those blocks only
    if (blockEmpty || !empty) {
      editor.chain().focus().wrapInList(listName).run();
      return;
    }

    // Cursor in a passage with no selection: keep the passage and start a
    // fresh list underneath it, so clicking List never turns prose into item 1.
    insertEmptyListAfter(editor, listName);
  };

  const btn = (
    label: string,
    active: boolean,
    action: () => void,
    children: React.ReactNode,
  ) => (
    <button
      key={label}
      type="button"
      tabIndex={-1}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`rte-toolbar-btn${active ? ' rte-toolbar-btn--active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
    >
      {children}
    </button>
  );

  return (
    <div className={`rte-wrapper${small ? ' rte-wrapper--small' : ''}`}>
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        {btn(
          'Bold (Ctrl+B)',
          editor.isActive('bold'),
          () => editor.chain().focus().toggleBold().run(),
          <strong>B</strong>,
        )}
        {btn(
          'Italic (Ctrl+I)',
          editor.isActive('italic'),
          () => editor.chain().focus().toggleItalic().run(),
          <em>I</em>,
        )}

        <div className="rte-divider" />

        {btn(
          'Bullet list',
          editor.isActive('bulletList'),
          () => applyList('bulletList'),
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="2" cy="3.5" r="1.4" />
            <rect x="5.5" y="2.5" width="9.5" height="2" rx="1" />
            <circle cx="2" cy="8" r="1.4" />
            <rect x="5.5" y="7" width="9.5" height="2" rx="1" />
            <circle cx="2" cy="12.5" r="1.4" />
            <rect x="5.5" y="11.5" width="9.5" height="2" rx="1" />
          </svg>,
        )}
        {btn(
          'Numbered list',
          editor.isActive('orderedList'),
          () => applyList('orderedList'),
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <text x="0.5" y="5" fontSize="5.5" fontFamily="monospace" fontWeight="bold">1.</text>
            <rect x="5.5" y="2.5" width="9.5" height="2" rx="1" />
            <text x="0.5" y="9.5" fontSize="5.5" fontFamily="monospace" fontWeight="bold">2.</text>
            <rect x="5.5" y="7" width="9.5" height="2" rx="1" />
            <text x="0.5" y="14" fontSize="5.5" fontFamily="monospace" fontWeight="bold">3.</text>
            <rect x="5.5" y="11.5" width="9.5" height="2" rx="1" />
          </svg>,
        )}
      </div>

      <EditorContent editor={editor} />

      <style>{`
        .rte-wrapper {
          width: 100%;
          background: var(--bg-page);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .rte-wrapper:focus-within { border-color: var(--text-primary); }
        .rte-wrapper--small {
          background: var(--bg-surface);
          border-radius: 8px;
        }
        .rte-toolbar {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 5px 8px;
          border-bottom: 1px solid var(--border);
        }
        .rte-toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 13px;
          transition: background 0.12s, color 0.12s;
          user-select: none;
        }
        .rte-toolbar-btn:hover {
          background: var(--bg-elevated, rgba(128,128,128,0.15));
          color: var(--text-primary);
        }
        .rte-toolbar-btn--active {
          background: var(--bg-elevated, rgba(128,128,128,0.2));
          color: var(--text-primary);
        }
        .rte-divider {
          width: 1px;
          height: 18px;
          background: var(--border);
          margin: 0 4px;
          flex-shrink: 0;
        }
        .rte-content {
          display: block;
          padding: 12px 16px;
          min-height: 100px;
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.65;
          outline: none;
          word-break: break-word;
          cursor: text;
        }
        .rte-content--small {
          padding: 8px 12px;
          min-height: 60px;
          font-size: 13px;
        }
        .rte-content.ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--text-tertiary, #777);
          pointer-events: none;
          float: left;
          height: 0;
        }
        .rte-content p   { margin: 0; }
        .rte-content p + p { margin-top: 0.4em; }
        .rte-content strong { font-weight: 700; }
        .rte-content em     { font-style: italic; }
        .rte-content ul,
        .rte-content ol {
          padding-left: 1.4em;
          margin: 0.35em 0;
        }
        .rte-content ul { list-style: disc; }
        .rte-content ol { list-style: decimal; }
        .rte-content li { margin: 0.15em 0; }
        .rte-content li p { margin: 0; }
        .rte-content li + li { margin-top: 0.2em; }
      `}</style>
    </div>
  );
}
