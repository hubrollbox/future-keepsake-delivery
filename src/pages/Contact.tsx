import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SEOHead from "@/components/SEOHead";

const Contact = () => {


  return (
    <div className="min-h-screen bg-lavender-mist">
      <SEOHead 
        title="Contacto"
        description="Entra em contacto com a equipa Keepla. Estamos aqui para ajudar com as tuas questões sobre memórias, entregas e planos."
        keywords="contacto keepla, suporte, ajuda, falar connosco"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <ContactHero />

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ContactForm />
          <ContactInfo />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
