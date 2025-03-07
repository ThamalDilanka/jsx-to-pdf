# JSX to PDF Generator

A lightweight proof-of-concept (PoC) for a PDF generation service using Express.js and JSX (React components) to define dynamic templates. The service renders JSX templates server-side and generates PDFs using Puppeteer, all without a database connection.

## Features

- Server-side rendering of React JSX templates
- PDF generation using Puppeteer
- Tailwind-like CSS styling
- Multiple template types (Invoice, Report)
- Dynamic JSX template rendering from request payload
- RESTful API endpoints for PDF generation

## Technology Stack

- **Backend**: Node.js with Express.js for the API server
- **PDF Generation**: Puppeteer to render HTML and generate PDFs
- **Templating**: React (server-side rendering with react-dom/server) for dynamic templates
- **Styling**: Tailwind-like CSS classes in a static file
- **JSX Compilation**: Babel for compiling JSX strings at runtime

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/jsx-to-pdf.git
   cd jsx-to-pdf
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the project:

   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Generate Invoice PDF

```
POST /api/pdf/invoice
```

#### Request Body

| Field               | Type   | Required | Description                                                               |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------- |
| invoiceNumber       | string | Yes      | Unique identifier for the invoice                                         |
| date                | string | Yes      | Invoice creation date (YYYY-MM-DD format)                                 |
| dueDate             | string | Yes      | Payment due date (YYYY-MM-DD format)                                      |
| customerName        | string | Yes      | Name of the customer                                                      |
| customerAddress     | string | Yes      | Full address of the customer                                              |
| items               | array  | Yes      | Array of items included in the invoice                                    |
| items[].description | string | Yes      | Description of the item                                                   |
| items[].quantity    | number | Yes      | Quantity of the item                                                      |
| items[].unitPrice   | number | Yes      | Price per unit of the item                                                |
| notes               | string | No       | Additional notes to include on the invoice                                |
| companyName         | string | No       | Name of the company issuing the invoice (defaults to "Your Company Name") |
| companyAddress      | string | No       | Address of the company (defaults to "123 Business St, City, Country")     |
| companyEmail        | string | No       | Email contact for the company (defaults to "contact@example.com")         |
| companyPhone        | string | No       | Phone number for the company (defaults to "+1 (555) 123-4567")            |

#### Example Request

```json
{
  "invoiceNumber": "INV-001",
  "date": "2023-11-01",
  "dueDate": "2023-11-15",
  "customerName": "John Doe",
  "customerAddress": "123 Main St, Anytown, USA",
  "items": [
    {
      "description": "Web Development",
      "quantity": 10,
      "unitPrice": 150
    },
    {
      "description": "Hosting (monthly)",
      "quantity": 1,
      "unitPrice": 50
    }
  ],
  "notes": "Thank you for your business!",
  "companyName": "Your Company Name",
  "companyAddress": "456 Business Ave, City, Country",
  "companyEmail": "contact@example.com",
  "companyPhone": "+1 (555) 123-4567"
}
```

#### Response

The response will be a PDF file with the `Content-Type: application/pdf` header.

### Generate Report PDF

```
POST /api/pdf/report
```

#### Request Body

| Field        | Type   | Required | Description                                                              |
| ------------ | ------ | -------- | ------------------------------------------------------------------------ |
| title        | string | Yes      | Title of the report                                                      |
| date         | string | Yes      | Date of the report (YYYY-MM-DD format)                                   |
| author       | string | Yes      | Name of the report author                                                |
| summary      | string | Yes      | Executive summary of the report                                          |
| data         | array  | Yes      | Array of data points to include in the report                            |
| data[].label | string | Yes      | Label for the data point                                                 |
| data[].value | number | Yes      | Numeric value for the data point                                         |
| conclusion   | string | No       | Conclusion or final thoughts for the report                              |
| companyName  | string | No       | Name of the company issuing the report (defaults to "Your Company Name") |

#### Example Request

```json
{
  "title": "Monthly Performance Report",
  "date": "2023-11-01",
  "author": "Jane Smith",
  "summary": "This report summarizes the performance metrics for October 2023.",
  "data": [
    {
      "label": "Website Visitors",
      "value": 15000
    },
    {
      "label": "New Customers",
      "value": 120
    },
    {
      "label": "Revenue",
      "value": 25000
    }
  ],
  "conclusion": "Overall, we've seen a 15% increase in all key metrics compared to the previous month.",
  "companyName": "Your Company Name"
}
```

