terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

#################################
# Default VPC
#################################

data "aws_vpc" "default" {
  default = true
}

#################################
# Default Subnet
#################################

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

#################################
# Latest Ubuntu 24.04 LTS AMI
#################################

data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

#################################
# Security Group
#################################

resource "aws_security_group" "ec2_sg" {
  name        = "ubuntu-ec2-sg"
  description = "Allow SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    # Restrict to your IP for security
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#################################
# EC2 Instance
#################################

resource "aws_instance" "ubuntu_server" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "m7i-flex.large"
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true

  # Replace with your existing AWS Key Pair name
  key_name = "my-key"

  tags = {
    Name = "Ubuntu-M7i-Flex"
  }
}

#################################
# Outputs
#################################

output "instance_id" {
  value = aws_instance.ubuntu_server.id
}

output "public_ip" {
  value = aws_instance.ubuntu_server.public_ip
}

output "ssh_command" {
  value = "ssh -i my-key.pem ubuntu@${aws_instance.ubuntu_server.public_ip}"
}