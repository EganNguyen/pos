// ErrorPage.tsx
import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Xin lỗi quý khách!</h1>
        <p className="text-gray-700 mb-2">
          Chúng tôi không thể xác định bàn của bạn.
        </p>
        <p className="text-gray-600 mb-6">
          Vui lòng quét lại mã QR tại bàn để đặt món.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
