import { MessageCircle } from 'lucide-react';

const FloatingChatButton = () => {
  return (
    <button className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 z-50">
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default FloatingChatButton;
