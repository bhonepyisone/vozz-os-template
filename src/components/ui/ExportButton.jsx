// FILE: src/components/ui/ExportButton.jsx

'use client';

import { CSVLink } from 'react-csv';
import NeumorphismButton from './NeumorphismButton';
import { Download } from 'lucide-react';

export default function ExportButton({ data, filename, headers }) {
  // Ensure data is always an array
  const exportData = Array.isArray(data) ? data : [];

  return (
    <CSVLink
      data={exportData}
      headers={headers}
      filename={filename}
      className="no-underline"
      target="_blank"
    >
      <NeumorphismButton className="!w-auto !px-4 !py-2 !text-xs">
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </NeumorphismButton>
    </CSVLink>
  );
}
