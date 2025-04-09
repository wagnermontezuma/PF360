'use client';

import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export function DashboardCard({ 
  title, 
  value, 
  unit = '', 
  icon, 
  isLoading = false,
  status = 'info' 
}: DashboardCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-accent';
      case 'error':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };
  
  const statusColor = getStatusColor(status);

  if (isLoading) {
    return (
      <div className="bg-[#1C1C1C] rounded-2xl p-6 shadow-md border border-[#2A2A2A] h-36 flex flex-col justify-between">
        <div className="h-6 bg-gray-700 rounded animate-pulse w-2/3"></div>
        <div className="h-8 bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6 shadow-md border border-[#2A2A2A] transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-light text-sm font-medium">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-end">
        <span className={`text-2xl md:text-3xl font-bold font-display ${statusColor}`}>
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </span>
        {unit && <span className="text-gray-light text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );
} 