'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'

interface FormData {
  reason: string
  amount: string
  familyIncome: string
  description: string
  documents: File[]
}

export default function NewApplicationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    reason: '',
    amount: '',
    familyIncome: '',
    description: '',
    documents: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    
    try {
      const token = localStorage.getItem('accessToken')
      
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: formData.reason,
          requestedAmount: parseFloat(formData.amount),
          familyIncome: parseFloat(formData.familyIncome),
          description: formData.description,
        }),
      })

      if (!res.ok) throw new Error('Ошибка создания заявки')

      const data = await res.json()
      
      // Upload documents if any
      if (formData.documents.length > 0) {
        const formDataUpload = new FormData()
        formData.documents.forEach((file) => {
          formDataUpload.append('documents', file)
        })
        
        await fetch(`/api/applications/${data.id}/documents`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        })
      }

      router.push('/student/dashboard')
    } catch (error) {
      alert('Ошибка при создании заявки')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        documents: Array.from(e.target.files),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Новая заявка на материальную помощь</CardTitle>
            <CardDescription>
              Шаг {step} из 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full mx-1 ${
                      s <= step ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Основная информация</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Причина обращения *
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Выберите причину</option>
                      <option value="LOW_INCOME">Низкий доход семьи</option>
                      <option value="MEDICAL">Медицинские расходы</option>
                      <option value="EMERGENCY">Чрезвычайная ситуация</option>
                      <option value="ORPHAN">Сирота</option>
                      <option value="DISABILITY">Инвалидность</option>
                      <option value="LARGE_FAMILY">Многодетная семья</option>
                      <option value="SINGLE_PARENT">Неполная семья</option>
                      <option value="ACADEMIC_EXCELLENCE">Академические успехи</option>
                      <option value="OTHER">Другое</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Запрашиваемая сумма (₽) *
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Доход семьи на человека (₽/мес) *
                    </label>
                    <input
                      type="number"
                      value={formData.familyIncome}
                      onChange={(e) =>
                        setFormData({ ...formData, familyIncome: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      min="0"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Описание ситуации</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Подробное описание *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
                      required
                      placeholder="Опишите вашу ситуацию, почему вам необходима материальная помощь..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Документы</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Прикрепите подтверждающие документы
                    </label>
                    <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-primary hover:underline"
                      >
                        Выбрать файлы
                      </label>
                      <p className="text-sm text-muted-foreground mt-2">
                        PDF, JPG, PNG до 10MB
                      </p>
                    </div>
                    {formData.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.documents.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                          >
                            <span className="text-sm">{file.name}</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Проверьте данные перед отправкой:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Причина: {formData.reason}</li>
                      <li>• Сумма: {parseFloat(formData.amount).toLocaleString('ru-RU')} ₽</li>
                      <li>• Доход: {parseFloat(formData.familyIncome).toLocaleString('ru-RU')} ₽/мес</li>
                      <li>• Документов: {formData.documents.length}</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={loading}
                  >
                    Назад
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Отправка...' : step === 3 ? 'Отправить заявку' : 'Далее'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
