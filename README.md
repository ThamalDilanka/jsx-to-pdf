# JSX to PDF Generator

A lightweight proof-of-concept (PoC) for a PDF generation service using Express.js and JSX (React components) to define dynamic templates. The service renders JSX templates server-side and generates PDFs using Puppeteer, all without a database connection.

## Features

- Server-side rendering of React JSX templates
- PDF generation using Puppeteer
- Tailwind-like CSS styling
- Multiple template types (Invoice, Report)
- RESTful API endpoints for PDF generation

## Technology Stack

- **Backend**: Node.js with Express.js for the API server
- **PDF Generation**: Puppeteer to render HTML and generate PDFs
- **Templating**: React (server-side rendering with react-dom/server) for dynamic templates
- **Styling**: Tailwind-like CSS classes in a static file

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
| options.margin        | object  | No       | Page margins                                                    |
| options.margin.top    | string  | No       | Top margin (defaults to "0.5in")                                |
| options.margin.right  | string  | No       | Right margin (defaults to "0.5in")                              |
| options.margin.bottom | string  | No       | Bottom margin (defaults to "0.5in")                             |
| options.margin.left   | string  | No       | Left margin (defaults to "0.5in")                               |

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

## Development

To run the project in development mode with hot reloading:

```
npm run dev
```

## Extending the Project

### Adding New Templates

1. Create a new template file in the `src/templates` directory
2. Define the template interface and React component
3. Add a new route in `src/routes/pdfRoutes.ts` or extend the generic endpoint

### Customizing Styles

Modify the `src/public/styles.css` file to add or change the available CSS utility classes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
