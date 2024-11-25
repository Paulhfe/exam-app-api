# exam-app-api
Exam app backend with clean architecture

---

# **Exam Management System**

**Description:**  
This project is an Exam Management System built with TypeScript, Clean Architecture, and MongoDB. It provides functionalities for managing users, exams, and results. The system includes user registration, exam creation by admins, automated grading for objective exams, and profile management.

---

## **Features:**
- **User Registration and Authentication:**
  - Admin and user roles managed via unique identifiers.

- **Exam Management:**
  - Admins can create and manage exams.
  - Only authorized admins can add questions to exams.

- **Exam Participation:**
  - Users can enroll in exams.
  - Exams support both objective and subjective questions.

- **Automated Grading:**
  - Objective exams are graded automatically.
  - Results are calculated based on correct answers.

- **Profile Management:**
  - Users can upload profile pictures and manage their information.


---

## **Technologies Used:**
- **Backend:** Node.js and express with TypeScript
- **Database:** MongoDB with Mongoose v8.8.0
- **Other:** JWT, Nodemailer for email notifications

---

## **Installation:**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd your-repo
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**  
   Create a `.env` file and add the following:
   ```plaintext
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=set desired expiration time
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password(advised to create an app password so you dont need to add your real email password)
   ADMIN_EMAIL=seed_admin_email
   ADMIN_PASSWORD=seedadminpassword
   SEED_ADMIN_ID=seed_admin_id
   ```

---

## **Usage:**
1. **Start the server:**
   ```bash
   npm start
   ```
2. **Access the application:**
   ```plaintext
   http://localhost:5000
   ```

---

## **API Endpoints:**

### **User Endpoints:**
- **Register User:** `POST /api/user/register`  
  Payload: `{ email, password, fullName }`

- **Login User:** `POST /api/user/login`  
  Payload: `{ email, password }`  


### **Exam Endpoints:**
- **Create Exam (Admin only):** `POST /api/admin/exam/create`  
  Payload: `{ title, description, isObjective, passingScore, duration }`

- **Enroll in Exam:** `POST /api/user/exam/enroll`  
  Payload: `{ email, examId }`

- **Take Exam:** `POST /api/user/exam/take-exam`  
  Payload: `{ email, examId }`

- **Submit Exam:** `POST /api/user/exam/submit`  
  Payload: `{ email, examId, answers: [{ questionId, answer }] }`

- **Calculate Results:** `POST /api/user/exam/results/calculate`  
  Payload: `{ email, examId }`

### **Question Endpoints (Admin only):**
- **Add Questions to Exam:** `POST /api/admin/question/add`  
  Payload: `{ examId,
  questions: [{ questionText, options, correctAnswer }]
  ...}`
  you can add as many questions as possible
---

## **Use Cases:**
### **1. Register User**
- **Input:** Email, password, and full name.
- **Process:** Save user to the database.
- **Output:** Confirmation of user registration.

### **2. Login User**
- **Input:** Email and password.
- **Process:** Validate credentials.
- **Output:** JWT token upon successful login.

### **3. Create Exam (Admin Only)**
- **Input:** Exam details (title, description, etc.).
- **Process:** Create a new exam document in the database.
- **Output:** Exam creation confirmation.

### **4. Enroll in Exam**
- **Input:** User email and exam ID.
- **Process:** Add the exam to the user’s enrolled exams and increase the exam's enrollment count.
- **Output:** Confirmation of enrollment.

### **5. Take Exam**
- **Input:** User email and exam ID.
- **Process:** Fetch exam questions for the user.
- **Output:** Exam questions to be answered.

### **6. Submit Exam**
- **Input:** User email, exam ID, and answers.
- **Process:** Save exam attempt and calculate the score.
- **Output:** Confirmation of submission.

### **7. Calculate Results**
- **Input:** User email and exam ID.
- **Process:** Compare submitted answers with correct ones and calculate the score.
- **Output:** User’s score percentage.

---


---

## **License:**
This project is licensed under the MIT License.

---

## **Contact:**
For any inquiries or support, contact [julipaul2011@gmail.com].

---
