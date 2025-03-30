# Judge Server For Education

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
