'use client';

const AuthFormWrapper = ({ children, title }: any) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300">

      <div className="bg-white w-[400px] p-8 rounded-2xl shadow-2xl">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
};

export default AuthFormWrapper;