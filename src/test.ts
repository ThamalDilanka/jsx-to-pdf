import fs from 'fs';
import path from 'path';
import React from 'react';
import InvoiceTemplate from './templates/InvoiceTemplate';
import ReportTemplate from './templates/ReportTemplate';
import { generatePdfFromJsx } from './utils/pdfGenerator';

async function runTests() {
  console.log('Running PDF generation tests...');

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Test invoice template
  try {
    console.log('Generating invoice PDF...');
    const invoiceData = {
      invoiceNumber: 'INV-001',
      date: '2023-11-01',
      dueDate: '2023-11-15',
      customerName: 'John Doe',
      customerAddress: '123 Main St, Anytown, USA',
      items: [
        {
          description: 'Web Development',
          quantity: 10,
          unitPrice: 150,
        },
        {
          description: 'Hosting (monthly)',
          quantity: 1,
          unitPrice: 50,
        },
      ],
      notes: 'Thank you for your business!',
      companyName: 'Your Company Name',
      companyAddress: '456 Business Ave, City, Country',
      companyEmail: 'contact@example.com',
      companyPhone: '+1 (555) 123-4567',
    };

    const invoicePdf = await generatePdfFromJsx(React.createElement(InvoiceTemplate, invoiceData), {
      filename: 'Invoice-Test.pdf',
    });

    fs.writeFileSync(path.join(outputDir, 'invoice-test.pdf'), invoicePdf);
    console.log('Invoice PDF generated successfully!');
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
  }

  // Test report template
  try {
    console.log('Generating report PDF...');
    const reportData = {
      title: 'Monthly Performance Report',
      date: '2023-11-01',
      author: 'Jane Smith',
      summary: 'This report summarizes the performance metrics for October 2023.',
      data: [
        {
          label: 'Website Visitors',
          value: 15000,
        },
        {
          label: 'New Customers',
          value: 120,
        },
        {
          label: 'Revenue',
          value: 25000,
        },
      ],
      conclusion: "Overall, we've seen a 15% increase in all key metrics compared to the previous month.",
      companyName: 'Your Company Name',
    };

    const reportPdf = await generatePdfFromJsx(React.createElement(ReportTemplate, reportData), {
      filename: 'Report-Test.pdf',
    });

    fs.writeFileSync(path.join(outputDir, 'report-test.pdf'), reportPdf);
    console.log('Report PDF generated successfully!');
  } catch (error) {
    console.error('Error generating report PDF:', error);
  }

  console.log('Tests completed!');
}

runTests().catch(console.error);
