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
      <div className='page-header flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>{companyName}</h1>
          <p className='text-gray-500'>{companyAddress}</p>
          <p className='text-gray-500'>{companyEmail}</p>
          <p className='text-gray-500'>{companyPhone}</p>
        </div>
        <div className='text-right'>
          <h2 className='text-xl font-bold'>INVOICE</h2>
          <p>
            <strong>Invoice #:</strong> {invoiceNumber}
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Due Date:</strong> {dueDate}
          </p>
        </div>
      </div>

      <div className='my-4 p-4 border border-gray-200 rounded'>
        <h3 className='font-semibold'>Bill To:</h3>
        <p className='font-bold'>{customerName}</p>
        <p>{customerAddress}</p>
      </div>

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

      {notes && (
        <div className='my-4 p-4 border border-gray-200 rounded'>
          <h3 className='font-semibold'>Notes:</h3>
          <p>{notes}</p>
        </div>
      )}

      <div className='page-footer text-center'>
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
