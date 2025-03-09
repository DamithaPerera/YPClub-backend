provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "backend_sg" {
  name        = "backend-sg"
  description = "Security group for backend EC2 instances"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_launch_template" "backend_lt" {
  name_prefix   = "backend-"
  image_id      = var.ami_id
  instance_type = "t2.micro"

  security_group_names = [aws_security_group.backend_sg.name]

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    # Install Docker
    amazon-linux-extras install docker -y
    service docker start
    # Install CodeDeploy Agent
    yum install ruby -y
    cd /home/ec2-user
    wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
    chmod +x ./install
    ./install auto
    service codedeploy-agent start
    # Pull and run your container (replace 'your-docker-image' with your image)
    docker run -d -p 80:3001 your-docker-image
  EOF
  )

  tags = {
    "VersionUpdate" = timestamp()
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_autoscaling_group" "backend_asg" {
  name                = "backend-asg"
  max_size            = 3
  min_size            = 1
  desired_capacity    = 1
  vpc_zone_identifier = var.subnet_ids

launch_template {
  id      = aws_launch_template.backend_lt.id
  version = aws_launch_template.backend_lt.latest_version
}

  tag {
    key                 = "Name"
    value               = "backend-instance"
    propagate_at_launch = true
  }
}

resource "aws_codedeploy_app" "backend_app" {
  name             = "backend-codedeploy-app"
  compute_platform = "Server"
}

resource "aws_codedeploy_deployment_group" "backend_dg" {
  app_name              = aws_codedeploy_app.backend_app.name
  deployment_group_name = "backend-dg"
  service_role_arn      = var.codedeploy_service_role_arn
  deployment_config_name = "CodeDeployDefault.OneAtATime"

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      value = "backend-instance"
      type  = "KEY_AND_VALUE"
    }
  }
}
