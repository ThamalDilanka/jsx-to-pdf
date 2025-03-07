import express, { Request, Response, Router } from 'express';
import { generatePdfFromJsx, generatePdfFromJsxString } from '../utils/pdfGenerator';
import InvoiceTemplate from '../templates/InvoiceTemplate';
import ReportTemplate from '../templates/ReportTemplate';
import React from 'react';

const router: Router = express.Router();

// Generate invoice PDF
router.post('/invoice', async (req: Request, res: Response) => {
  try {
    const {
      invoiceNumber,
      date,
      dueDate,
      customerName,
      customerAddress,
      items,
      notes,
      companyName,
      companyAddress,
      companyEmail,
      companyPhone,
    } = req.body;

    // Validate required fields
    if (!invoiceNumber || !date || !dueDate || !customerName || !customerAddress || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate PDF from JSX template
    const pdfBuffer = await generatePdfFromJsx(
      React.createElement(InvoiceTemplate, {
        invoiceNumber,
        date,
        dueDate,
        customerName,
        customerAddress,
        items,
        notes,
        companyName,
        companyAddress,
        companyEmail,
        companyPhone,
      }),
      { filename: `Invoice-${invoiceNumber}.pdf` }
    );

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoiceNumber}.pdf`);

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generate report PDF
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { title, date, author, summary, data, conclusion, companyName } = req.body;

    // Validate required fields
    if (!title || !date || !author || !summary || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate PDF from JSX template
    const pdfBuffer = await generatePdfFromJsx(
      React.createElement(ReportTemplate, {
        title,
        date,
        author,
        summary,
        data,
        conclusion,
        companyName,
      }),
      { filename: `Report-${title.replace(/\s+/g, '-')}.pdf` }
    );

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${title.replace(/\s+/g, '-')}.pdf`);

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating report PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generic PDF generation endpoint that accepts a template type and data
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { templateType, data, options } = req.body;

    // Validate required fields
    if (!templateType || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let template;
    let filename;

    // Select template based on templateType
    switch (templateType) {
      case 'invoice':
        template = React.createElement(InvoiceTemplate, data);
        filename = `Invoice-${data.invoiceNumber || 'generated'}.pdf`;
        break;
      case 'report':
        template = React.createElement(ReportTemplate, data);
        filename = `Report-${(data.title || 'generated').replace(/\s+/g, '-')}.pdf`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid template type' });
    }

    // Generate PDF from JSX template
    const pdfBuffer = await generatePdfFromJsx(template, { ...options, filename });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Dynamic JSX template rendering endpoint
router.post('/render', async (req: Request, res: Response) => {
  try {
    const { jsxTemplate, data, options } = req.body;

    // Validate required fields
    if (!jsxTemplate) {
      return res.status(400).json({ error: 'Missing JSX template' });
    }

    // Set default filename
    const filename = options?.filename || 'document.pdf';

    // Generate PDF from JSX string
    const pdfBuffer = await generatePdfFromJsxString(jsxTemplate, data || {}, { ...options, filename });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF from JSX string:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Component library endpoint - returns available components and their props
router.get('/components', (req: Request, res: Response) => {
  // Define component documentation
  const components = [
    {
      name: 'InvoiceTemplate',
      description: 'Template for generating invoice PDFs',
      props: {
        invoiceNumber: { type: 'string', required: true, description: 'Unique identifier for the invoice' },
        date: { type: 'string', required: true, description: 'Invoice creation date (YYYY-MM-DD format)' },
        dueDate: { type: 'string', required: true, description: 'Payment due date (YYYY-MM-DD format)' },
        customerName: { type: 'string', required: true, description: 'Name of the customer' },
        customerAddress: { type: 'string', required: true, description: 'Full address of the customer' },
        items: {
          type: 'array',
          required: true,
          description: 'Array of items included in the invoice',
          items: {
            description: { type: 'string', required: true, description: 'Description of the item' },
            quantity: { type: 'number', required: true, description: 'Quantity of the item' },
            unitPrice: { type: 'number', required: true, description: 'Price per unit of the item' },
          },
        },
        notes: { type: 'string', required: false, description: 'Additional notes to include on the invoice' },
        companyName: { type: 'string', required: false, description: 'Name of the company issuing the invoice' },
        companyAddress: { type: 'string', required: false, description: 'Address of the company' },
        companyEmail: { type: 'string', required: false, description: 'Email contact for the company' },
        companyPhone: { type: 'string', required: false, description: 'Phone number for the company' },
      },
    },
    {
      name: 'ReportTemplate',
      description: 'Template for generating report PDFs',
      props: {
        title: { type: 'string', required: true, description: 'Title of the report' },
        date: { type: 'string', required: true, description: 'Date of the report (YYYY-MM-DD format)' },
        author: { type: 'string', required: true, description: 'Name of the report author' },
        summary: { type: 'string', required: true, description: 'Executive summary of the report' },
        data: {
          type: 'array',
          required: true,
          description: 'Array of data points to include in the report',
          items: {
            label: { type: 'string', required: true, description: 'Label for the data point' },
            value: { type: 'number', required: true, description: 'Numeric value for the data point' },
          },
        },
        conclusion: { type: 'string', required: false, description: 'Conclusion or final thoughts for the report' },
        companyName: { type: 'string', required: false, description: 'Name of the company issuing the report' },
      },
    },
  ];

  // Return component documentation
  res.json({ components });
});

export default router;
