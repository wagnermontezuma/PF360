'use client';

import { AuthLayout } from '@/components/AuthLayout';
import { DashboardMetrics } from '@/components/DashboardMetrics';

export default function DashboardPage() {
  return (
    <AuthLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <DashboardMetrics />
      </div>
    </AuthLayout>
  );
} 