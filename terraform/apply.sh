#!/bin/zsh
LATEST_DIGEST=$(gcloud container images describe asia.gcr.io/composed-region-452708-v1/funalabjudge-backend:latest --format='value(image_summary.digest)')
echo $LATEST_DIGEST
sed -i.bak "s|^backend_digest *= *\".*\"|backend_digest = \"$LATEST_DIGEST\"|" terraform.tfvars

# Terraform適用
terraform apply -var-file=terraform.tfvars -auto-approve

