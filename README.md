# AWS CDK Infrastructure Templates

This repository provides example AWS Cloud Development Kit (CDK) projects that demonstrate how to define infrastructure as code. Use these templates as a starting point for provisioning AWS resources with TypeScript.

## Repository structure

- **ec2/single-instance** – Deploys a single EC2 instance in its own VPC
- **eks/ec2-eks** – Provisions an Amazon EKS control plane backed by EC2 networking

Each directory contains an independent CDK application with its own README explaining how to build, test, and deploy that stack.

## Prerequisites

- [Node.js](https://nodejs.org/) 10.x or newer
- [AWS CDK](https://docs.aws.amazon.com/cdk/) CLI installed globally (`npm install -g aws-cdk`)
- AWS credentials configured for your account

## Usage

Navigate into any example directory and install its dependencies:

```bash
cd ec2/single-instance
npm install
```

Synthesize the CloudFormation template or deploy the stack:

```bash
cdk synth
cdk deploy
```

See the subproject READMEs for detailed commands and explanation of the resources created.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for improvements or new templates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
