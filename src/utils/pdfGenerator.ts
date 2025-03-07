import puppeteer from 'puppeteer';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactElement } from 'react';
import path from 'path';
import fs from 'fs';

// Read the CSS file once at startup
const cssFilePath = path.join(__dirname, '..', 'public', 'styles.css');
const cssContent = fs.readFileSync(cssFilePath, 'utf8');

interface PdfOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  landscape?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  filename?: string;
}

/**
 * Generates a PDF from a JSX template
 * @param template JSX template as a React element
 * @param options PDF generation options
 * @returns Buffer containing the generated PDF
 */
export async function generatePdfFromJsx(template: ReactElement, options: PdfOptions = {}): Promise<Buffer> {
  // Default options
  const defaultOptions: PdfOptions = {
    format: 'Letter',
    landscape: false,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in',
    },
    filename: 'document.pdf',
  };

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };

  // Convert JSX to HTML
  const htmlContent = renderToStaticMarkup(template);

  // Create a complete HTML document with the CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${mergedOptions.filename}</title>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Create a new page
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: mergedOptions.format,
      landscape: mergedOptions.landscape,
      margin: mergedOptions.margin,
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    // Always close the browser
    await browser.close();
  }
}
