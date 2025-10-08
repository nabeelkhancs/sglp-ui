import React from 'react';
import moment from 'moment';
import { APICalls } from '@/api/api-calls';
import { PDFDocument, rgb } from 'pdf-lib';

interface UploadedFilesTableProps {
  files: string[];
}

function parseFileInfo(file: string) {
  let uploadedOn = '';
  let fileHash = file.split('-')[0];
  let filename = file;
  const dashIdx = file.indexOf('-');
  const underscoreIdx = file.indexOf('_');
  let id = file;
  if (dashIdx !== -1) {
    filename = file.slice(dashIdx + 1);
    id = file.slice(0, dashIdx);
  }
  if (underscoreIdx !== -1) {
    uploadedOn = file.slice(0, underscoreIdx);
    id = file.slice(0, underscoreIdx);
  } else if (dashIdx !== -1) {
    uploadedOn = file.slice(0, dashIdx);
  }
  let formattedDate = uploadedOn;
  if (/^\d{8}$/.test(uploadedOn)) {
    formattedDate = `${uploadedOn.slice(0,4)}-${uploadedOn.slice(4,6)}-${uploadedOn.slice(6,8)}`;
  } else if (/^\d{8}\d{6}$/.test(uploadedOn)) {
    formattedDate = `${uploadedOn.slice(0,4)}-${uploadedOn.slice(4,6)}-${uploadedOn.slice(6,8)} ${uploadedOn.slice(8,10)}:${uploadedOn.slice(10,12)}:${uploadedOn.slice(12,14)}`;
  }
  return { filename, uploadedOn: formattedDate, id, fileHash };
}

const fetchBlob = async (url: string) => {
  const response = await fetch(url);
  return await response.blob();
};

const isImageFile = (file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file);
const isPdfFile = (file: string) => /\.(pdf)$/i.test(file);

const UploadedFilesTable: React.FC<UploadedFilesTableProps> = ({ files }) => {
  const [uploadDetails, setUploadDetails] = React.useState<Record<string, any>>({});
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    const ids = files.map(f => f.split('-')[0]);
    if (ids.length) {
      APICalls.getUploadsDetails(ids).then((data) => {
        setUploadDetails(data);
      }).catch(() => setUploadDetails({}));
    }
  }, [files]);

  const getFileUrl = (file: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(file)}`;

  const handleDownloadMergedPdf = async () => {
    setDownloading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const url = getFileUrl(file);
        if (isImageFile(file)) {
          const imgBlob = await fetchBlob(url);
          const imgBytes = await imgBlob.arrayBuffer();
          let img;
          if (file.match(/\.png$/i)) {
            img = await pdfDoc.embedPng(imgBytes);
          } else {
            img = await pdfDoc.embedJpg(imgBytes);
          }
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else if (isPdfFile(file)) {
          const pdfBlob = await fetchBlob(url);
          const pdfBytes = await pdfBlob.arrayBuffer();
          const donorPdf = await PDFDocument.load(pdfBytes);
          const donorPages = await pdfDoc.copyPages(donorPdf, donorPdf.getPageIndices());
          donorPages.forEach((p) => pdfDoc.addPage(p));
        }
      }
      const mergedPdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged_files.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to merge and download PDF.');
    }
    setDownloading(false);
  };

  return (
    <div style={{ margin: '24px 0' }}>
      {/* <button
        type="button"
        style={{ marginBottom: 16, background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', cursor: 'pointer', fontSize: 15 }}
        onClick={handleDownloadMergedPdf}
        disabled={downloading}
      >
        {downloading ? 'Preparing PDF...' : 'Download PDF'}
      </button> */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '8px', border: '1px solid #eee', textAlign: 'left' }}>Filename</th>
            <th style={{ padding: '8px', border: '1px solid #eee', textAlign: 'left' }}>Uploaded On</th>
            <th style={{ padding: '8px', border: '1px solid #eee', textAlign: 'left' }}>Uploaded By</th>
            <th style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>View</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, idx) => {
            const { filename, uploadedOn, fileHash } = parseFileInfo(file);
            let formattedUploadedOn = moment((Number(uploadedOn))).format("DD/MM/YYYY hh:mm A");
            console.log("uploadedDetails", uploadDetails,);
            const uploadedBy = uploadDetails.length && uploadDetails.find((ud: any) => ud.fileHash === fileHash)?.uploadedbyname || '';
            
            return (
              <tr key={file + idx}>
                <td style={{ padding: '8px', border: '1px solid #eee', wordBreak: 'break-all' }}>{filename}</td>
                <td style={{ padding: '8px', border: '1px solid #eee' }}>{formattedUploadedOn}</td>
                <td style={{ padding: '8px', border: '1px solid #eee' }}>{uploadedBy}</td>
                <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    title="View file"
                    onClick={() => window.open(getFileUrl(file), '_blank')}
                  >
                    <img src="/icons/view-icon.svg" alt="View" style={{ width: 22, height: 22 }} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UploadedFilesTable;
