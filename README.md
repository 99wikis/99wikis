_disclaimer: this is still work-in-progress_

# 99wikis
Knowledge Base App - Simple, Free and Serverless _(and open-source)_

**This is a simple colaborative knowledge base app for you and your team share bits of knowledge**, internally or with third parties :) Clone and deploy it with only one command onto cheap, auto-scaling, serverless infrastructure on AWS.

- [x] **Easy to deploy** - `git clone` + `make deploy` And you're up and running.
- [x] **Private and Secure** - You control the source code.
- [x] **Don't Pay For Idle** - No HTTP requests, no cost. Averages ~$0.000003 per request.

### Get Started:

1. [**Configure**](#1-configure)
2. [**Deploy**](#2-deploy)
3. [**Dev Mode**](#3-dev-mode)
4. [**Remove**](#4-remove)

Extra:

* [**Architecture**](#Architecture)

## Architecture

This is the AWS serverless infrastructure that is created by this App:

- [x] **AWS HTTP API** - The API Gateway which receives all requests and proxies them to AWS Lambda.
- [x] **AWS Lambda** - A single AWS Lambda function to execute an Express.js API.
- [x] **AWS IAM** - An AWS IAM role is automatically created, if you do not provide a custom one.
- [x] **AWS DynamoDb** - Two DynamoDb tables
- [x] **AWS S3 bucket** - One S3 bucket to host the React App
- [x] **AWS Cloudformation** - One Cloudformation endpoint to serve the React App

