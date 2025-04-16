Legal Management System
Project Description
The Legal Management System is a web-based application designed to streamline legal operations for clients, lawyers, and administrators. It provides user authentication, case management, communication tools, secure legal document handling, and AI-powered legal guidance. Key features include role-based access, case status tracking, in-app messaging, virtual consultations, and document verification using OCR technology.
Screenshots
Below are some key features of the application:

Home Page: 
![Screenshot 2025-04-16 185344](https://github.com/user-attachments/assets/6e2bde9a-ef94-4de5-a4f5-5ec5eb6be2c6)


SignIn Page:
![Screenshot 2025-04-16 185328](https://github.com/user-attachments/assets/4b9ce1fc-39d0-4813-abfb-1cb862738818)

SignUp Page:

![Screenshot 2025-04-16 185457](https://github.com/user-attachments/assets/128c81eb-e7e7-4c1b-aa42-6ec79739603a)

![Screenshot 2025-04-16 185444](https://github.com/user-attachments/assets/ee1a56d0-3076-402c-9dfa-695d7dad07ab)

Admin Profile:
![Screenshot 2025-04-16 190158](https://github.com/user-attachments/assets/7dce374e-44de-4c69-b1cd-45716f8b7b8d)

![Screenshot 2025-04-16 190216](https://github.com/user-attachments/assets/72320df9-6227-4488-9478-088d1a4e4f4f)

![Screenshot 2025-04-16 190233](https://github.com/user-attachments/assets/7fd3eb3f-9f73-4e34-975a-d84e1b06b98a)

![Screenshot 2025-04-16 190313](https://github.com/user-attachments/assets/e8846ff9-1d5e-490c-996c-ec8bc62f5ac9)

![Screenshot 2025-04-16 190344](https://github.com/user-attachments/assets/5406147f-2772-41c1-b9f3-59958dc1d170)

![Screenshot 2025-04-16 190418](https://github.com/user-attachments/assets/32a4ac2d-26fe-494a-bc04-ebead118be4d)

Lawyer Profile:
![Screenshot 2025-04-16 221448](https://github.com/user-attachments/assets/23d8c3f7-5694-4d31-bb85-2c731a29379b)

![Screenshot 2025-04-16 221504](https://github.com/user-attachments/assets/bcbc2aeb-4769-4351-ab30-2926f5968239)

![Screenshot 2025-04-16 221759](https://github.com/user-attachments/assets/049eb28d-2803-4f84-be56-7ee8b5c0086e)

![Screenshot 2025-04-16 221919](https://github.com/user-attachments/assets/1188cf35-99a6-4fd7-9668-40a15b193d5c)

Client Profile:
![Screenshot 2025-04-16 222252](https://github.com/user-attachments/assets/33e1a554-81e1-4c25-83b1-c11dcf0abe12)

![Screenshot 2025-04-16 222329](https://github.com/user-attachments/assets/c19c44d7-c6b7-4121-87cf-c905efee3200)

![Screenshot 2025-04-16 222536](https://github.com/user-attachments/assets/a753dbbf-d2ee-4a9b-bb35-87d989b18573)

![Screenshot 2025-04-16 222611](https://github.com/user-attachments/assets/9794dad4-d556-461e-876b-a10d9b243976)

![Screenshot 2025-04-16 222729](https://github.com/user-attachments/assets/3768124f-3c6f-4cc9-bbc5-05862b4050c8)

![Screenshot 2025-04-16 215554](https://github.com/user-attachments/assets/60e4678b-4f5e-4e5a-bfa2-e60f1933054f)

Emails:
![WhatsApp Image 2025-04-16 at 22 31 09](https://github.com/user-attachments/assets/44f329af-6dce-441d-b323-e08022dd5185)

![WhatsApp Image 2025-04-16 at 22 31 09 (1)](https://github.com/user-attachments/assets/0c5f5e3a-f82c-49b9-9ab5-0c92c931168d)

![WhatsApp Image 2025-04-16 at 22 31 10](https://github.com/user-attachments/assets/cbdd1aeb-cf32-4f7a-bdcc-e90a67e5af5d)




Dashboard: Shows user-specific data (cases, messages, appointments).

Case Submission Form: Allows clients to submit new cases.

Document Upload Page: Interface for uploading and verifying legal documents.


Setup Instructions
Prerequisites

Node.js (v16 or higher) for the frontend
Java (v17 or higher) for the backend (Spring Security)
MySQL (v8 or higher) for the database
Zoom/Google Meet API keys for virtual consultations
OpenAI API key for AI-powered legal guidance

Backend Setup (Spring Boot)

Clone the repository:git clone https://github.com/yourusername/legal-management-system.git
cd legal-management-system/backend


Configure the database in application.properties:spring.datasource.url=jdbc:mysql://localhost:3306/legal_db
spring.datasource.username=yourusername
spring.datasource.password=yourpassword


Add API keys in application.properties:zoom.api.key=your-zoom-api-key
openai.api.key=your-openai-api-key


Build and run the backend:mvn clean install
mvn spring-boot:run

The backend will run on http://localhost:8080.

Frontend Setup (React)

Navigate to the frontend directory:cd legal-management-system/frontend


Install dependencies:npm install


Configure environment variables in .env:REACT_APP_API_URL=http://localhost:8080/api


Start the frontend:npm start

The frontend will run on http://localhost:3000.

Database Setup

Create a MySQL database:CREATE DATABASE legal_db;


The Spring Boot application will automatically create the required tables on startup (if JPA is configured with spring.jpa.hibernate.ddl-auto=update).

Link to the Demo Video
LegalManagementSystem_Demo.mp4
