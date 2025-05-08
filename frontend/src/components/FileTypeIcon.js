import React from 'react';
import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAudio,
  FaFileVideo,
  FaFileCode,
  FaFileArchive,
  FaFileAlt
} from 'react-icons/fa';

const FileTypeIcon = ({ fileType, size = 16 }) => {
  if (!fileType) return <FaFile size={size} />;
  
  const type = fileType.toLowerCase();
  
  // Images
  if (type.includes('image')) {
    return <FaFileImage size={size} color="#28a745" />;
  }
  
  // PDFs
  if (type.includes('pdf')) {
    return <FaFilePdf size={size} color="#dc3545" />;
  }
  
  // Word documents
  if (type.includes('word') || type.includes('document') || type.includes('docx') || type.includes('doc')) {
    return <FaFileWord size={size} color="#0066cc" />;
  }
  
  // Excel spreadsheets
  if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xlsx') || type.includes('xls') || type.includes('csv')) {
    return <FaFileExcel size={size} color="#217346" />;
  }
  
  // PowerPoint
  if (type.includes('powerpoint') || type.includes('presentation') || type.includes('pptx') || type.includes('ppt')) {
    return <FaFilePowerpoint size={size} color="#d24726" />;
  }
  
  // Audio files
  if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
    return <FaFileAudio size={size} color="#007bff" />;
  }
  
  // Video files
  if (type.includes('video') || type.includes('mp4') || type.includes('mov')) {
    return <FaFileVideo size={size} color="#6f42c1" />;
  }
  
  // Code files
  if (type.includes('code') || type.includes('json') || type.includes('javascript') || type.includes('text/html')) {
    return <FaFileCode size={size} color="#e83e8c" />;
  }
  
  // Archives
  if (type.includes('zip') || type.includes('archive') || type.includes('compressed') || type.includes('tar') || type.includes('rar')) {
    return <FaFileArchive size={size} color="#fd7e14" />;
  }
  
  // Text files
  if (type.includes('text/plain') || type.includes('txt')) {
    return <FaFileAlt size={size} color="#6c757d" />;
  }
  
  // Default file icon
  return <FaFile size={size} color="#6c757d" />;
};

export default FileTypeIcon; 