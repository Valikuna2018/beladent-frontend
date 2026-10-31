import React, { useEffect, useMemo, useRef } from 'react';
import { Bold, Link as LinkIcon, Unlink } from 'lucide-react';

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'A', 'FONT', 'SPAN', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI']);
const COMMON_EMOJIS = ['🦷', '😊', '✨', '🤍', '💛', '📍', '📞', '✅', '⭐', '❤️', '👨‍⚕️', '👩‍⚕️'];

export function sanitizeRichText(value: string): string {
  if (!value || typeof document === 'undefined') return value || '';
  const parsed = new DOMParser().parseFromString(`<div>${value}</div>`, 'text/html');
  const root = parsed.body.firstElementChild;
  if (!root) return '';

  const clean = (node: Element) => {
    Array.from(node.children).forEach((child) => {
      clean(child);
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        return;
      }
      Array.from(child.attributes).forEach((attribute) => child.removeAttribute(attribute.name));
      if (child.tagName === 'A') {
        const original = node.querySelector(`a`) === child ? child : child;
        void original;
      }
    });

    Array.from(node.querySelectorAll('a')).forEach((link) => {
      const source = parsed.createElement('span');
      source.innerHTML = link.outerHTML;
      const rawHref = source.firstElementChild?.getAttribute('href') || '';
      if (/^(https?:\/\/|mailto:|tel:)/i.test(rawHref)) {
        link.setAttribute('href', rawHref);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      } else {
        link.removeAttribute('href');
      }
    });
  };

  // Keep safe attributes before removing all others.
  const links = Array.from(root.querySelectorAll('a')).map((link) => [link, link.getAttribute('href') || ''] as const);
  const fonts = Array.from(root.querySelectorAll('font')).map((font) => [
    font,
    font.getAttribute('size') || '',
    font.style.fontSize || ''
  ] as const);
  const sizedSpans = Array.from(root.querySelectorAll('span')).map((span) => [
    span,
    span.style.fontSize || ''
  ] as const);
  clean(root);
  links.forEach(([link, href]) => {
    if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
      link.setAttribute('href', href);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  fonts.forEach(([font, size, fontSize]) => {
    if (/^(1[0-9]|2[0-9]|3[0-9]|4[0-8])px$/.test(fontSize)) font.style.fontSize = fontSize;
    else font.setAttribute('size', /^[1-7]$/.test(size) ? size : '3');
  });
  sizedSpans.forEach(([span, fontSize]) => {
    if (/^(1[0-9]|2[0-9]|3[0-9]|4[0-8])px$/.test(fontSize)) span.style.fontSize = fontSize;
  });
  return root.innerHTML;
}

export function richTextToPlainText(value: string): string {
  if (!value || typeof document === 'undefined') return value || '';
  const element = document.createElement('div');
  element.innerHTML = sanitizeRichText(value);
  return (element.textContent || '').replace(/\s+/g, ' ').trim();
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

export const RichTextEditor: React.FC<EditorProps> = ({ value, onChange, minHeight = 220 }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor) return null;
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return null;

    let range = selectionRef.current?.cloneRange() || null;
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  };

  const commitEditor = () => {
    onChange(editorRef.current?.innerHTML || '');
    saveSelection();
  };

  const command = (name: string, argument?: string) => {
    restoreSelection();
    document.execCommand(name, false, argument);
    commitEditor();
  };

  const addLink = () => {
    const url = window.prompt('Enter link (https://...)');
    if (!url) return;
    const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
    command('createLink', normalized);
  };

  const applyFontSize = (pixels: string) => {
    const range = restoreSelection();
    const selection = window.getSelection();
    if (!range || !selection) return;

    const wrapper = document.createElement('span');
    wrapper.style.fontSize = `${pixels}px`;

    if (range.collapsed) {
      const marker = document.createTextNode('\u200B');
      wrapper.appendChild(marker);
      range.insertNode(wrapper);
      range.setStart(marker, marker.length);
      range.collapse(true);
    } else {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
      range.selectNodeContents(wrapper);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
    commitEditor();
  };

  const insertEmoji = (emoji: string) => {
    const range = restoreSelection();
    const selection = window.getSelection();
    if (!range || !selection) return;
    range.deleteContents();
    const node = document.createTextNode(emoji);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
    commitEditor();
  };

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" aria-label="Text formatting">
        <button type="button" title="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => command('bold')}><Bold size={17} /></button>
        <select
          aria-label="Text size"
          defaultValue=""
          onMouseDown={saveSelection}
          onChange={(e) => {
            if (e.target.value) applyFontSize(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>Text size</option>
          <option value="12">12 px</option>
          <option value="14">14 px</option>
          <option value="16">16 px</option>
          <option value="18">18 px</option>
          <option value="20">20 px</option>
          <option value="24">24 px</option>
          <option value="28">28 px</option>
          <option value="32">32 px</option>
          <option value="36">36 px</option>
          <option value="40">40 px</option>
        </select>
        <button type="button" title="Add link" onMouseDown={(e) => e.preventDefault()} onClick={addLink}><LinkIcon size={17} /></button>
        <button type="button" title="Remove link" onMouseDown={(e) => e.preventDefault()} onClick={() => command('unlink')}><Unlink size={17} /></button>
        <span className="rich-toolbar-divider" aria-hidden="true" />
        <div className="rich-emoji-list" aria-label="Frequently used emojis">
          {COMMON_EMOJIS.map((emoji) => (
            <button key={emoji} type="button" title={`Insert ${emoji}`} onMouseDown={(e) => e.preventDefault()} onClick={() => insertEmoji(emoji)}>{emoji}</button>
          ))}
        </div>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-area"
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={saveSelection}
      />
      <style>{`
        .rich-editor{width:100%;border:1px solid var(--input-border,rgba(148,163,184,.28));border-radius:14px;overflow:hidden;background:var(--input-bg,rgba(15,23,42,.35))}
        .rich-toolbar{display:flex;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid var(--input-border,rgba(148,163,184,.28));background:rgba(148,163,184,.08);overflow-x:auto;white-space:nowrap}
        .rich-toolbar button,.rich-toolbar select{height:40px;border:1px solid rgba(148,163,184,.3);border-radius:8px;background:rgba(255,255,255,.06);color:inherit;padding:0 13px;cursor:pointer;font-size:15px}
        .rich-toolbar button{display:grid;place-items:center}.rich-toolbar button:hover{background:rgba(169,139,47,.18)}
        .rich-toolbar-divider{width:1px;height:28px;background:var(--input-border);flex:0 0 auto}
        .rich-emoji-list{display:flex;align-items:center;gap:6px}.rich-emoji-list button{min-width:40px;padding:0 9px;font-size:18px}
        .rich-editor-area{padding:18px 20px;outline:none;line-height:1.7;color:inherit;font-size:16px;overflow-x:auto}.rich-editor-area a{color:#22d3ee;text-decoration:underline}
      `}</style>
    </div>
  );
};

export const RichTextContent: React.FC<{ html?: string; className?: string }> = ({ html = '', className }) => {
  const safeHtml = useMemo(() => sanitizeRichText(html), [html]);
  const hasMarkup = /<\/?[a-z][\s\S]*>/i.test(html);
  if (!hasMarkup) return <div className={className} style={{ whiteSpace: 'pre-line' }}>{html}</div>;
  return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};
