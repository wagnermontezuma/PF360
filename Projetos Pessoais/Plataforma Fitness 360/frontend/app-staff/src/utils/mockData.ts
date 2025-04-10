// Dados mockados para o painel de análise

// Tipos
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  lastActivity: string;
  progress: {
    weight: number[];
    bodyFat: number[];
    muscle: number[];
    dates: string[];
  };
}

export interface ProgressData {
  id: string;
  studentId: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
  notes: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisMonth: number;
  averageAttendance: number;
  studentsPerPlan: {
    basic: number;
    premium: number;
    vip: number;
  };
  completionRate: number;
  progressOverview: {
    weight: {
      average: number;
      change: number;
    };
    bodyFat: {
      average: number;
      change: number;
    };
    muscle: {
      average: number;
      change: number;
    };
  };
}

// Dados mockados
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    phone: '(11) 98765-4321',
    registrationDate: '2023-01-15',
    plan: 'Premium',
    status: 'active',
    lastActivity: '2023-10-05',
    progress: {
      weight: [82, 80, 78, 77, 76, 75],
      bodyFat: [18, 17, 16, 15.5, 15, 14.5],
      muscle: [65, 66, 67, 68, 69, 70],
      dates: [
        '2023-05-01',
        '2023-06-01',
        '2023-07-01',
        '2023-08-01',
        '2023-09-01',
        '2023-10-01',
      ],
    },
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria.souza@exemplo.com',
    phone: '(11) 91234-5678',
    registrationDate: '2023-02-20',
    plan: 'Basic',
    status: 'active',
    lastActivity: '2023-10-01',
    progress: {
      weight: [65, 64, 63, 62, 62, 61],
      bodyFat: [24, 23, 22, 21, 20, 20],
      muscle: [50, 51, 52, 53, 54, 54],
      dates: [
        '2023-05-01',
        '2023-06-01',
        '2023-07-01',
        '2023-08-01',
        '2023-09-01',
        '2023-10-01',
      ],
    },
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    phone: '(11) 99876-5432',
    registrationDate: '2023-03-10',
    plan: 'VIP',
    status: 'active',
    lastActivity: '2023-10-08',
    progress: {
      weight: [90, 88, 87, 85, 84, 83],
      bodyFat: [20, 19, 18, 17, 16, 15],
      muscle: [72, 73, 74, 75, 76, 78],
      dates: [
        '2023-05-01',
        '2023-06-01',
        '2023-07-01',
        '2023-08-01',
        '2023-09-01',
        '2023-10-01',
      ],
    },
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@exemplo.com',
    phone: '(11) 94567-8901',
    registrationDate: '2023-04-05',
    plan: 'Basic',
    status: 'inactive',
    lastActivity: '2023-09-10',
    progress: {
      weight: [58, 57, 57, 56, 56, 55],
      bodyFat: [22, 21, 21, 20, 20, 19],
      muscle: [48, 49, 49, 50, 50, 51],
      dates: [
        '2023-05-01',
        '2023-06-01',
        '2023-07-01',
        '2023-08-01',
        '2023-09-01',
        '2023-10-01',
      ],
    },
  },
  {
    id: '5',
    name: 'Lucas Costa',
    email: 'lucas.costa@exemplo.com',
    phone: '(11) 93456-7890',
    registrationDate: '2023-08-20',
    plan: 'Premium',
    status: 'active',
    lastActivity: '2023-10-07',
    progress: {
      weight: [78, 77, 75],
      bodyFat: [16, 15, 14],
      muscle: [68, 69, 70],
      dates: ['2023-08-01', '2023-09-01', '2023-10-01'],
    },
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalStudents: 120,
  activeStudents: 98,
  newStudentsThisMonth: 12,
  averageAttendance: 78,
  studentsPerPlan: {
    basic: 45,
    premium: 60,
    vip: 15,
  },
  completionRate: 82,
  progressOverview: {
    weight: {
      average: 74.5,
      change: -2.3,
    },
    bodyFat: {
      average: 18.2,
      change: -1.5,
    },
    muscle: {
      average: 64.8,
      change: 1.8,
    },
  },
};

export const mockProgressData: ProgressData[] = [
  {
    id: '1',
    studentId: '1',
    date: '2023-05-01',
    weight: 82,
    bodyFat: 18,
    muscle: 65,
    notes: 'Início do programa',
  },
  {
    id: '2',
    studentId: '1',
    date: '2023-06-01',
    weight: 80,
    bodyFat: 17,
    muscle: 66,
    notes: 'Progresso lento mas consistente',
  },
  {
    id: '3',
    studentId: '1',
    date: '2023-07-01',
    weight: 78,
    bodyFat: 16,
    muscle: 67,
    notes: 'Ajuste na dieta',
  },
  {
    id: '4',
    studentId: '1',
    date: '2023-08-01',
    weight: 77,
    bodyFat: 15.5,
    muscle: 68,
    notes: 'Aumento da intensidade dos treinos',
  },
  {
    id: '5',
    studentId: '1',
    date: '2023-09-01',
    weight: 76,
    bodyFat: 15,
    muscle: 69,
    notes: 'Resultados visíveis',
  },
  {
    id: '6',
    studentId: '1',
    date: '2023-10-01',
    weight: 75,
    bodyFat: 14.5,
    muscle: 70,
    notes: 'Mantendo progresso',
  },
]; 