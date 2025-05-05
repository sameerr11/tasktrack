# TaskTrack – AWS Cloud-Native Task Manager

TaskTrack is a full-stack cloud-native task management application deployed on AWS. It allows users to create, track, and manage tasks with file attachments.

## Features
- User registration/login with JWT authentication
- Create/view/edit/delete tasks
- Task filtering, sorting, and pagination
- Upload task attachments (stored in S3)
- Responsive React frontend
- RESTful API with Node.js/Express backend
- PostgreSQL/MySQL database hosted on AWS RDS
- Fully containerized application with Docker

## AWS Cloud Architecture
The application is deployed using the following AWS services:
- **EC2**: For hosting the backend API in Docker containers
- **Elastic Beanstalk**: For hosting the React frontend
- **RDS**: For PostgreSQL/MySQL database
- **S3**: For storing file attachments
- **IAM**: For managing access permissions
- **VPC**: For network isolation and security

## Local Development

### Prerequisites
- Node.js (v14+)
- Docker and Docker Compose
- AWS account with appropriate permissions
- PostgreSQL or MySQL (if running without Docker)

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
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   
   # Database Configuration (PostgreSQL or MySQL)
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=tasktrack
   DB_USER=postgres
   DB_PASSWORD=your_database_password
   DB_RESET=false
   
   # AWS Configuration
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
This will start PostgreSQL, backend, and frontend services. The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Running Without Docker
1. Start PostgreSQL/MySQL Database
   - Make sure your database server is running
   - Create a new database named 'tasktrack'

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

### VPC Setup
1. Create a VPC with public and private subnets
   - Public subnet for load balancers
   - Private subnet for EC2 and RDS
   - NAT Gateway for outbound traffic from private subnet

2. Configure Security Groups
   - Backend SG: Allow inbound traffic on port 5000 from LB SG
   - RDS SG: Allow inbound traffic on DB port from Backend SG
   - LB SG: Allow inbound traffic on port 80/443 from internet

### Database Setup (RDS)
1. Create a PostgreSQL/MySQL RDS instance
   ```
   aws rds create-db-instance \
     --db-instance-identifier tasktrack-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password secret_password \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxxxxxxx \
     --db-subnet-group-name my-db-subnet-group
   ```

2. Configure the database
   - Create 'tasktrack' database
   - The application will automatically create tables on first run

### S3 Bucket for Attachments
1. Create an S3 bucket
   ```
   aws s3api create-bucket \
     --bucket your-tasktrack-bucket \
     --region us-east-1
   ```

2. Configure bucket policy for private access
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowAppAccess",
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/EC2-TaskTrack-Role"
         },
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-tasktrack-bucket/*"
       }
     ]
   }
   ```

3. Configure CORS
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://tasktrack-client.elasticbeanstalk.com"],
       "ExposeHeaders": []
     }
   ]
   ```

### Backend Deployment to EC2
1. Create IAM role for EC2 with policies:
   - AmazonS3ReadWrite (for file storage)
   - AmazonRDSReadWrite (for database access)

2. Launch an EC2 instance in private subnet
   - Use Amazon Linux 2 AMI
   - Assign IAM role created above
   - Configure security group

3. Install Docker on the EC2 instance
   ```
   ssh ec2-user@your-instance-ip
   sudo yum update -y
   sudo amazon-linux-extras install docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

4. Deploy the application
   ```
   git clone https://github.com/your-username/tasktrack.git
   cd tasktrack/backend
   
   # Create .env file with RDS & S3 settings
   echo "DB_HOST=your-rds-endpoint.rds.amazonaws.com" >> .env
   echo "DB_USER=postgres" >> .env
   echo "DB_PASSWORD=your-password" >> .env
   # Add other env variables...
   
   # Build and run the Docker container
   docker build -t tasktrack-backend .
   docker run -d -p 5000:5000 --env-file .env --name tasktrack-api tasktrack-backend
   ```

### Frontend Deployment to Elastic Beanstalk
1. Install the AWS EB CLI
   ```
   pip install awsebcli
   ```

2. Configure and deploy
   ```
   cd frontend
   
   # Create .env.production
   echo "REACT_APP_API_URL=http://your-load-balancer-url" > .env.production
   
   # Build the app
   npm run build
   
   # Initialize EB
   eb init --platform docker
   
   # Create the environment
   eb create tasktrack-frontend --elb-type application
   
   # Deploy
   eb deploy
   ```

### Security Considerations
1. IAM Roles - Use least privilege principle
   - EC2 roles for S3 and RDS access
   - Service roles for Elastic Beanstalk

2. Security Groups
   - Only open necessary ports
   - Use security group references to restrict access

3. HTTPS
   - Create ACM certificate
   - Configure ALB to use HTTPS
   - Redirect HTTP to HTTPS

4. Database Security
   - Use strong password policies
   - Enable encryption at rest
   - Schedule regular backups

## Project Structure
```
tasktrack/
│
├── backend/              # Node.js API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Sequelize models
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
- **Backend**: Node.js, Express, Sequelize ORM, JWT
- **Database**: PostgreSQL/MySQL on RDS
- **Cloud**: AWS (EC2, S3, RDS, Elastic Beanstalk, VPC, IAM)
- **DevOps**: Docker, Docker Compose

## License
MIT
