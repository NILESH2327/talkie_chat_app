import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm animate-bounce">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>

            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-4 ring-gray-50" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to <span className="text-blue-600">Talkie</span>
        </h2>

        <p className="mt-3 text-gray-500">
          Select a conversation from the sidebar to start chatting.
        </p>

        {/* Tip Card */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            💡 Tip: Turn on <span className="font-medium">“Show online”</span> to quickly find active users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;