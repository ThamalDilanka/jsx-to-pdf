# JSX to PDF: Implementation Guide

This document provides a detailed explanation of how the JSX-to-PDF solution is implemented, the technologies used, and the knowledge required to build a similar system. It serves as a technical companion to the main README.md file.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Technologies](#core-technologies)
3. [Implementation Steps](#implementation-steps)
4. [Key Components](#key-components)
5. [PDF Generation Process](#pdf-generation-process)
6. [Dynamic JSX Compilation](#dynamic-jsx-compilation)
7. [Styling System](#styling-system)
8. [API Design](#api-design)
9. [Testing](#testing)
10. [Deployment Considerations](#deployment-considerations)
11. [Performance Optimization](#performance-optimization)
12. [Security Considerations](#security-considerations)
13. [Extending the System](#extending-the-system)

## Architecture Overview

The JSX-to-PDF solution follows a server-side architecture that converts React JSX templates into PDF documents. The system is built as a Node.js Express application that exposes RESTful API endpoints for PDF generation.

The high-level architecture consists of:

1. **Express.js Server**: Handles HTTP requests and routes them to appropriate handlers
2. **JSX Templates**: React components that define the structure and content of PDFs
3. **Server-Side Rendering**: Converts JSX to HTML using React's server-side rendering
4. **PDF Generation**: Uses Puppeteer to convert HTML to PDF
5. **Dynamic JSX Compilation**: Compiles JSX strings at runtime using Babel

The system is designed to be stateless, with no database dependencies, making it easy to deploy and scale.

## Core Technologies

The solution relies on the following core technologies:

1. **Node.js**: JavaScript runtime for server-side execution
2. **Express.js**: Web framework for handling HTTP requests and routing
3. **React**: Library for building user interfaces with JSX
4. **react-dom/server**: Server-side rendering of React components
5. **Puppeteer**: Headless Chrome browser for converting HTML to PDF
6. **Babel**: JavaScript compiler for transforming JSX strings at runtime
7. **TypeScript**: Type-safe JavaScript for better developer experience

## Implementation Steps

To implement a similar solution, follow these steps:

### 1. Project Setup

```bash
# Create a new directory for your project
mkdir jsx-to-pdf
cd jsx-to-pdf

# Initialize a new Node.js project
npm init -y

# Install dependencies
npm install express react react-dom puppeteer @babel/core @babel/preset-react

# Install development dependencies
npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/react @types/react-dom @types/babel__core

# Initialize TypeScript configuration
npx tsc --init
```

### 2. Configure TypeScript

Create or modify `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. Project Structure

Create the following directory structure:

```
jsx-to-pdf/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── routes/
│   │   └── pdfRoutes.ts         # API routes for PDF generation
│   ├── templates/
│   │   ├── InvoiceTemplate.tsx  # Invoice template component
│   │   └── ReportTemplate.tsx   # Report template component
│   ├── utils/
│   │   └── pdfGenerator.ts      # PDF generation utilities
│   ├── public/
│   │   └── styles.css           # CSS styles for templates
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── dist/                        # Compiled JavaScript output
├── output/                      # Generated PDF output directory
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Key Components

### Express Server (src/index.ts)

The main entry point sets up the Express server and configures middleware:

```typescript
import express from 'express';
import path from 'path';
import pdfRoutes from './routes/pdfRoutes';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/pdf', pdfRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### PDF Generator Utility (src/utils/pdfGenerator.ts)

The core utility for generating PDFs from JSX:

```typescript
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
    const templateFunction = new Function(functionBody);

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
 */
export async function generatePdfFromJsxString(
  jsxString: string,
  data: Record<string, any> = {},
  options: PdfOptions = {}
): Promise<Buffer> {
  const reactElement = compileJsxString(jsxString, data);
  return generatePdfFromJsx(reactElement, options);
}
```

### JSX Templates (src/templates/)

Templates are React components that define the structure and content of PDFs:

```typescript
// InvoiceTemplate.tsx
import React from 'react';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  notes?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  dueDate,
  customerName,
  customerAddress,
  items,
  notes = '',
  companyName = 'Your Company Name',
  companyAddress = '123 Business St, City, Country',
  companyEmail = 'contact@example.com',
  companyPhone = '+1 (555) 123-4567',
}) => {
  // Calculate subtotal, tax, and total
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;

  return (
    <div className='page'>
      {/* Header with company and invoice info */}
      <div className='page-header flex justify-between items-center'>
        {/* Company info */}
        <div>
          <h1 className='text-2xl font-bold'>{companyName}</h1>
          <p className='text-gray-500'>{companyAddress}</p>
          <p className='text-gray-500'>{companyEmail}</p>
          <p className='text-gray-500'>{companyPhone}</p>
        </div>
        {/* Invoice details */}
        <div className='text-right'>
          <h2 className='text-xl font-bold'>INVOICE</h2>
          <p><strong>Invoice #:</strong> {invoiceNumber}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Due Date:</strong> {dueDate}</p>
        </div>
      </div>

      {/* Customer information */}
      <div className='my-4 p-4 border border-gray-200 rounded'>
        <h3 className='font-semibold'>Bill To:</h3>
        <p className='font-bold'>{customerName}</p>
        <p>{customerAddress}</p>
      </div>

      {/* Invoice items table */}
      <table className='table'>
        <thead>
          <tr className='bg-gray-100'>
            <th>Description</th>
            <th className='text-right'>Quantity</th>
            <th className='text-right'>Unit Price</th>
            <th className='text-right'>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td className='text-right'>{item.quantity}</td>
              <td className='text-right'>${item.unitPrice.toFixed(2)}</td>
              <td className='text-right'>${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className='flex justify-end my-4'>
        <div className='w-full max-w-xs'>
          <div className='flex justify-between py-2'>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between py-2'>
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className='flex justify-between py-2 font-bold'>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className='my-4 p-4 border border-gray-200 rounded'>
          <h3 className='font-semibold'>Notes:</h3>
          <p>{notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className='page-footer text-center'>
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
```

## PDF Generation Process

The PDF generation process follows these steps:

1. **Receive Request**: The Express server receives an HTTP request with data for the PDF.
2. **Validate Data**: The route handler validates the required fields.
3. **Create React Element**: The handler creates a React element using the appropriate template and data.
4. **Render to HTML**: The `renderToStaticMarkup` function from `react-dom/server` converts the React element to HTML.
5. **Create Full HTML Document**: The HTML is wrapped in a complete document with CSS styles.
6. **Launch Puppeteer**: A headless Chrome browser is launched using Puppeteer.
7. **Render HTML**: The HTML content is loaded into a Puppeteer page.
8. **Generate PDF**: Puppeteer converts the rendered page to a PDF.
9. **Return PDF**: The PDF buffer is returned as the HTTP response.

## Dynamic JSX Compilation

One of the most powerful features of this system is the ability to compile JSX strings at runtime:

1. **Receive JSX String**: The API receives a JSX string in the request payload.
2. **Transform with Babel**: Babel transforms the JSX string to JavaScript.
3. **Create Function**: A new function is created that returns a React element.
4. **Execute Function**: The function is executed with React and the provided data.
5. **Generate PDF**: The resulting React element is used to generate a PDF.

This approach allows for completely dynamic templates that can be defined by the client at runtime.

## Styling System

The styling system uses a Tailwind-like approach with utility classes:

1. **CSS Utility Classes**: A set of utility classes is defined in `styles.css`.
2. **Class Composition**: Templates use these utility classes to style elements.
3. **Embedded CSS**: The CSS is embedded in the HTML document during PDF generation.

This approach provides a flexible and maintainable way to style PDF templates without external dependencies.

## API Design

The API is designed to be RESTful and flexible:

1. **Specific Endpoints**: Dedicated endpoints for common templates (e.g., `/api/pdf/invoice`).
2. **Generic Endpoint**: A generic endpoint (`/api/pdf/generate`) that accepts a template type and data.
3. **Dynamic Endpoint**: A dynamic endpoint (`/api/pdf/render`) that accepts a JSX string and data.
4. **Documentation Endpoint**: An endpoint (`/api/pdf/components`) that returns information about available components.

This design allows for both simple use cases and advanced customization.

## Testing

The system includes two types of tests:

1. **Template Tests**: Tests that generate PDFs from predefined templates.
2. **Dynamic Tests**: Tests that generate PDFs from dynamic JSX strings.

These tests ensure that both the template system and the dynamic compilation work correctly.

## Deployment Considerations

When deploying this system, consider the following:

1. **Memory Requirements**: Puppeteer requires significant memory, especially for complex PDFs.
2. **Concurrency**: Limit the number of concurrent PDF generations to avoid memory issues.
3. **Timeouts**: Set appropriate timeouts for PDF generation to handle large documents.
4. **Containerization**: Use Docker to ensure consistent environments.
5. **Puppeteer in Docker**: Configure Puppeteer to run in a Docker container with the necessary dependencies.

Example Docker configuration:

```dockerfile
FROM node:16-slim

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

## Performance Optimization

To optimize performance:

1. **Caching**: Cache generated PDFs for frequently used templates and data.
2. **Puppeteer Pool**: Use a pool of Puppeteer instances to avoid startup costs.
3. **Resource Limits**: Set memory and CPU limits for Puppeteer processes.
4. **Compression**: Compress PDFs to reduce size.
5. **Asynchronous Generation**: For large PDFs, consider generating them asynchronously and providing a download link later.

## Security Considerations

When implementing this system, consider these security aspects:

1. **Input Validation**: Validate all input data to prevent injection attacks.
2. **Sandbox Puppeteer**: Run Puppeteer in a sandboxed environment.
3. **Rate Limiting**: Implement rate limiting to prevent abuse.
4. **Content Security Policy**: Set appropriate CSP headers for the server.
5. **Dynamic JSX Validation**: Validate dynamic JSX to prevent malicious code execution.

## Extending the System

The system can be extended in several ways:

1. **New Templates**: Add new template components for different document types.
2. **Custom Fonts**: Add support for custom fonts in PDFs.
3. **Images**: Add support for embedding images in templates.
4. **Charts**: Integrate chart libraries for data visualization.
5. **PDF Manipulation**: Add features for merging, splitting, or modifying existing PDFs.
6. **Authentication**: Add authentication to protect the API.
7. **Webhooks**: Implement webhooks for notifying when PDFs are generated.
8. **Template Storage**: Add a database to store and manage templates.

### Adding a New Template

To add a new template:

1. Create a new TSX file in the `src/templates` directory.
2. Define the props interface for the template.
3. Implement the React component.
4. Add a new route in `src/routes/pdfRoutes.ts`.
5. Update the component documentation in the `/api/pdf/components` endpoint.

Example of a new certificate template:

```typescript
// CertificateTemplate.tsx
import React from 'react';

interface CertificateProps {
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  issuerName: string;
  issuerSignature?: string;
}

const CertificateTemplate: React.FC<CertificateProps> = ({
  recipientName,
  courseName,
  completionDate,
  certificateId,
  issuerName,
  issuerSignature,
}) => {
  return (
    <div className="page flex flex-col items-center justify-center">
      <div className="border border-gray-200 p-6 rounded-lg w-full" 
           style={{ backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #ffffff)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase">Certificate of Completion</h1>
          <p className="text-gray-500 my-4">This certifies that</p>
          <h2 className="text-xl font-bold my-4">{recipientName}</h2>
          <p className="text-gray-700 my-4">has successfully completed the course</p>
          <h3 className="text-lg font-semibold my-4">{courseName}</h3>
          <p className="text-gray-700 my-4">on {completionDate}</p>
          
          <div className="flex justify-between items-center mt-8">
            <div className="text-left">
              <p className="text-sm">Certificate ID: {certificateId}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{issuerName}</p>
              {issuerSignature && (
                <img 
                  src={issuerSignature} 
                  alt="Signature" 
                  style={{ height: '40px', marginTop: '10px' }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
```

## Conclusion

The JSX-to-PDF solution provides a flexible and powerful way to generate PDF documents using React components. By leveraging server-side rendering and Puppeteer, it offers a modern approach to document generation that is both maintainable and extensible.

This implementation guide covers the core concepts and components needed to build a similar system, but there are many ways to extend and customize it for specific use cases. The combination of React's component model with PDF generation capabilities opens up a wide range of possibilities for document automation. 