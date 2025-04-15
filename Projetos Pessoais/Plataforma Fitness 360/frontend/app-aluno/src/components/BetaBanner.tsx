import React from 'react';
import { AlertTriangle } from 'lucide-react';

const BetaBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-8 shadow-md">
      <div className="flex items-center">
        <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1">Ambiente Beta</h2>
          <p className="text-sm md:text-base opacity-90">
            Você está acessando recursos em fase de testes. Algumas funcionalidades podem 
            apresentar instabilidades. Seu feedback é muito importante para nós!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner; 