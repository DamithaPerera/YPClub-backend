variable "vpc_id" {
  description = "The VPC ID where the instances will run"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ASG"
  type        = list(string)
}

variable "ami_id" {
  description = "The AMI ID for EC2 instances (e.g., Amazon Linux 2 AMI)"
  type        = string
}

variable "codedeploy_service_role_arn" {
  description = "ARN for the CodeDeploy service role"
  type        = string
}
