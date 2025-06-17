import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const faqs = [
	{
		question: "Como agendo uma entrega?",
		answer: "Vá ao dashboard, clique em 'Criar Entrega' e siga os passos do formulário.",
	},
	{
		question: "Como sei que a entrega foi enviada?",
		answer: "Receberá uma notificação por email na data agendada. Pode acompanhar o estado no dashboard.",
	},
	{
		question: "Posso editar ou cancelar uma entrega?",
		answer: "Sim, no dashboard pode editar ou cancelar entregas agendadas que ainda não foram enviadas.",
	},
	{
		question: "Como funciona o pagamento?",
		answer: "Após criar a entrega, receberá um link para pagamento. Só após o pagamento a entrega será processada.",
	},
	{
		question: "Preciso de ajuda!",
		answer: "Contacte-nos através da página de contacto ou envie email para suporte@futurekeepsake.com.",
	},
];

export default function FAQ() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<Navigation />

			{/* Main Content */}
			<main className="flex-grow max-w-2xl mx-auto py-12 px-4">
				<Card>
					<CardHeader>
						<CardTitle>Ajuda e Perguntas Frequentes (FAQ)</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="mb-6">
							<input
								type="text"
								placeholder="Buscar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{filteredFaqs.map((faq, index) => (
							<div key={index}>
								<strong>{faq.question}</strong>
								<p>{faq.answer}</p>
							</div>
						))}
						{filteredFaqs.length === 0 && (
							<p className="text-gray-500">Nenhuma pergunta encontrada.</p>
						)}
					</CardContent>
				</Card>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
