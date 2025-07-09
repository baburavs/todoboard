Full Stack Coding Assignment: Real-Time
Collaborative To-Do Board


• User Registration & Login:
Secure sign-up/login with hashed passwords and JWT-based authentication.
• Task API:
Tasks have title, description, assigned user, status (Todo, In Progress, Done), and priority.
• Real-Time Sync:
changes instantly.
Implement real-time updates using WebSockets (e.g., Socket.IO for Node.js) so all users see
• Action Logging:
Every change (add/edit/delete/assign/drag-drop) 

Login/Register Pages:
Custom-built forms (do not use Bootstrap or any form generator).
• Kanban Board:
Three columns: Todo, In Progress, Done.
Tasks can be dragged and dropped between columns and reassigned to any user.
• Activity Log Panel:
Shows last 20 actions; updates live.

Technology used--
 Frontend
1 React
2 @hello-pangea/dnd
3 Axios
4 Socket.IO Client

backend
1 Node.js
2 Express
3 MongoDB (via Mongoose)
4 Socket.IO Server
4 JWT for authentication

---


Start MongoDB (Atlas or local)
 Clone repo & setup .env files

#Backend
cd server
npm install
npm run dev

#Frontend
cd ../client
npm install
npm run dev