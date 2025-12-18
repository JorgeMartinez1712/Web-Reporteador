import { useMemo, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import axiosInstance, { IMAGE_BASE_URL } from '../../api/axiosInstance';

const GenerateSalePDF = ({ saleData }) => {
  const [downloading, setDownloading] = useState(false);

  const fileUrl = useMemo(() => {
    const raw = saleData?.orden_file || saleData?.saleDetails?.orden_file || '';
    if (!raw) return '';
    const isAbsolute = /^https?:\/\//i.test(raw);
    if (isAbsolute) return raw;
    const base = IMAGE_BASE_URL || '';
    const baseClean = base.endsWith('/') ? base : `${base}/`;
    const pathClean = raw.startsWith('/') ? raw.slice(1) : raw;
    return `${baseClean}${pathClean}`;
  }, [saleData]);

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      setDownloading(true);
      const response = await axiosInstance.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const nameFromUrl = fileUrl.split('/').pop() || 'orden.pdf';
      a.href = url;
      a.download = nameFromUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      className="flex items-center justify-center bg-red-600 text-white w-12 h-12 rounded-full hover:bg-red-700 transition duration-300 disabled:opacity-50"
      onClick={handleDownload}
      disabled={downloading || !fileUrl}
      title={fileUrl ? 'Descargar orden' : 'Archivo no disponible'}
    >
      <FaFilePdf size={24} />
    </button>
  );
};

export default GenerateSalePDF;