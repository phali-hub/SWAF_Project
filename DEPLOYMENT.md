# Deployment Guide (Free Tools)

This guide explains how to deploy the Smart WAF (SWAF) application using free cloud tools.

## Prerequisites
- A GitHub account.
- The project uploaded to a GitHub repository.

## 1. Database (Aiven)
We'll use [Aiven](https://aiven.io/) for a free MySQL database.

1. Sign up for a free Aiven account.
2. Create a **MySQL** service on the **Free Plan**.
3. Once the service is running, find the "Connection Information":
   - **Host**: e.g., `mysql-xxxx.aivencloud.com`
   - **Port**: `e.g., 24967`
   - **User**: `e.g., avnadmin`
   - **Password**: (copy the generated password)
   - **Database**: `defaultdb`
4. Use a tool like MySQL Workbench or `mysql` CLI to run the SQL commands in `Back-End/data/schema.sql` against your Aiven database to set up the tables.
5. **Create Admin User**: You need to insert at least one admin user to log in. Run this SQL (replace the hashed password):
   ```sql
   INSERT INTO users (username, password, role) VALUES ('admin', 'YOUR_HASHED_PASSWORD_HERE', 'admin');
   ```
   To get a hashed password, you can run the provided script locally:
   ```bash
   python Back-End/create_admin_hash.py yourpassword
   ```
6. **Important**: Download the CA Certificate (usually `ca.pem`) if Aiven requires SSL, though usually the standard driver handles it.

## 2. Back-End (Option A: Render - Easiest)
We'll use [Render](https://render.com/) to host the FastAPI backend.

1. Create a Render account and connect your GitHub repo.
2. Click **New +** > **Web Service**.
3. Select your repository.
4. Configure the service:
   - **Name**: `swaf-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r Back-End/requirements.txt`
   - **Start Command**: `cd Back-End && gunicorn app:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
5. Add **Environment Variables**:
   - `DB_HOST`: (Your Aiven host)
   - `DB_USER`: (Your Aiven user)
   - `DB_PASSWORD`: (Your Aiven password)
   - `DB_NAME`: `defaultdb`
   - `DB_PORT`: (Your Aiven port)
   - `JWT_SECRET`: (Generate a random string)
   - `ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app`
   - `TARGET_SERVER`: (The URL of the app you want to protect)

*Note: Render's free tier spins down after 15 minutes of inactivity.*

## 2. Back-End (Option B: Oracle Cloud - Pro/Always-On)
Oracle Cloud offers a very powerful "Always Free" tier with 24GB RAM and 4 CPUs (Ampere).

### 1. Set Up Oracle Instance
1. Sign up for [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/).
2. Create a **Compute Instance**.
   - **Image**: Ubuntu 22.04 or 24.04.
   - **Shape**: `VM.Standard.A1.Flex` (Ampere). Set 4 OCPUs and 24GB RAM.
   - **Networking**: Save the Private Key (.key) to your computer.
3. Once running, copy the **Public IP Address**.

### 2. Configure Firewall (Oracle Console)
1. Go to **Networking** > **Virtual Cloud Networks** > Click your VCN.
2. Click **Security Lists** > **Default Security List**.
3. Click **Add Ingress Rules**:
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Destination Port Range**: `5000`
   - **Description**: Allow SWAF Traffic.

### 3. Deploy with Docker
1. SSH into your instance: `ssh -i your-key.key ubuntu@YOUR_IP_ADDRESS`
2. Install Docker:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
3. Clone your repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
4. Create the `.env` file inside the `Back-End` folder and add your credentials.
5. Start the application:
   ```bash
   sudo docker-compose up -d --build
   ```
6. Open the server firewall:
   ```bash
   sudo ufw allow 5000
   sudo iptables -I INPUT -p tcp --dport 5000 -j ACCEPT
   ```

## 3. Front-End (Vercel)
We'll use [Vercel](https://vercel.com/) for the React frontend.

1. Create a Vercel account and connect your GitHub repo.
2. Click **Add New** > **Project**.
3. Select your repository.
4. Edit the **Root Directory** to `front-end`.
5. Add **Environment Variables**:
   - `REACT_APP_API_URL`: `http://YOUR_ORACLE_IP:5000` or `https://swaf-backend.onrender.com`
6. Click **Deploy**.

## 4. Final Connection
Once the frontend is deployed, copy its URL and go back to your Backend (Render Env Vars or `.env` on Oracle) to update the `ALLOWED_ORIGINS` environment variable so CORS allows requests from your Vercel URL.
