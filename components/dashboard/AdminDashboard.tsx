'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, calculatePercentage, getStatusLabel } from '@/lib/utils';

// Mock data
const mockStats = {
  totalApplications: 1234,
  pendingReview: 234,
  approved: 890,
  totalPaid: 45_600_000,
  avgReviewTime: 5.2, // days
  approvalRate: 72,
  trends: {
    applications: 12.5,
    approved: 8.3,
    avgTime: -15.2,
  },
};

const monthlyData = [
  { month: 'Янв', applications: 85, approved: 62, paid: 3_100_000 },
  { month: 'Фев', applications: 92, approved: 68, paid: 3_400_000 },
  { month: 'Мар', applications: 78, approved: 56, paid: 2_800_000 },
  { month: 'Апр', applications: 105, approved: 78, paid: 3_900_000 },
  { month: 'Май', applications: 118, approved: 85, paid: 4_250_000 },
  { month: 'Июн', applications: 134, approved: 95, paid: 4_750_000 },
];

const reasonDistribution = [
  { name: 'Низкий доход', value: 420, color: '#3b82f6' },
  { name: 'Медицинские', value: 280, color: '#6366f1' },
  { name: 'ЧС', value: 180, color: '#f59e0b' },
  { name: 'Сирота', value: 145, color: '#10b981' },
  { name: 'Инвалидность', value: 120, color: '#ef4444' },
  { name: 'Другое', value: 89, color: '#8b5cf6' },
];

const facultyStats = [
  { faculty: 'Инженерный', count: 245, amount: 12_250_000 },
  { faculty: 'Медицинский', count: 198, amount: 9_900_000 },
  { faculty: 'Юридический', count: 176, amount: 8_800_000 },
  { faculty: 'Экономический', count: 165, amount: 8_250_000 },
  { faculty: 'Гуманитарный', count: 142, amount: 7_100_000 },
];

const recentApplications = [
  {
    id: '1',
    studentName: 'Иванов Иван Иванович',
    faculty: 'Инженерный',
    amount: 15000,
    status: 'SUBMITTED',
    submittedAt: '2 часа назад',
  },
  {
    id: '2',
    studentName: 'Петрова Мария Сергеевна',
    faculty: 'Медицинский',
    amount: 20000,
    status: 'UNDER_REVIEW',
    submittedAt: '4 часа назад',
  },
  {
    id: '3',
    studentName: 'Сидоров Петр Александрович',
    faculty: 'Экономический',
    amount: 18000,
    status: 'SUBMITTED',
    submittedAt: '6 часов назад',
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {title}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {value}
              </p>
              {trend && (
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    trend.positive ? 'text-success-600' : 'text-error-600'
                  }`}
                >
                  {trend.positive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-neutral-500">{description}</p>
            )}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md text-neutral-900 dark:text-neutral-100">
            Аналитический дашборд
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Обзор всех заявок и статистики
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Фильтры
          </Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего заявок"
          value={mockStats.totalApplications.toLocaleString()}
          icon={<FileText className="h-7 w-7 text-primary-600" />}
          trend={{ value: mockStats.trends.applications, positive: true }}
        />
        <StatCard
          title="На рассмотрении"
          value={mockStats.pendingReview}
          icon={<Clock className="h-7 w-7 text-warning-600" />}
          description="Требуют внимания"
        />
        <StatCard
          title="Одобрено"
          value={mockStats.approved}
          icon={<Users className="h-7 w-7 text-success-600" />}
          trend={{ value: mockStats.trends.approved, positive: true }}
        />
        <StatCard
          title="Выплачено"
          value={formatCurrency(mockStats.totalPaid)}
          icon={<DollarSign className="h-7 w-7 text-success-600" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Среднее время рассмотрения
                </p>
                <p className="mt-2 text-2xl font-bold text-neutral-900">
                  {mockStats.avgReviewTime} дней
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-success-600">
                <TrendingDown className="h-4 w-4" />
                {Math.abs(mockStats.trends.avgTime)}%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Процент одобрения
              </p>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-2xl font-bold text-neutral-900">
                  {mockStats.approvalRate}%
                </p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-success-600"
                    style={{ width: `${mockStats.approvalRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-600">
              Средняя сумма
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {formatCurrency(Math.round(mockStats.totalPaid / mockStats.approved))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart - Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Динамика по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Заявки"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Одобрено"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Reason Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по основаниям</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reasonDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reasonDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика по факультетам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facultyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="faculty" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Количество заявок" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние заявки</CardTitle>
          <Button variant="ghost" size="sm">
            Смотреть все →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Студент
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Факультет
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Сумма
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Статус
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Подана
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="py-4 text-sm font-medium text-neutral-900">
                      {app.studentName}
                    </td>
                    <td className="py-4 text-sm text-neutral-600">{app.faculty}</td>
                    <td className="py-4 text-sm font-semibold text-neutral-900">
                      {formatCurrency(app.amount)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          app.status === 'SUBMITTED'
                            ? 'bg-info-100 text-info-700'
                            : 'bg-warning-100 text-warning-700'
                        }`}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-neutral-600">
                      {app.submittedAt}
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm">
                        Рассмотреть
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