#### Response

The response will be a PDF file with the `Content-Type: application/pdf` header.

### Generic PDF Generation

```
POST /api/pdf/generate
```

#### Request Body

| Field                 | Type    | Required | Description                                                     |
| --------------------- | ------- | -------- | --------------------------------------------------------------- |
| templateType          | string  | Yes      | Type of template to use ("invoice" or "report")                 |
| data                  | object  | Yes      | Template-specific data (see above examples)                     |
| options               | object  | No       | PDF generation options                                          |
| options.format        | string  | No       | Paper format: "A4", "Letter", or "Legal" (defaults to "Letter") |
| options.landscape     | boolean | No       | Whether to use landscape orientation (defaults to false)        |
| options.margin        | object  | No       | Page margins                                                     |
| options.margin.top    | string  | No       | Top margin (defaults to "0.5in")                                 |
| options.margin.right  | string  | No       | Right margin (defaults to "0.5in")                               |
| options.margin.bottom | string  | No       | Bottom margin (defaults to "0.5in")                                |
| options.margin.left   | string  | No       | Left margin (defaults to "0.5in")                                    |

#### Example Request for Invoice Template

```json
{
  "templateType": "invoice",
  "data": {
    "invoiceNumber": "INV-001",
    "date": "2023-11-01",
    "dueDate": "2023-11-15",
    "customerName": "John Doe",
    "customerAddress": "123 Main St, Anytown, USA",
    "items": [
      {
        "description": "Web Development",
        "quantity": 10,
        "unitPrice": 150
      },
      {
        "description": "Hosting (monthly)",
        "quantity": 1,
        "unitPrice": 50
      }
    ],
    "notes": "Thank you for your business!"
  },
  "options": {
    "format": "Letter",
    "landscape": false,
    "margin": {
      "top": "0.5in",
      "right": "0.5in",
      "bottom": "0.5in",
      "left": "0.5in"
    }
  }
}
```

#### Example Request for Report Template

```json
{
  "templateType": "report",
  "data": {
    "title": "Monthly Performance Report",
    "date": "2023-11-01",
    "author": "Jane Smith",
    "summary": "This report summarizes the performance metrics for October 2023.",
    "data": [
      {
        "label": "Website Visitors",
        "value": 15000
      },
      {
        "label": "New Customers",
        "value": 120
      },
      {
        "label": "Revenue",
        "value": 25000
      }
    ],
    "conclusion": "Overall, we've seen a 15% increase in all key metrics compared to the previous month."
  },
  "options": {
    "format": "A4",
    "landscape": true
  }
}
```

#### Response

The response will be a PDF file with the `Content-Type: application/pdf` header.

### Dynamic JSX Template Rendering

```
POST /api/pdf/render
```

This endpoint allows you to send a JSX template as a string in the request payload, along with data to be injected into the template. The service will compile the JSX at runtime, render it with the provided data, and return a PDF.

#### Request Body

| Field               | Type    | Required | Description                                                     |
| ------------------- | ------- | -------- | --------------------------------------------------------------- |
| jsxTemplate         | string  | Yes      | JSX template code as a string                                     |
| data                | object  | No       | Data to be passed as props to the template                        |
| options             | object  | No       | PDF generation options                                           |
| options.format      | string  | No       | Paper format: "A4", "Letter", or "Legal" (defaults to "Letter") |
| options.landscape   | boolean | No       | Whether to use landscape orientation (defaults to false)        |
| options.margin      | object  | No       | Page margins                                                     |
| options.margin.top   | string  | No       | Top margin (defaults to "0.5in")                                 |
| options.margin.right | string  | No       | Right margin (defaults to "0.5in")                                   |
| options.margin.bottom | string | No       | Bottom margin (defaults to "0.5in")                                |
| options.margin.left  | string  | No       | Left margin (defaults to "0.5in")                                    |

#### Example Requests

##### Simple Document Template

```json
{
  "jsxTemplate": "function Template(props) { const { title, content } = props; return (<div className=\"page\"><div className=\"page-header text-center\"><h1 className=\"text-2xl font-bold\">{title}</h1></div><div className=\"my-4 p-4 border border-gray-200 rounded\"><div dangerouslySetInnerHTML={{ __html: content }} /></div><div className=\"page-footer text-center\"><p>Generated with JSX to PDF</p></div></div>); }",
  "data": {
    "title": "Dynamic Template Example",
    "content": "<h2 class=\"text-xl font-semibold\">This is a dynamic template</h2><p class=\"my-2\">This PDF was generated from a JSX string passed directly to the PDF generator.</p>"
  },
  "options": {
    "format": "A4",
    "landscape": false
  }
}
```

