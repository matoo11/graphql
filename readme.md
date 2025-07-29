````markdown
# 📊 GraphQL Profile Dashboard

A web application that allows authenticated users to view their personal school-related statistics using a **GraphQL API**. The dashboard provides visual insights through custom **SVG-based graphs** and includes authentication using **JWT tokens**.

---

## 🚀 Project Overview

This project helps users learn and interact with GraphQL by building their own profile page powered by real-time queries. The application enables:

- User authentication with email/username and password
- Data retrieval through GraphQL queries (standard, nested, with arguments)
- Profile information display (e.g., XP, grades, project stats)
- Data visualization using **SVG** and **ApexCharts**
- Secure token-based access to user-specific data
- Hosting via a static deployment platform (GitHub Pages, Netlify, etc.)

---

## 🧑‍💻 Features

- ✅ Login with email or username (JWT-based)
- ✅ Protected GraphQL queries for authenticated users
- ✅ Fetch and display personalized data:
  - XP progress
  - Audit ratios
  - Project grades
- ✅ Graphs generated using **SVG** and **ApexCharts**
- ✅ Fully responsive and accessible UI
- ✅ Logout functionality
- ✅ Hosted for easy access and sharing

---

## 🔐 Authentication

Authentication is handled via a `/signin` endpoint, using **Basic Auth** with credentials encoded in Base64. After login, a **JWT token** is saved and attached to every GraphQL request using **Bearer Authorization**.

---

## 🔎 GraphQL Queries Used

This app uses three major types of GraphQL querying:

1. **Standard Queries**: Fetch direct fields (e.g., user ID, login)
2. **Nested Queries**: Access related tables like user → result
3. **Queries with Arguments**: Use filters like `where: {id: {_eq: ID}}`

### Examples

```graphql
{
  user {
    id
    login
  }
}
````

```graphql
{
  result {
    user {
      id
      login
    }
  }
}
```

---

## 📈 Graphs & Visualization

All charts are rendered using **SVG** and **[ApexCharts](https://apexcharts.com/)** to create visually rich and responsive statistics.

Included charts:

* 📉 XP earned over time
* ✅❌ Pass/Fail ratio of projects

---

## 🛠️ Tech Stack

* HTML, CSS, JavaScript (Vanilla)
* GraphQL (custom endpoint)
* JWT for secure access
* SVG and ApexCharts for graph rendering
* Optional: Netlify / GitHub Pages for deployment

---

## 📂 Project Structure

*To be added...*

---




## ▶️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://learn.reboot01.com/git/alimahdi/graphql.git
cd graphql
```

### 2. Open with Live Server

> You need VS Code with the [Live Server extension] installed.

1. Open the folder in VS Code
2. Right-click `index.html` (or `login.html`)
3. Select **“Open with Live Server”**
4. The browser should open at `http://127.0.0.1:5500/` (or another port)

---

## 📚 Learning Outcomes

* Hands-on practice with **GraphQL querying**
* Understanding **JWT-based authentication**
* SVG + ApexCharts for data visualization
* Building secure, personalized interfaces
* Hosting static frontend applications

---

## 📬 Contact

For any issues, suggestions, or contributions, feel free to open a pull request or message me via the Reboot01 platform.



