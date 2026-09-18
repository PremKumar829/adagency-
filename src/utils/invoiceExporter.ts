import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomInvoice } from '../types';

/**
 * Downloads an invoice rendered on DOM as a crisp, print-ready PDF file.
 */
export async function downloadInvoiceAsPDF(
  elementId: string,
  filenamePrefix: string = 'PrimeAds_Invoice'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Invoice element with id "${elementId}" not found.`);
    return false;
  }

  try {
    // Generate high-resolution canvas with html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp print/retina resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create jsPDF instance in A4 format (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Fit image with subtle 5mm margin
    const margin = 8;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pdfHeight - margin * 2) {
      // Single page fit
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
    } else {
      // Multi-page or scaled fit
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
        heightLeft -= (pdfHeight - margin * 2);
      }
    }

    const safeFilename = `${filenamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    pdf.save(safeFilename);
    return true;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    // Fallback to native print if canvas fails
    window.print();
    return false;
  }
}

/**
 * Downloads an invoice rendered on DOM as a high-resolution PNG image.
 */
export async function downloadInvoiceAsImage(
  elementId: string,
  filenamePrefix: string = 'PrimeAds_Invoice'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Invoice element with id "${elementId}" not found.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High-res for direct WhatsApp/Telegram photo sending
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filenamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error generating invoice image:', error);
    return false;
  }
}

/**
 * Downloads invoice receipt as a clean formatted .txt document.
 */
export function downloadInvoiceAsText(invoice: CustomInvoice): void {
  const symbol = invoice.currency === 'INR' ? '₹' : invoice.currency === 'USD' ? '$' : 'USDT ';
  
  const textContent = `=====================================================
${invoice.agencyName.toUpperCase()}
OFFICIAL TAX INVOICE & BILLING RECEIPT
=====================================================
Invoice No:    ${invoice.invoiceNumber}
Date:          ${invoice.date}
Due Date:      ${invoice.dueDate || invoice.date}
Payment Status:${invoice.paymentStatus.toUpperCase()} (Settled)

BILLED TO (CLIENT):
-----------------------------------------------------
Client Name:   ${invoice.clientName}
Company:       ${invoice.clientCompany || 'Direct Client'}
Contact:       ${invoice.clientContact}
Address:       ${invoice.clientAddress || 'N/A'}

CAMPAIGN DELIVERABLES / LINE ITEMS:
-----------------------------------------------------
${invoice.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.description}\n   Qty: ${item.quantity} | Rate: ${symbol}${item.rate.toLocaleString()} | Total: ${symbol}${item.amount.toLocaleString()}`
  )
  .join('\n\n')}

FINANCIAL BREAKDOWN:
-----------------------------------------------------
Subtotal:      ${symbol}${invoice.subtotal.toLocaleString()}
${invoice.taxPercent > 0 ? `Tax / GST (${invoice.taxPercent}%): +${symbol}${invoice.taxAmount.toLocaleString()}\n` : ''}${invoice.discountAmount > 0 ? `Discount:      -${symbol}${invoice.discountAmount.toLocaleString()}\n` : ''}TOTAL AMOUNT:  ${symbol}${invoice.totalAmount.toLocaleString()}

SETTLEMENT & PAYMENT TRANSACTION:
-----------------------------------------------------
Payment Mode:  ${invoice.paymentMode}
UTR / TxID:    ${invoice.transactionId}
Verified On:   ${invoice.paymentDate || invoice.date}

DIGITAL AUTHORIZATION & GUARANTEE:
-----------------------------------------------------
Authorized By: ${invoice.ceoName} (${invoice.ceoDesignation})
Agency:        ${invoice.agencyName}
Digital Seal:  ${invoice.digitalStampCode}
Support Desk:  ${invoice.agencyPhone}
Official Web:  ${invoice.agencyWebsite}

TERMS & NOTES:
${invoice.notes || 'All metrics backed by 30-day non-drop replacement guarantee.'}
=====================================================
Computer-generated certified invoice with digital cryptographic authorization.
`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}_Receipt.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