##### Certificate Template

```json
{
  "jsxTemplate": "function Template(props) { const { recipientName, courseName, completionDate, certificateId, issuerName, issuerSignature } = props; return (<div className=\"page flex flex-col items-center justify-center\"><div className=\"border border-gray-200 p-6 rounded-lg w-full\" style={{ backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #ffffff)' }}><div className=\"text-center\"><h1 className=\"text-2xl font-bold uppercase\">Certificate of Completion</h1><p className=\"text-gray-500 my-4\">This certifies that</p><h2 className=\"text-xl font-bold my-4\">{recipientName}</h2><p className=\"text-gray-700 my-4\">has successfully completed the course</p><h3 className=\"text-lg font-semibold my-4\">{courseName}</h3><p className=\"text-gray-700 my-4\">on {completionDate}</p><div className=\"flex justify-between items-center mt-8\"><div className=\"text-left\"><p className=\"text-sm\">Certificate ID: {certificateId}</p></div><div className=\"text-right\"><p className=\"font-semibold\">{issuerName}</p><img src={issuerSignature} alt=\"Signature\" style={{ height: '40px', marginTop: '10px' }} /></div></div></div></div></div>); }",
  "data": {
    "recipientName": "John Doe",
    "courseName": "Advanced JavaScript Programming",
    "completionDate": "March 7, 2024",
    "certificateId": "CERT-2024-03-001",
    "issuerName": "JavaScript Academy",
    "issuerSignature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7UlEQVR4nO2ce4hVVRTGf3dmHI3xkZMvTEXzUZqYGJmJGJWpaeIjSrOHhmagZn9kRUKBWX+UlIb2R0bOVFqRj0yzxEfaA7OHWlmRZmqODzQfM+qkM2tYZ7hzPfvcs/a5Z+Y6+j3gMnf2Xmuvs+8+e6+99jlQpUqVKlWqVKlSJWPqAcOBp4F3gC+BH4FfgT+AXcBWYDXwNDAKOKcSBs4HJgHLgG+AY0AxpRwG9gCrgQeAK7JwQB1wK7AE2Av8nVL5uHIUWAvcD5yfhQPqgLuBDcCJCijvkpPAJmAi0KCcQwPwELAjA+W9chjoBZwWU/9ZwCRgawbKJpUfgLuAWjUHNAJzgUMZKJhWDgK3xNR/MbA+A+WSylfADSoOaAE+z0CxUuVroFVM/Qvk+VCJcgLoBZwRU/9C4LMMlEsqvwHDVBzQCnyZgWKlyiGgXUz9C8CSDJRLKtuAK1Uc0AZ8k4FipcpRoCOm/gXg9QyUSyqfAheqOKAd+D4DxUqVE8DVMU4oAK9loFxS+QBoVnFAB/BjBoqVKn8BN8Y4oQC8mIFySWUl0KTigE7gpwwUK1VOAffGOKEAzMhAuaSyBGhUcUAXsDcDxUqVYjHOCQVgWgbKJZX5wNkqDugG9megWKlSBB6PcUIBmJqBckllDnCWigN6gAMZKFaqFIEnY5xQAJ7LQLmkMgs4U8UBvcChDBQrVYrA5BgnFIDBGSiXVIYCf6k4QBzwVwaKlSpFYGmMEwrAoAyUSyqDgD9VHCAOOJqBYqVKEVge44QCMDADxZLKAOCIigPEAYczUKxUKQIrYpxQAPpnoFxS6QccUnGAOOBgBoqVKkVgZYwTCkDfDJRLKn2AAyoOEAfsy0CxUqUIrIpxQgHonYFySaU3sF/FAeKAvRkoVqoUgZ0xTigALTNQLqm0BFapOEAcsDIDxUqVIrArxgkFoEUGyiWVFsAKFQeIA5ZnoFipUgR2xzihADTPQLmk0hxYpuIAccDSDBQrVYrAnhgnFIBmGSiXVJoBH6s4QBywJAPFSpUisDfGCQWgaQbKJZWmwIcqDhAHLM5AsVKlCOyLcUIBaJKBckmlCbBIxQHigEUZKFaqFIH9MU4oAI0zUC6pNAYWqjhAHLAgA8VKlSJwIMYJBaBRBsolFXHAfBUHiAPmZ6BYqVIEDsY4oQA0zEC5pNIQmKfiAHHAvAwUK1WKwKEYJxSABhkol1QaAHNVHCAOmJuBYqVKETgc44QCcG4GyiWVc4E5Kg4QB8zOQLFSpQgciXFCATg7A+WSytnALBUHiANmZqBYqVIEjsY4oQCclYFySeUs4B0VB4gDZmSgWJUqVapUqVKlSpX/Af8BF5B4LMYIrCEAAAAASUVORK5CYII="
  },
  "options": {
    "format": "Letter",
    "landscape": true
  }
}
```

