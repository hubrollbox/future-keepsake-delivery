import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ContentEditor = ({ title, initialContent }: { title: string; initialContent: string }) => {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    alert(`Conteúdo salvo: ${content}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      <ReactQuill theme="snow" value={content} onChange={setContent} className="mb-4" />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
};

export default ContentEditor;
