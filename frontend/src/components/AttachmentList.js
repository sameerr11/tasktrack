import React, { useState } from 'react';
import { ListGroup, Button, Alert, Form, Card, ProgressBar } from 'react-bootstrap';
import { FaDownload, FaTrash, FaFileUpload, FaFile } from 'react-icons/fa';
import { taskAPI } from '../utils/api';
import FileTypeIcon from './FileTypeIcon';
import { useNotification } from '../context/NotificationContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

const AttachmentList = ({ taskId, attachments, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const { showNotification } = useNotification();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (selectedFile) {
      // Validate file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
        setFile(null);
        e.target.value = null; // Reset file input
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);
      
      // Create a mock progress simulation while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next; // Cap at 90% until actually complete
        });
      }, 300);
      
      try {
        await taskAPI.uploadAttachment(taskId, file);
      } catch (err) {
        // If we get an S3-related error, display a more helpful message
        if (err.message && (
            err.message.includes('AWS') || 
            err.message.includes('S3') || 
            err.message.includes('Access Key')
          )) {
          throw new Error('File storage service (S3) is not available. Please contact the administrator.');
        }
        throw err; // Re-throw if it's not an S3 error
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      showNotification('File uploaded successfully');
      setSuccess('File uploaded successfully');
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh attachments list
      if (onUpdate) onUpdate();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error details:', err);
      const errorMsg = err.message || 'Error uploading file';
      setError(errorMsg);
      showNotification(errorMsg, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        setError('');
        await taskAPI.deleteAttachment(taskId, attachmentId);
        showNotification('Attachment deleted successfully');
        setSuccess('Attachment deleted successfully');
        
        // Refresh attachments list
        if (onUpdate) onUpdate();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Error deleting attachment');
        showNotification('Error deleting attachment', 'danger');
      }
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Attachments</h4>
        <Form.Group className="d-flex align-items-center">
          <Form.Control
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="me-2"
          />
          <Button 
            variant="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : <><FaFileUpload /> Upload</>}
          </Button>
        </Form.Group>
      </Card.Header>
      
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {uploading && (
          <ProgressBar
            animated
            variant="info"
            now={uploadProgress}
            label={`${Math.round(uploadProgress)}%`}
            className="mb-3"
          />
        )}
        
        {attachments && attachments.length > 0 ? (
          <ListGroup variant="flush">
            {attachments.map((attachment) => (
              <ListGroup.Item 
                key={attachment.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    <FileTypeIcon fileType={attachment.fileType} size={24} />
                  </span>
                  {attachment.fileName}
                </div>
                <div>
                  <Button 
                    as="a" 
                    href={attachment.fileUrl} 
                    target="_blank" 
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <FaDownload /> Download
                  </Button>
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center p-3">
            <FaFile className="mb-2" size={30} />
            <p className="text-muted">No attachments yet. Upload files using the form above.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AttachmentList; 