# Customer Enquiry Categorization with AWS Bedrock

This project is a Node.js backend application that categorizes customer enquiries into **category** and **priority** using **Amazon Bedrock** (Titan Text Express model). It demonstrates how to integrate AWS Bedrock with Node.js for structured text classification.

---

## Features

- Categorizes customer enquiries into:
  - **Category:** `sales | support | billing | general`
  - **Priority:** `urgent | medium | low`
- Uses **AWS Bedrock Titan Text Express** (`amazon.titan-text-express-v1`) for natural language processing.
- Returns structured JSON output for easy integration with other systems.
- Result is then stored in MySQL database using  **AWS RDS**
- The complete system is hosted on **AWS EC2**

## Working 
<img width="1489" height="490" alt="image" src="https://github.com/user-attachments/assets/6865fcd5-9ac2-423f-ba34-3a9486adf2e3" />

## Tech stack
- nodejs
- expressjs
- Mysql 
- AWS EC2
- AWS RDS
- AWS bedrocks
  
## Prerequisites

- Node.js >= 18
- npm or yarn
- AWS account with **Bedrock access**
- AWS credentials with `AmazonBedrockFullAccess`
- AWS RDS
- AWS EC2

## Installation
1. git clone <repo-url>
2. cd backend
3. npm install
4. node index.js

## Environmental Setup
- AWS_ACCESS_KEY_ID= users-access-key
- AWS_SECRET_ACCESS_KEY= users-secret-key
- AWS_REGION=us-east-1
- MY_SQL_HOST= database-hostname
- MY_SQL_USER= database-username
- MY_SQL_PASSWORD= database-password
- MY_SQL_DATABASE= database-name

## Implementation guide
- The application only has **.post** http method. 
- Inputs: username , email , message
