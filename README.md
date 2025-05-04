# Judge Server For Education

This repository contains the code for a Judge Server designed for educational purposes.
Its main goal is to provide a platform where students can submit their programming code and receive automated feedback on whether their solution is correct based on predefined test cases.

Key Features:

- Code Submission \
    Students can submit their source code through the web interface.
- Automated Judging \
    The server automatically compiles and runs the submitted code against various test cases.
- Detailed Results \
    Users can view the results for each test case, including the program's output and the expected output.
- Output Comparison \
    For incorrect answers, a diff viewer helps users easily see the differences between their output and the expected output.
- User Authentication \
    A system is in place to manage user accounts and access.

## Demo

<https://github.com/user-attachments/assets/a9f28957-b03c-4ebf-a9c8-72648cf16f9d>

## Tech Stack

### Frontend

- Language: TypeScript
- Framework: React
- UI Library: Chakra UI

### Backend

- Language: Python
- Web Framework: FastAPI
- ASGI Server: Uvicorn
- Database Interaction: SQLAlchemy
- User Authentication: JWT

### Database

- Database: PostgreSQL

### Infrastructure & Deployment

- Containerization: Docker
- Deployment Automation: Terraform
- Cloud Platform: Google Cloud Platform (GCP)

## Requirements

You need to install the following packages:

- Python 3.12

```
% sudo port install python312
% port installed python312
The following ports are currently installed:
  python312 @3.12.9_0+lto+optimizations (active)
```

- typescript

```
% sudo port install typescript
% port installed typescript
The following ports are currently installed:
  typescript @5.7.2_0 (active)
```

- nodejs

```
% sudo port install nodejs
% port installed nodejs
The following ports are currently installed:
  nodejs20 @20.18.1_1 (active)
```

- docker, docker-compose

```
% docker --version
Docker version 27.4.0, build bde2b89
% docker-compose --version
Docker Compose version v2.31.0-desktop.2
```

## About `.env` file

You need to create a `.env` file in the root directory of the project. You can use the `.env.example` file as a template. The `.env` file should contain the following variables:

## Getting Started

Firstly, you need to clone the repository:

```zsh
git clone https://github.com/nometoko/JudgeServerforEducation.git
cd JudgeServerforEducation
```

Then, you need to create a virtual environment and install the required packages:

```
cd frontend
npm install
```

Then, you need to build the frontend and deploy into the backend:

```zsh
npm run build
cp -r dist/* ../backend/static/js
```

## Launching the server

You can launch the server using the following command:

```zsh
# back to project root
cd ..
source .env
docker-compose up --build
```

This will start the server and the database. You can access the server at `http://localhost:8080`.

## Deploying the server

If you want to deploy the server on GCP, you can use the `terraform` directory. You need to create a `terraform.tfvars` file in the `terraform` directory. You can use the `terraform.tfvars.example` file as a template. The `terraform.tfvars` file should contain the following variables:

```zsh
cd terraform
terraform init
./apply.sh
```

Also, you have to upload photos directory to GCP bucket to get full functionality of the server.
And put your service account key in `secret` directory.

## Contributers

[nometoko](https://github.com/nometoko) - features around judge

[Miku Suzuki](https://github.com/mszk2003) - features around user authorization

[Go Hasegawa](https://github.com/hase-go) - frontend design

[Sugawara Hirotaka](https://github.com/sugawarahirotaka) - database design
