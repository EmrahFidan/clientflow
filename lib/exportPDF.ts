import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Project {
  id: string;
  name: string;
  status: string;
  deadline: Date;
  clientId: string;
}

interface Update {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  status?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export async function exportProjectPDF(
  project: Project,
  client: Client,
  updates: Update[]
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text('ClientFlow', 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Proje Raporu', 20, 30);

  // Project Info
  doc.setFontSize(12);
  doc.text(`Proje: ${project.name}`, 20, 45);
  doc.text(`Müşteri: ${client.name}`, 20, 52);
  doc.text(`Email: ${client.email}`, 20, 59);
  doc.text(
    `Durum: ${project.status === 'active' ? 'Aktif' : 'Tamamlandı'}`,
    20,
    66
  );
  doc.text(
    `Son Tarih: ${format(project.deadline, 'dd MMMM yyyy', { locale: tr })}`,
    20,
    73
  );

  // Report date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Rapor Tarihi: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: tr })}`,
    20,
    80
  );

  // Updates Table
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Proje Güncellemeleri', 20, 95);

  const tableData = updates.map((update) => [
    format(update.createdAt, 'dd.MM.yyyy', { locale: tr }),
    update.title,
    update.category === 'design'
      ? 'Tasarım'
      : update.category === 'dev'
      ? 'Geliştirme'
      : update.category === 'testing'
      ? 'Test'
      : update.category,
    update.status === 'approved'
      ? 'Onaylandı'
      : update.status === 'needs_revision'
      ? 'Revize'
      : 'Bekliyor',
    update.description.substring(0, 60) + (update.description.length > 60 ? '...' : ''),
  ]);

  autoTable(doc, {
    head: [['Tarih', 'Başlık', 'Kategori', 'Durum', 'Açıklama']],
    body: tableData,
    startY: 100,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 20, right: 20 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Sayfa ${i} / ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_rapor_${format(
    new Date(),
    'yyyyMMdd'
  )}.pdf`;
  doc.save(fileName);
}

// Analytics Export
export async function exportAnalyticsPDF(stats: {
  totalClients: number;
  totalProjects: number;
  totalUpdates: number;
  activeProjects: number;
  pendingUpdates: number;
  approvedUpdates: number;
}) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ClientFlow', 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Analitik Raporu', 20, 30);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Rapor Tarihi: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: tr })}`,
    20,
    40
  );

  // Statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Genel İstatistikler', 20, 55);

  const statsData = [
    ['Toplam Müşteri', stats.totalClients.toString()],
    ['Toplam Proje', stats.totalProjects.toString()],
    ['Aktif Proje', stats.activeProjects.toString()],
    ['Toplam Güncelleme', stats.totalUpdates.toString()],
    ['Onaylanan Güncelleme', stats.approvedUpdates.toString()],
    ['Bekleyen Güncelleme', stats.pendingUpdates.toString()],
  ];

  autoTable(doc, {
    head: [['Metrik', 'Değer']],
    body: statsData,
    startY: 60,
    styles: {
      fontSize: 11,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Sayfa 1 / 1',
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  // Save
  const fileName = `clientflow_analitik_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}
