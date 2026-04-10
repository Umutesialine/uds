import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = "255712345678";
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=Hello! I'm interested in your dressmaking services.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 group"
    >
      <FaWhatsapp size={28} />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-dark text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;