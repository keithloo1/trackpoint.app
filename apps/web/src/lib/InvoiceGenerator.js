
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { formatMYR } from './utils.js';

export const generateInvoice = async ({
  clientName,
  email,
  phone,
  transactionDate,
  paymentTime,
  sessions,
  amount,
  invoiceNumber,
  studioName = 'TRACKPOINT.APP Studio',
  paymentMethod = 'Online Payment',
  transactionId = ''
}) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(studioName, 20, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Receipt / Invoice', 20, 40);
  
  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Receipt #: ${invoiceNumber}`, 130, 30);
  
  const dateStr = format(new Date(transactionDate), 'dd MMMM yyyy');
  const timeStr = paymentTime ? paymentTime : format(new Date(transactionDate), 'h:mm a');
  doc.text(`Date: ${dateStr}, ${timeStr}`, 130, 38);
  if (transactionId) {
    doc.text(`Transaction ID: ${transactionId}`, 130, 46);
  }
  
  // Client Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(clientName || 'Valued Client', 20, 68);
  if (email) doc.text(email, 20, 74);
  if (phone) doc.text(phone, 20, 80);
  
  // Payment Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details:', 130, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Method: ${paymentMethod}`, 130, 68);
  doc.text(`Status: Paid`, 130, 74);
  
  // Table Header
  doc.setDrawColor(200);
  doc.line(20, 95, 190, 95);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 20, 102);
  doc.text('Qty', 130, 102);
  doc.text('Amount', 160, 102);
  doc.line(20, 106, 190, 106);
  
  // Table Content
  doc.setFont('helvetica', 'normal');
  doc.text('Package Renewal / Session Purchase', 20, 116);
  doc.text(`${sessions} Sessions`, 130, 116);
  doc.text(formatMYR(amount), 160, 116);
  
  // Total
  doc.line(120, 126, 190, 126);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Paid:', 130, 134);
  doc.text(formatMYR(amount), 160, 134);
  
  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('Thank you for your business.', 105, 270, { align: 'center' });
  
  // Save PDF
  doc.save(`Receipt_${invoiceNumber}.pdf`);
};
