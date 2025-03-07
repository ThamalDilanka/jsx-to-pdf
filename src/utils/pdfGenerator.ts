import puppeteer from 'puppeteer';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactElement } from 'react';
import path from 'path';
import fs from 'fs';
import React from 'react';
import * as babel from '@babel/core';

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

/**
 * Compiles JSX string to a React component
 * @param jsxString JSX code as a string
 * @param data Data to be passed as props to the component
 * @returns React element
 */
export function compileJsxString(jsxString: string, data: Record<string, any> = {}): ReactElement {
  try {
    // Transform JSX string to JavaScript
    const transformedCode = babel.transformSync(jsxString, {
      presets: ['@babel/preset-react'],
      filename: 'dynamic-template.jsx',
    });

    if (!transformedCode || !transformedCode.code) {
      throw new Error('Failed to transform JSX code');
    }

    // Create a function that returns a React element
    const functionBody = `
      const React = arguments[0];
      const data = arguments[1];
      ${transformedCode.code}
      return React.createElement(Template, data);
    `;

    // Create a new function from the transformed code
    // eslint-disable-next-line no-new-func
    const templateFunction = new Function(functionBody);

    // Define a Template component that will be used in the function
    const Template = (props: any) => {
      return React.createElement('div', null, props.children || 'Empty Template');
    };

    // Execute the function with React and data
    return templateFunction(React, data);
  } catch (error) {
    console.error('Error compiling JSX string:', error);
    // Return a fallback element
    return React.createElement('div', null, 'Error rendering template');
  }
}

/**
 * Generates a PDF from a JSX string and data
 * @param jsxString JSX code as a string
 * @param data Data to be passed as props to the component
 * @param options PDF generation options
 * @returns Buffer containing the generated PDF
 */
export async function generatePdfFromJsxString(
  jsxString: string,
  data: Record<string, any> = {},
  options: PdfOptions = {}
): Promise<Buffer> {
  const reactElement = compileJsxString(jsxString, data);
  return generatePdfFromJsx(reactElement, options);
}
