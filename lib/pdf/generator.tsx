// lib/pdf/generator.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Times-Roman',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
    paddingBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
  },
});

interface ApplicationFormData {
  // Personal info
  lastName: string;
  firstName: string;
  middleName?: string;
  studentId: string;
  faculty: string;
  department: string;
  course: number;
  group?: string;
  
  // Contact
  phone?: string;
  email: string;
  
  // Application details
  reason: string;
  amount: number;
  description: string;
  
  // Family info (if applicable)
  familyMembers?: number;
  familyIncome?: number;
  
  // Metadata
  applicationNumber: string;
  submittedAt: Date;
}

export function ApplicationPDF({ data }: { data: ApplicationFormData }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            ЗАЯВЛЕНИЕ
          </Text>
          <Text style={styles.subtitle}>
            на оказание материальной помощи
          </Text>
          <Text style={styles.subtitle}>
            № {data.applicationNumber}
          </Text>
        </View>

        {/* Recipient */}
        <View style={styles.section}>
          <Text>Ректору ФГБОУ ВО «Название Университета»</Text>
          <Text>от студента {data.course} курса</Text>
          <Text>
            факультета {data.faculty}
          </Text>
          <Text>
            кафедры {data.department}
          </Text>
          <Text>
            {data.lastName} {data.firstName} {data.middleName || ''}
          </Text>
          <Text>Студенческий билет: {data.studentId}</Text>
          {data.group && <Text>Группа: {data.group}</Text>}
        </View>

        {/* Body */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 10 }}>
            Прошу оказать мне материальную помощь в размере{' '}
            {formatCurrency(data.amount)} в связи с:
          </Text>
          <Text style={{ marginBottom: 10 }}>
            Основание: {data.reason}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            Обоснование:
          </Text>
          <Text style={{ marginLeft: 20, marginBottom: 10 }}>
            {data.description}
          </Text>
        </View>

        {/* Additional info */}
        {(data.familyMembers || data.familyIncome) && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              Дополнительная информация:
            </Text>
            {data.familyMembers && (
              <View style={styles.row}>
                <Text style={styles.label}>Состав семьи:</Text>
                <Text style={styles.value}>{data.familyMembers} человек(а)</Text>
              </View>
            )}
            {data.familyIncome && (
              <View style={styles.row}>
                <Text style={styles.label}>Доход семьи:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.familyIncome)} в месяц
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Contact info */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
            Контактная информация:
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{data.email}</Text>
          </View>
          {data.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Телефон:</Text>
              <Text style={styles.value}>{data.phone}</Text>
            </View>
          )}
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
            Прилагаемые документы:
          </Text>
          <Text>1. Копия паспорта</Text>
          <Text>2. Справка о доходах</Text>
          <Text>3. Другие подтверждающие документы</Text>
        </View>

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text style={{ marginBottom: 5 }}>Дата: {formatDate(data.submittedAt)}</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={{ marginBottom: 5 }}>Подпись студента:</Text>
            <View style={styles.signatureLine}>
              <Text style={{ paddingTop: 15 }}>
                {data.firstName.charAt(0)}. {data.lastName}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Документ создан автоматически системой управления материальной помощью
          </Text>
          <Text>
            Дата и время создания: {new Date().toLocaleString('ru-RU')}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Generate PDF blob from application data
 */
export async function generateApplicationPDF(
  data: ApplicationFormData
): Promise<Blob> {
  const { pdf } = await import('@react-pdf/renderer');
  return pdf(<ApplicationPDF data={data} />).toBlob();
}

/**
 * Generate PDF buffer (for server-side)
 */
export async function generateApplicationPDFBuffer(
  data: ApplicationFormData
): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  return renderToBuffer(<ApplicationPDF data={data} />);
}

/**
 * Example usage in API route:
 * 
 * import { generateApplicationPDFBuffer } from '@/lib/pdf/generator';
 * import { uploadToS3 } from '@/lib/storage/s3';
 * 
 * export async function POST(request: NextRequest) {
 *   const data = await request.json();
 *   
 *   // Generate PDF
 *   const pdfBuffer = await generateApplicationPDFBuffer(data);
 *   
 *   // Upload to S3
 *   const url = await uploadToS3(
 *     pdfBuffer,
 *     `applications/${data.applicationNumber}.pdf`,
 *     'application/pdf'
 *   );
 *   
 *   return NextResponse.json({ pdfUrl: url });
 * }
 */
