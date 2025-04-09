'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  children: ReactNode;
  primary?: boolean;
}

const Button = ({ href, children, primary = false }: ButtonProps) => (
  <Link href={href}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        px-8 py-3 rounded-lg text-lg font-medium
        transition-colors duration-300 ease-in-out
        ${primary 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
        }
        w-full sm:w-auto
      `}
    >
      {children}
    </motion.button>
  </Link>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center space-y-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-blue-500"
        >
          FITNESS 360°
        </motion.div>

        {/* Título de Boas-vindas */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl text-center font-light"
        >
          Bem-vindo à sua plataforma de treinos Fitness 360
        </motion.h1>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button href="/login" primary>
            Entrar
          </Button>
          <Button href="/dashboard">
            Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
