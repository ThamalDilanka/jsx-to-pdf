import fs from 'fs';
import path from 'path';
import { generatePdfFromJsxString } from './utils/pdfGenerator';

async function testDynamicJsxRendering() {
  console.log('Testing dynamic JSX template rendering...');

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Simple JSX template as a string
  const simpleJsxTemplate = `
    function Template(props) {
      const { title, content, author, date } = props;
      
      return (
        <div className="page">
          <div className="page-header text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">Date: {date}</p>
            <p className="text-gray-500">Author: {author}</p>
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
  `;

  // Data for the template
  const templateData = {
    title: 'Dynamic JSX Template Test',
    date: new Date().toISOString().split('T')[0],
    author: 'Test Script',
    content: `
      <h2 class="text-xl font-semibold">This is a dynamic JSX template</h2>
      <p class="my-2">This PDF was generated from a JSX string passed directly to the PDF generator.</p>
      <ul class="my-4">
        <li>✅ Dynamic JSX templates</li>
        <li>✅ Custom data injection</li>
        <li>✅ HTML content support</li>
        <li>✅ Styling with utility classes</li>
      </ul>
    `,
  };

  try {
    console.log('Generating PDF from dynamic JSX template...');

    // Generate PDF from JSX string
    const pdfBuffer = await generatePdfFromJsxString(simpleJsxTemplate, templateData, {
      filename: 'Dynamic-Template-Test.pdf',
    });

    // Save the PDF
    fs.writeFileSync(path.join(outputDir, 'dynamic-template-test.pdf'), pdfBuffer);
    console.log('Dynamic template PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF from dynamic JSX template:', error);
  }

  // Complex JSX template with data visualization
  const complexJsxTemplate = `
    function Template(props) {
      const { title, data, summary, conclusion } = props;
      
      // Find the highest value for scaling the chart
      const maxValue = Math.max(...data.map(item => item.value));
      
      return (
        <div className="page">
          <div className="page-header text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="my-4 p-4 border border-gray-200 rounded">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="my-2">{summary}</p>
          </div>
          
          <div className="my-4">
            <h2 className="text-xl font-semibold">Data Analysis</h2>
            
            <table className="table my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th>Metric</th>
                  <th className="text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.label}</td>
                    <td className="text-right">{item.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="my-4 p-4 border border-gray-200 rounded">
              <h3 className="font-semibold mb-2">Data Visualization</h3>
              <div className="flex flex-col gap-2">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-full max-w-xs text-sm">{item.label}:</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded">
                      <div 
                        className="h-6 bg-blue-500 rounded" 
                        style={{ width: \`\${(item.value / maxValue) * 100}%\` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {conclusion && (
            <div className="my-4 p-4 border border-gray-200 rounded">
              <h2 className="text-xl font-semibold">Conclusion</h2>
              <p className="my-2">{conclusion}</p>
            </div>
          )}
          
          <div className="page-footer text-center">
            <p>Generated with Dynamic JSX Templates</p>
          </div>
        </div>
      );
    }
  `;

  // Data for the complex template
  const complexData = {
    title: 'Dynamic Data Visualization Report',
    summary: 'This report demonstrates the ability to create complex data visualizations using dynamic JSX templates.',
    data: [
      { label: 'Product A', value: 1250 },
      { label: 'Product B', value: 870 },
      { label: 'Product C', value: 1500 },
      { label: 'Product D', value: 650 },
      { label: 'Product E', value: 980 },
    ],
    conclusion:
      'The dynamic template system allows for creating sophisticated reports with data visualizations on the fly.',
  };

  try {
    console.log('Generating PDF from complex dynamic JSX template...');

    // Generate PDF from JSX string
    const pdfBuffer = await generatePdfFromJsxString(complexJsxTemplate, complexData, {
      filename: 'Complex-Dynamic-Template.pdf',
    });

    // Save the PDF
    fs.writeFileSync(path.join(outputDir, 'complex-dynamic-template.pdf'), pdfBuffer);
    console.log('Complex dynamic template PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF from complex dynamic JSX template:', error);
  }

  console.log('Dynamic JSX template tests completed!');
}

testDynamicJsxRendering().catch(console.error);
