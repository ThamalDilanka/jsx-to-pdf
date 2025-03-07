import express, { Request, Response, Router } from 'express';
import { generatePdfFromJsx } from '../utils/pdfGenerator';
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

export default router;
