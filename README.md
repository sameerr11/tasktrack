# TaskTrack – AWS Cloud-Native Task Manager

## Features
- User registration/login with JWT
- Create/view/edit/delete tasks
- Upload task attachments (images/files)
- Responsive React frontend
- Deployed on AWS: EC2 (Docker), Elastic Beanstalk, RDS, S3

## Live URLs
- Frontend: https://tasktrack-client.elasticbeanstalk.com
- Backend: http://ec2-backend.amazonaws.com/api

## Deployment Guide
1. Deploy backend to EC2 using Docker
2. Configure RDS for MySQL/PostgreSQL
3. Setup S3 bucket for file storage
4. Deploy React frontend to Elastic Beanstalk
5. Link APIs via `.env`

## Architecture Diagram
[Insert Image]

## AWS Resources Used
- EC2, S3, RDS, IAM, VPC, Elastic Beanstalk

