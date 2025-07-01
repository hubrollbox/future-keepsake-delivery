
import { useState } from "react";

const ContentEditor = ({ title, initialContent }: { title: string; initialContent: string }) => {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    alert(`Conteúdo salvo: ${content}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-4 border border-gray-300 rounded-md resize-none"
        placeholder="Digite o conteúdo aqui..."
      />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
};

export default ContentEditor;
