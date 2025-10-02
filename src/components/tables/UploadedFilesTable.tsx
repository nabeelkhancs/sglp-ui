import React from 'react';
import moment from 'moment';
import { APICalls } from '@/api/api-calls';

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

const UploadedFilesTable: React.FC<UploadedFilesTableProps> = ({ files }) => {
  const [uploadDetails, setUploadDetails] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const ids = files.map(f => f.split('-')[0]);
    if (ids.length) {
      APICalls.getUploadsDetails(ids).then((data) => {

        setUploadDetails(data);
      }).catch(() => setUploadDetails({}));
    }
  }, [files]);

  const getFileUrl = (file: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(file)}`;
  return (
    <div style={{ margin: '24px 0' }}>
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
            const uploadedBy = uploadDetails.find((ud: any) => ud.fileHash === fileHash)?.uploadedbyname || '';
            
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
