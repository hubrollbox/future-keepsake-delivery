import { useState } from "react";
import ContentEditor from "./ContentEditor";
import Modal from "../../components/Modal";

const ManageContent = () => {
  const pages = [
    { title: "Como Funciona", initialContent: "<p>Conteúdo inicial para Como Funciona</p>" },
    { title: "Termos de Serviço", initialContent: "<p>Conteúdo inicial para Termos de Serviço</p>" },
    { title: "Políticas de Privacidade", initialContent: "<p>Conteúdo inicial para Políticas de Privacidade</p>" },
  ];

  const [faqs, setFaqs] = useState([
    { id: 1, question: "O que é o serviço?", answer: "É um serviço de entrega de lembranças futuras." },
    { id: 2, question: "Como funciona?", answer: "Você cria uma cápsula do tempo e nós entregamos no futuro." },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: null, question: "", answer: "" });

  const handleAddFaq = () => {
    setCurrentFaq({ id: null, question: "", answer: "" });
    setIsModalOpen(true);
  };

  const handleEditFaq = (id) => {
    const faqToEdit = faqs.find((faq) => faq.id === id);
    if (faqToEdit) {
      setCurrentFaq(faqToEdit);
      setIsModalOpen(true);
    }
  };

  const handleSaveFaq = () => {
    if (currentFaq.id) {
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq.id === currentFaq.id ? currentFaq : faq))
      );
    } else {
      setFaqs((prevFaqs) => [
        ...prevFaqs,
        { ...currentFaq, id: Date.now() },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteFaq = (id) => {
    // Lógica para excluir FAQ
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciamento de Conteúdo</h1>

      {/* Seção de Páginas */}
      {pages.map((page, index) => (
        <div key={index} className="mb-8">
          <ContentEditor title={page.title} initialContent={page.initialContent} />
        </div>
      ))}

      {/* Seção de FAQs */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">FAQs</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Pergunta</th>
              <th className="px-4 py-2 border-b">Resposta</th>
              <th className="px-4 py-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="px-4 py-2 border-b">{faq.question}</td>
                <td className="px-4 py-2 border-b">{faq.answer}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEditFaq(faq.id)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddFaq}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar FAQ
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentFaq.id ? "Editar FAQ" : "Adicionar FAQ"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pergunta</label>
            <input
              type="text"
              value={currentFaq.question}
              onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resposta</label>
            <textarea
              value={currentFaq.answer}
              onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveFaq}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageContent;
