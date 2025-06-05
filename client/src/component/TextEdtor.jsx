// QuillEditor.jsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the snow theme

export default function QuillEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image','video'],
            ['clean'],
          ],
        },
      });

      quillRef.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        onChange(html);
      });
    }

    // Set content if value changes
    if (quillRef.current && value !== undefined) {
      const editor = quillRef.current;
      const currentContent = editor.root.innerHTML;
      if (value !== currentContent) {
        editor.root.innerHTML = value;
      }
    }
  }, [value, onChange]);

  return <div ref={editorRef} />;
}
