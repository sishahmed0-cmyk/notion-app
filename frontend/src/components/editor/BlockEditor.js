import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiMoreHorizontal, FiCode, FiImage } from 'react-icons/fi';
import './BlockEditor.css';

const BLOCK_TYPES = [
  { type: 'text', label: 'Text', icon: '📝', desc: 'Plain text' },
  { type: 'heading1', label: 'Heading 1', icon: 'H1', desc: 'Large heading' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2', desc: 'Medium heading' },
  { type: 'heading3', label: 'Heading 3', icon: 'H3', desc: 'Small heading' },
  { type: 'bullet', label: 'Bullet List', icon: '•', desc: 'Bullet list item' },
  { type: 'numbered', label: 'Numbered', icon: '1.', desc: 'Numbered list' },
  { type: 'todo', label: 'To-do', icon: '☐', desc: 'Checkbox item' },
  { type: 'quote', label: 'Quote', icon: '"', desc: 'Blockquote' },
  { type: 'code', label: 'Code', icon: '</>', desc: 'Code block' },
  { type: 'divider', label: 'Divider', icon: '—', desc: 'Horizontal rule' },
  { type: 'callout', label: 'Callout', icon: '💡', desc: 'Callout box' },
];

const Block = ({ block, index, onChange, onDelete, onAdd, onKeyDown }) => {
  const ref = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const handleInput = (e) => {
    onChange(block._id, { content: e.target.innerText });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAdd(index + 1);
    } else if (e.key === 'Backspace' && ref.current?.innerText === '') {
      e.preventDefault();
      onDelete(block._id, index);
    } else if (e.key === '/') {
      setShowTypeMenu(true);
    }
    onKeyDown?.(e, block._id);
  };

  const selectType = (type) => {
    onChange(block._id, { type });
    setShowTypeMenu(false);
    ref.current?.focus();
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <h1
            ref={ref}
            className="block-h1"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Heading 1"
          >
            {block.content}
          </h1>
        );
      case 'heading2':
        return (
          <h2
            ref={ref}
            className="block-h2"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Heading 2"
          >
            {block.content}
          </h2>
        );
      case 'heading3':
        return (
          <h3
            ref={ref}
            className="block-h3"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Heading 3"
          >
            {block.content}
          </h3>
        );
      case 'bullet':
        return (
          <div className="block-bullet">
            <span className="bullet-dot">•</span>
            <div
              ref={ref}
              className="block-content"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="List item"
            >
              {block.content}
            </div>
          </div>
        );
      case 'numbered':
        return (
          <div className="block-numbered">
            <span className="number-label">{index + 1}.</span>
            <div
              ref={ref}
              className="block-content"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="List item"
            >
              {block.content}
            </div>
          </div>
        );
      case 'todo':
        return (
          <div className="block-todo">
            <input
              type="checkbox"
              checked={block.checked || false}
              onChange={(e) => onChange(block._id, { checked: e.target.checked })}
              className="todo-checkbox"
            />
            <div
              ref={ref}
              className={`block-content ${block.checked ? 'checked' : ''}`}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="To-do"
            >
              {block.content}
            </div>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="block-quote">
            <div
              ref={ref}
              className="block-content"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="Quote..."
            >
              {block.content}
            </div>
          </blockquote>
        );
      case 'code':
        return (
          <div className="block-code-wrapper">
            <div className="code-lang">{block.language || 'javascript'}</div>
            <pre className="block-code">
              <code
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                data-placeholder="// Write code here..."
                spellCheck={false}
              >
                {block.content}
              </code>
            </pre>
          </div>
        );
      case 'divider':
        return <hr className="block-divider" />;
      case 'callout':
        return (
          <div className="block-callout">
            <span className="callout-icon">💡</span>
            <div
              ref={ref}
              className="block-content"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              data-placeholder="Callout text..."
            >
              {block.content}
            </div>
          </div>
        );
      default:
        return (
          <div
            ref={ref}
            className="block-text"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Type '/' for commands..."
          >
            {block.content}
          </div>
        );
    }
  };

  return (
    <div className="block-wrapper group">
      <div className="block-actions">
        <button className="block-action-btn" onClick={() => onAdd(index)}>
          <FiPlus size={14} />
        </button>
        <button className="block-action-btn" onClick={() => setShowMenu(!showMenu)}>
          <FiMoreHorizontal size={14} />
        </button>
      </div>
      <div className="block-inner">
        {renderBlock()}
      </div>

      {showTypeMenu && (
        <div className="slash-menu animate-fade-in">
          <div className="slash-menu-header">Block type</div>
          {BLOCK_TYPES.map(bt => (
            <button
              key={bt.type}
              className="slash-menu-item"
              onClick={() => selectType(bt.type)}
            >
              <span className="slash-icon">{bt.icon}</span>
              <div>
                <div className="slash-label">{bt.label}</div>
                <div className="slash-desc">{bt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showMenu && (
        <div className="block-menu animate-fade-in">
          <button onClick={() => { onDelete(block._id, index); setShowMenu(false); }}>
            <FiTrash2 size={14} /> Delete block
          </button>
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} onClick={() => { selectType(bt.type); setShowMenu(false); }}>
              <span>{bt.icon}</span> {bt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BlockEditor = ({ blocks = [], onChange }) => {
  const [localBlocks, setLocalBlocks] = useState(
    blocks.length > 0 ? blocks : [{ _id: Date.now().toString(), type: 'text', content: '', order: 0 }]
  );

  useEffect(() => {
    if (blocks.length > 0) setLocalBlocks(blocks);
  }, [blocks]);

  const handleChange = useCallback((id, updates) => {
    const updated = localBlocks.map(b => b._id === id ? { ...b, ...updates } : b);
    setLocalBlocks(updated);
    onChange?.(updated);
  }, [localBlocks, onChange]);

  const handleAdd = useCallback((atIndex) => {
    const newBlock = {
      _id: Date.now().toString(),
      type: 'text',
      content: '',
      order: atIndex,
    };
    const updated = [
      ...localBlocks.slice(0, atIndex),
      newBlock,
      ...localBlocks.slice(atIndex),
    ].map((b, i) => ({ ...b, order: i }));
    setLocalBlocks(updated);
    onChange?.(updated);
  }, [localBlocks, onChange]);

  const handleDelete = useCallback((id, index) => {
    if (localBlocks.length <= 1) return;
    const updated = localBlocks.filter(b => b._id !== id).map((b, i) => ({ ...b, order: i }));
    setLocalBlocks(updated);
    onChange?.(updated);
  }, [localBlocks, onChange]);

  return (
    <div className="block-editor">
      {localBlocks.map((block, index) => (
        <Block
          key={block._id}
          block={block}
          index={index}
          onChange={handleChange}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      ))}
      <div
        className="editor-empty-space"
        onClick={() => handleAdd(localBlocks.length)}
      />
    </div>
  );
};

export default BlockEditor;
