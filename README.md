⚖️ Legal Management System

Welcome to the Legal Management System, a modern, AI-powered web application built to streamline legal processes and improve access to justice for clients, lawyers, and administrators. Whether you're managing cases, consulting virtually, or seeking legal assistance, this system simplifies every step — securely and intelligently.






## 📽️ Demo Video

🎥 **Watch the Demo:**

- **Frontend:** [https://youtu.be/X-fwJ-rzPIY?si=rxmmBt1VZN7PoBuK](https://youtu.be/X-fwJ-rzPIY?si=rxmmBt1VZN7PoBuK)




🚀 Project Overview
The Legal Management System empowers legal professionals and clients through a feature-rich platform with:

🔐 Role-Based Access Control (Admin, Lawyer, Client)

📁 Case Submission & Management

💬 In-App Messaging & Notifications

📎 Secure Document Handling

🤖 AI-Powered Legal Guidance (OpenAI API)

📹 Virtual Consultations via Zoom/Google Meet

📊 Case Status Tracking & History

🌐 Multilingual Support



  
Screenshots::
  

📸 Home Page: Displays an overview of the system and login options.

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

![Screenshot 2025-04-16 224543](https://github.com/user-attachments/assets/d3f65cd3-73a7-4cf6-9045-5ccf3592f8a5)


Emails:
![WhatsApp Image 2025-04-16 at 22 31 09](https://github.com/user-attachments/assets/44f329af-6dce-441d-b323-e08022dd5185)

![WhatsApp Image 2025-04-16 at 22 31 09 (1)](https://github.com/user-attachments/assets/0c5f5e3a-f82c-49b9-9ab5-0c92c931168d)

![WhatsApp Image 2025-04-16 at 22 31 10](https://github.com/user-attachments/assets/cbdd1aeb-cf32-4f7a-bdcc-e90a67e5af5d)


🧰 Tech Stack

| Category        | Technologies                                  |
|----------------|-----------------------------------------------|
| 🎨 Frontend     | HTML, CSS, JavaScript                         |
| 🔧 Backend      | Spring Boot, Java 17, Hibernate               |
| 🔐 Authentication | JWT (JSON Web Tokens)                      |
| 🛡️ Security     | Spring Security                              |
| 🗄️ Database     | MySQL                                         |
| 📧 Email Service| JavaMail API                                  |
| 🗂️ Version Control | Git, GitHub                               |

Setup Instructions



🔧 Prerequisites

Node.js v16 or higher
Java v17 or higher
MySQL v8 or higher
Zoom/Google Meet API Keys
OpenAI API Key



⚙️ Backend Setup (Spring Boot)

# Clone the repository
git clone https://github.com/LakhiniVoshadee/Legal_Aid_Case_Management.git
cd legal-management-system/backend



🔑 Configure application.properties

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/legalAidCaseManagement
spring.datasource.username=yourusername
spring.datasource.password=yourpassword

# External APIs
zoom.api.key=your-zoom-api-key
openai.api.key=your-openai-api-key



▶️ Build & Run

mvn clean install
mvn spring-boot:run
📍 Backend runs at: http://localhost:8080



🗄️ Database Setup

Create a MySQL database:
CREATE DATABASE legalAidCaseManagement;

Ensure this is in your application.properties:
spring.jpa.hibernate.ddl-auto=update



💡 Future Enhancements

📌 Appointment calendar with time zone support
📝 AI-generated case summaries and document drafts
🔔 Push notifications via SMS/email
📊 Analytics Dashboard for Admins




© 2025 Legal Management System — Justice for All.
Built with ❤️ using Spring Boot & Bootrap.