##### Data Visualization Template

```json
{
  "jsxTemplate": "function Template(props) { const { title, data, summary, conclusion } = props; const maxValue = Math.max(...data.map(item => item.value)); return (<div className=\"page\"><div className=\"page-header text-center\"><h1 className=\"text-2xl font-bold\">{title}</h1><p className=\"text-gray-500\">Generated on: {new Date().toLocaleDateString()}</p></div><div className=\"my-4 p-4 border border-gray-200 rounded\"><h2 className=\"text-xl font-semibold\">Summary</h2><p className=\"my-2\">{summary}</p></div><div className=\"my-4\"><h2 className=\"text-xl font-semibold\">Data Analysis</h2><table className=\"table my-4\"><thead><tr className=\"bg-gray-100\"><th>Metric</th><th className=\"text-right\">Value</th></tr></thead><tbody>{data.map((item, index) => (<tr key={index}><td>{item.label}</td><td className=\"text-right\">{item.value.toLocaleString()}</td></tr>))}</tbody></table><div className=\"my-4 p-4 border border-gray-200 rounded\"><h3 className=\"font-semibold mb-2\">Data Visualization</h3><div className=\"flex flex-col gap-2\">{data.map((item, index) => (<div key={index} className=\"flex items-center gap-2\"><div className=\"w-full max-w-xs text-sm\">{item.label}:</div><div className=\"flex-1 h-6 bg-gray-100 rounded\"><div className=\"h-6 bg-blue-500 rounded\" style={{ width: `${(item.value / maxValue) * 100}%` }}></div></div><div className=\"w-16 text-right text-sm\">{item.value}</div></div>))}</div></div></div>{conclusion && (<div className=\"my-4 p-4 border border-gray-200 rounded\"><h2 className=\"text-xl font-semibold\">Conclusion</h2><p className=\"my-2\">{conclusion}</p></div>)}<div className=\"page-footer text-center\"><p>Generated with Dynamic JSX Templates</p></div></div>); }",
  "data": {
    "title": "Sales Performance by Product",
    "summary": "This report shows the sales performance of our top products for Q1 2024.",
    "data": [
      { "label": "Product A", value: 12500 },
      { "label": "Product B", value: 8700 },
      { "label": "Product C", value: 15000 },
      { "label": "Product D", value: 6500 },
      { "label": "Product E", value: 9800 }
    ],
    "conclusion": "Product C continues to be our best-selling product, while Product D needs additional marketing efforts to improve sales."
  },
  "options": {
    "format": "A4",
    "landscape": false,
    "margin": {
      "top": "0.75in",
      "right": "0.5in",
      "bottom": "0.75in",
      "left": "0.5in"
    }
  }
}
```

##### Invoice Template

