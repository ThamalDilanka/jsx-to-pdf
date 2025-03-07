import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface ReportProps {
  title: string;
  date: string;
  author: string;
  summary: string;
  data: DataPoint[];
  conclusion?: string;
  companyName?: string;
  companyLogo?: string;
}

const ReportTemplate: React.FC<ReportProps> = ({
  title,
  date,
  author,
  summary,
  data,
  conclusion = '',
  companyName = 'Your Company Name',
}) => {
  // Find the highest value for scaling the chart
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className='page'>
      <div className='page-header text-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-gray-500'>{companyName}</p>
        <p className='text-gray-500'>Date: {date}</p>
        <p className='text-gray-500'>Prepared by: {author}</p>
      </div>

      <div className='my-4 p-4 border border-gray-200 rounded'>
        <h2 className='text-xl font-semibold'>Executive Summary</h2>
        <p className='my-2'>{summary}</p>
      </div>

      <div className='my-4'>
        <h2 className='text-xl font-semibold'>Data Analysis</h2>

        <table className='table my-4'>
          <thead>
            <tr className='bg-gray-100'>
              <th>Metric</th>
              <th className='text-right'>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td className='text-right'>{item.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Simple bar chart visualization */}
        <div className='my-4 p-4 border border-gray-200 rounded'>
          <h3 className='font-semibold mb-2'>Data Visualization</h3>
          <div className='flex flex-col gap-2'>
            {data.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div className='w-full max-w-xs text-sm'>{item.label}:</div>
                <div className='flex-1 h-6 bg-gray-100 rounded'>
                  <div className='h-6 bg-blue-500 rounded' style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                </div>
                <div className='w-16 text-right text-sm'>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {conclusion && (
        <div className='my-4 p-4 border border-gray-200 rounded'>
          <h2 className='text-xl font-semibold'>Conclusion</h2>
          <p className='my-2'>{conclusion}</p>
        </div>
      )}

      <div className='page-footer text-center'>
        <p>
          Confidential - {companyName} - {date}
        </p>
      </div>
    </div>
  );
};

export default ReportTemplate;
