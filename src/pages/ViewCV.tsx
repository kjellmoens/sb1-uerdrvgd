import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Download, Share, Check, Settings } from 'lucide-react';
import { useCV } from '../contexts/CVContext';
import Button from '../components/ui/Button';
import CVPreview from '../components/cv/CVPreview';
import CVFlagsConfig from '../components/cv/CVFlagsConfig';
import html2pdf from 'html2pdf.js';
import { CVPreviewFlags } from '../types';

const ViewCV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCV } = useCV();
  const navigate = useNavigate();
  const cvRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [flags, setFlags] = useState<CVPreviewFlags>({
    showTrainingDescription: false,
    showProjectDescription: true,
    showEducationDescription: true,
    showWorkDescription: true,
    showCompanyDescription: true,
    showBirthdate: true,
    showNationality: true,
    showRelationshipStatus: true,
    showStreetAddress: false,
    showPhone: true,
    showEmail: true,
    showMiddleName: false
  });
  
  const cv = getCV(id || '');

  useEffect(() => {
    if (!cv) {
      navigate('/');
    }
  }, [cv, navigate]);
  
  if (!cv) return null;

  const handleDownload = async () => {
    if (!cvRef.current) return;

    setDownloading(true);

    const element = cvRef.current;
    const opt = {
      margin: [10, 10],
      filename: `${cv.personalInfo.firstName}_${cv.personalInfo.lastName}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getCVTitle = () => {
    if (cv.personalInfo.firstName && cv.personalInfo.lastName) {
      return `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}'s CV`;
    }
    return 'CV Preview';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={18} />}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">{getCVTitle()}</h1>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings size={18} />}
          >
            Display Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit/${cv.id}`)}
            icon={<Edit size={18} />}
          >
            Edit
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={downloading}
            icon={downloadSuccess ? <Check size={18} /> : <Download size={18} />}
          >
            {downloading ? 'Generating PDF...' : downloadSuccess ? 'Downloaded!' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {showSettings && (
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CVFlagsConfig flags={flags} onChange={setFlags} />
            </div>
          </div>
        )}
        
        <div className={showSettings ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className="mb-10" ref={cvRef}>
            <CVPreview cv={cv} flags={flags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCV;