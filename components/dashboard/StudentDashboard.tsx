'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';

// Mock data - в реальном приложении будет из API
const mockStats = {
  total: 3,
  active: 1,
  approved: 2,
  totalPaid: 45000,
};

const mockApplications = [
  {
    id: '1',
    applicationNumber: '2024-001',
    status: 'UNDER_REVIEW',
    amount: 15000,
    submittedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    applicationNumber: '2024-002',
    status: 'APPROVED',
    amount: 20000,
    submittedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    applicationNumber: '2023-045',
    status: 'COMPLETED',
    amount: 25000,
    submittedAt: new Date('2023-12-05'),
  },
];

const mockNews = [
  {
    id: '1',
    title: 'Открыт прием заявок на материальную помощь',
    date: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Изменения в порядке подачи документов',
    date: new Date('2024-01-15'),
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
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
                  <TrendingUp
                    className={`h-4 w-4 ${!trend.positive && 'rotate-180'}`}
                  />
                  {trend.value}
                </span>
              )}
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ApplicationRowProps {
  application: typeof mockApplications[0];
}

function ApplicationRow({ application }: ApplicationRowProps) {
  const statusColor = {
    DRAFT: 'bg-neutral-100 text-neutral-700',
    SUBMITTED: 'bg-info-100 text-info-700',
    UNDER_REVIEW: 'bg-warning-100 text-warning-700',
    APPROVED: 'bg-success-100 text-success-700',
    REJECTED: 'bg-error-100 text-error-700',
    COMPLETED: 'bg-primary-100 text-primary-700',
  }[application.status];

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            № {application.applicationNumber}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(application.submittedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {formatCurrency(application.amount)}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {getStatusLabel(application.status)}
          </span>
        </div>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Подробнее</span>
          →
        </Button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md text-neutral-900 dark:text-neutral-100">
            Добро пожаловать, Иван!
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Здесь вы можете управлять своими заявками на материальную помощь
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего заявок"
          value={mockStats.total}
          icon={<FileText className="h-6 w-6 text-primary-600" />}
        />
        <StatCard
          title="Активных"
          value={mockStats.active}
          icon={<Clock className="h-6 w-6 text-warning-600" />}
        />
        <StatCard
          title="Одобрено"
          value={mockStats.approved}
          icon={<CheckCircle2 className="h-6 w-6 text-success-600" />}
        />
        <StatCard
          title="Выплачено"
          value={formatCurrency(mockStats.totalPaid)}
          icon={<TrendingUp className="h-6 w-6 text-success-600" />}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button className="h-auto flex-col gap-2 py-6" variant="outline">
              <Plus className="h-6 w-6" />
              <div>
                <p className="font-semibold">Подать заявку</p>
                <p className="text-xs text-neutral-600">
                  Создать новую заявку на помощь
                </p>
              </div>
            </Button>
            <Button className="h-auto flex-col gap-2 py-6" variant="outline">
              <FileText className="h-6 w-6" />
              <div>
                <p className="font-semibold">Мои заявки</p>
                <p className="text-xs text-neutral-600">
                  Просмотреть все заявки
                </p>
              </div>
            </Button>
            <Button className="h-auto flex-col gap-2 py-6" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <div>
                <p className="font-semibold">Чат с поддержкой</p>
                <p className="text-xs text-neutral-600">
                  Задать вопрос специалисту
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние заявки</CardTitle>
          <Button variant="ghost" size="sm">
            Смотреть все →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockApplications.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Новости</CardTitle>
          <Button variant="ghost" size="sm">
            Смотреть все →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNews.map((newsItem) => (
              <div
                key={newsItem.id}
                className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="flex h-2 w-2 mt-2 rounded-full bg-primary-600"></div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {newsItem.title}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(newsItem.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
