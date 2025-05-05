const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Upload file to S3
const uploadToS3 = async (file, directory = 'attachments') => {
  try {
    // Create unique filename
    const fileKey = `${directory}/${uuidv4()}-${file.originalname}`;

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const response = await s3.upload(params).promise();

    return {
      fileName: file.originalname,
      fileUrl: response.Location,
      fileType: file.mimetype,
      s3Key: fileKey
    };
  } catch (error) {
    console.error('S3 upload error:', error.message);
    throw new Error('Error uploading file to S3');
  }
};

// Delete file from S3
const deleteFromS3 = async (s3Key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error.message);
    throw new Error('Error deleting file from S3');
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3
}; 