```json
{
  "jsxTemplate": "function Template(props) { const { invoiceNumber, date, dueDate, customerName, customerAddress, items, notes, companyName, companyAddress, companyEmail, companyPhone } = props; const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0); const tax = subtotal * 0.1; const total = subtotal + tax; return (<div className=\"page\"><div className=\"page-header flex justify-between items-center\"><div><h1 className=\"text-2xl font-bold\">{companyName || 'Your Company'}</h1><p className=\"text-gray-500\">{companyAddress || '123 Business St, City, Country'}</p><p className=\"text-gray-500\">{companyEmail || 'contact@example.com'}</p><p className=\"text-gray-500\">{companyPhone || '+1 (555) 123-4567'}</p></div><div className=\"text-right\"><h2 className=\"text-xl font-bold\">INVOICE</h2><p><strong>Invoice #:</strong> {invoiceNumber}</p><p><strong>Date:</strong> {date}</p><p><strong>Due Date:</strong> {dueDate}</p></div></div><div className=\"my-4 p-4 border border-gray-200 rounded\"><h3 className=\"font-semibold\">Bill To:</h3><p className=\"font-bold\">{customerName}</p><p>{customerAddress}</p></div><table className=\"table\"><thead><tr className=\"bg-gray-100\"><th>Description</th><th className=\"text-right\">Quantity</th><th className=\"text-right\">Unit Price</th><th className=\"text-right\">Amount</th></tr></thead><tbody>{items.map((item, index) => (<tr key={index}><td>{item.description}</td><td className=\"text-right\">{item.quantity}</td><td className=\"text-right\">${item.unitPrice.toFixed(2)}</td><td className=\"text-right\">${(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody></table><div className=\"flex justify-end my-4\"><div className=\"w-full max-w-xs\"><div className=\"flex justify-between py-2\"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div><div className=\"flex justify-between py-2\"><span>Tax (10%):</span><span>${tax.toFixed(2)}</span></div><div className=\"flex justify-between py-2 font-bold\"><span>Total:</span><span>${total.toFixed(2)}</span></div></div></div>{notes && (<div className=\"my-4 p-4 border border-gray-200 rounded\"><h3 className=\"font-semibold\">Notes:</h3><p>{notes}</p></div>)}<div className=\"page-footer text-center\"><p>Thank you for your business!</p></div></div>); }",
  "data": {
    "invoiceNumber": "INV-2024-0001",
    "date": "2024-03-07",
    "dueDate": "2024-04-06",
    "customerName": "Acme Corporation",
    "customerAddress": "789 Industry Lane, Business Park, NY 10001",
    "items": [
      {
        "description": "Website Development",
        "quantity": 1,
        "unitPrice": 2500
      },
      {
        "description": "Logo Design",
        "quantity": 1,
        "unitPrice": 500
      },
      {
        "description": "Hosting (Annual)",
        "quantity": 1,
        "unitPrice": 300
      },
      {
        "description": "SEO Package",
        "quantity": 1,
        "unitPrice": 750
      }
    ],
    "notes": "Payment is due within 30 days. Please make checks payable to Digital Solutions Inc. or pay online at www.digitalsolutions.com/pay",
    "companyName": "Digital Solutions Inc.",
    "companyAddress": "456 Tech Avenue, Suite 100, San Francisco, CA 94107",
    "companyEmail": "billing@digitalsolutions.com",
    "companyPhone": "+1 (415) 555-7890"
  },
  "options": {
    "format": "Letter",
    "landscape": false
  }
}
```

#### Response

The response will be a PDF file with the `Content-Type: application/pdf` header.

### Get Available Components

```
GET /api/pdf/components
```

Returns information about the available components and their props.

#### Response

```json
{
  "components": [
    {
      "name": "InvoiceTemplate",
      "description": "Template for generating invoice PDFs",
      "props": {
        "invoiceNumber": { "type": "string", "required": true, "description": "Unique identifier for the invoice" },
        // ... other props
      }
    },
    {
      "name": "ReportTemplate",
      "description": "Template for generating report PDFs",
      "props": {
        "title": { "type": "string", "required": true, "description": "Title of the report" },
        // ... other props
      }
    }
  ]
}
```

## Development

To run the project in development mode with hot reloading:

```
npm run dev
```

To test the PDF generation:

```
npm test
```

To test the dynamic JSX template rendering:

```
npm run test:dynamic
```

## Extending the Project

### Adding New Templates

1. Create a new template file in the `src/templates` directory
2. Define the template interface and React component
3. Add a new route in `src/routes/pdfRoutes.ts` or extend the generic endpoint

### Creating Dynamic Templates

You can create dynamic templates by sending JSX code as a string to the `/api/pdf/render` endpoint. The JSX code should define a function component named `Template` that accepts props.

Example of a simple dynamic template:

```jsx
function Template(props) {
  const { title, content } = props;
  
  return (
    <div className="page">
      <div className="page-header text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="my-4 p-4 border border-gray-200 rounded">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      
      <div className="page-footer text-center">
        <p>Generated with JSX to PDF</p>
      </div>
    </div>
  );
}
```

### Customizing Styles

Modify the `src/public/styles.css` file to add or change the available CSS utility classes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
