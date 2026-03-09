# 🛍️ Jimmy's Secondhand Trade Platform

A full-stack second-hand goods trading platform with cloud deployment on AWS.

🌐 **Live Demo**: [https://d21nx2uemsx38f.cloudfront.net](https://d21nx2uemsx38f.cloudfront.net)

---

## ✨ Features

- 🔐 JWT-based user authentication & authorization
- 📦 Product listing with image upload
- 🔍 Search & filter by category
- 💬 Real-time messaging between buyers and sellers
- ⭐ Product reviews & comments
- ❤️ Favorites / wishlist
- 📱 Responsive mobile-first UI

---

## 🏗️ Architecture

```
User Browser
     │
     │ HTTPS
     ▼
CloudFront (CDN)          CloudFront (CDN)
Frontend HTTPS      ───▶  Backend HTTPS
     │                         │
     ▼                         ▼ HTTP:8080
S3 Bucket                  EC2 t4g.small
(HTML/CSS/JS)              (Java Backend)
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              RDS MySQL                S3 Bucket
            (Database)              (Image Storage)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|-----------|---------|
| React | 18 |
| TypeScript | 5 |
| Vite | 7 |
| Axios | - |
| Tailwind CSS | - |

### Backend
| Technology | Version |
|-----------|---------|
| Java | 21 |
| Spring Boot | 3.5 |
| Spring Security | - |
| MyBatis-Plus | 3.5.7 |
| MySQL | 8.4 |
| JWT | - |
| AWS SDK S3 | - |

### Cloud Infrastructure (AWS)
| Service | Usage |
|---------|-------|
| EC2 t4g.small (ARM) | Backend server |
| RDS MySQL 8.4 | Database |
| S3 | Frontend hosting + Image storage |
| CloudFront | CDN + HTTPS |
| IAM | Access management |
| VPC | Network security |

---

## 🚀 Deployment

### Prerequisites
- AWS Account
- Java 21
- Node.js 18+
- Maven

### Backend Deployment (EC2)
```bash
# SSH into EC2
ssh -i "key.pem" ec2-user@your-ec2-ip

# Run the application
java -jar app.jar \
  --spring.datasource.url="jdbc:mysql://your-rds-endpoint:3306/secondhand_trade" \
  --spring.datasource.username=admin \
  --spring.datasource.password=${DB_PASSWORD} \
  --app.s3.enabled=true \
  --app.s3.access-key=${AWS_ACCESS_KEY_ID} \
  --app.s3.secret-key=${AWS_SECRET_ACCESS_KEY} \
  --app.s3.region=eu-west-1 \
  --app.s3.bucket=your-bucket-name \
  --app.s3.base-url=https://your-cloudfront-domain.cloudfront.net \
  --server.port=8080
```

### Frontend Deployment (S3 + CloudFront)
```bash
# Set API endpoint
echo "VITE_API_BASE_URL=https://your-backend-cloudfront.cloudfront.net" > .env.production

# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete --region eu-west-1
```

---

## 🗄️ Database Schema

- `users` - User accounts
- `products` - Product listings
- `product_images` - Product image URLs
- `categories` - Product categories
- `messages` - User-to-user messages
- `comments` - Product comments
- `reviews` - User reviews
- `favorites` - User favorites

---

## 🔒 Security

- JWT token authentication
- Spring Security authorization
- HTTPS via CloudFront SSL
- RDS accessible only within VPC
- S3 bucket policy for controlled access
- IAM roles with least privilege

---

## 📁 Project Structure

```
jimmys-secondhand-trade/
├── backend/                 # Spring Boot application
│   └── src/main/java/com/secondhand/
│       ├── config/          # Security, S3, CORS config
│       ├── controller/      # REST API controllers
│       ├── service/         # Business logic
│       ├── mapper/          # MyBatis-Plus mappers
│       ├── entity/          # Database entities
│       └── filter/          # JWT auth filter
└── frontend/                # React application
    └── src/
        ├── components/      # Reusable UI components
        ├── pages/           # Page components
        ├── utils/           # API client, helpers
        └── types/           # TypeScript types
```

---

## 📧 Contact

**Jimmy Tang**
- GitHub: [@jimmyt-coder](https://github.com/jimmyt-coder)
