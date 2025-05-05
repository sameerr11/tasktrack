# TaskTrack – AWS Cloud-Native Task Manager

TaskTrack is a full-stack cloud-native task management application deployed on AWS. It allows users to create, track, and manage tasks with file attachments.

## Features
- User registration/login with JWT authentication
- Create/view/edit/delete tasks
- Task filtering, sorting, and pagination
- Upload task attachments (stored in S3)
- Responsive React frontend
- RESTful API with Node.js/Express backend
- MongoDB database (hosted on AWS RDS or MongoDB Atlas)
- Fully containerized application with Docker

## AWS Cloud Architecture
The application is deployed using the following AWS services:
- **EC2**: For hosting the backend API in Docker containers
- **Elastic Beanstalk**: For hosting the React frontend
- **RDS (or MongoDB Atlas)**: For the database
- **S3**: For storing file attachments
- **IAM**: For managing access permissions
- **VPC**: For network isolation and security

## Local Development

### Prerequisites
- Node.js (v14+)
- Docker and Docker Compose
- AWS account with appropriate permissions
- MongoDB (if running without Docker)

### Environment Setup
1. Clone the repository
   ```
   git clone https://github.com/your-username/tasktrack.git
   cd tasktrack
   ```

2. Create `.env` files for both backend and frontend
   ```
   # In backend/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tasktrack
   JWT_SECRET=your_jwt_secret_here
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-tasktrack-bucket

   # In frontend/.env
   REACT_APP_API_URL=http://localhost:5000
   ```

### Running with Docker Compose
```
docker-compose up
```
This will start MongoDB, backend, and frontend services. The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Running Without Docker
1. Start MongoDB
   ```
   mongod
   ```

2. Start Backend
   ```
   cd backend
   npm install
   npm run dev
   ```

3. Start Frontend
   ```
   cd frontend
   npm install
   npm start
   ```

## AWS Deployment Guide

### Backend Deployment to EC2
1. Launch an EC2 instance (t2.micro or larger)
2. Install Docker on the EC2 instance
3. Clone the repository on the instance
4. Set up environment variables
5. Build and run the Docker container
   ```
   docker build -t tasktrack-backend ./backend
   docker run -d -p 80:5000 --env-file ./backend/.env --name tasktrack-api tasktrack-backend
   ```

### Database Setup
1. Create a MongoDB database using RDS or MongoDB Atlas
2. Configure security groups to allow access from your EC2 instance
3. Update the `MONGODB_URI` in your backend environment variables

### S3 Bucket for Attachments
1. Create an S3 bucket for storing task attachments
2. Configure CORS to allow uploads from your frontend domain
3. Set up IAM permissions for your EC2 instance to access the bucket

### Frontend Deployment to Elastic Beanstalk
1. Install the AWS EB CLI
2. Create a new Elastic Beanstalk application
   ```
   cd frontend
   eb init
   eb create tasktrack-frontend
   ```
3. Configure environment variables for the frontend
4. Deploy the application
   ```
   npm run build
   eb deploy
   ```

## Project Structure
```
tasktrack/
│
├── backend/              # Node.js API
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── Dockerfile        # Docker configuration
│   ├── package.json      # Dependencies
│   └── server.js         # Entry point
│
├── frontend/             # React SPA
│   ├── public/           # Static files
│   ├── src/              # React components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main component
│   ├── .env              # Environment variables
│   ├── Dockerfile        # Docker configuration
│   └── package.json      # Dependencies
│
├── docker-compose.yml    # Docker Compose config
└── README.md             # Project documentation
```

## Technologies Used
- **Frontend**: React, React Bootstrap, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Cloud**: AWS (EC2, S3, RDS, Elastic Beanstalk)
- **DevOps**: Docker, Docker Compose, GitHub Actions (CI/CD)

## License
MIT
