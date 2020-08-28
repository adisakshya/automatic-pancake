# Infrastructure as a Code

## What is IaC?

Infrastructure as a Code is the process of managing and provisioning system resources through human and machine-readable definition files, rather than manually setting up them. Storing definition files in a version control system allows engineers to gradually rollout changes, do easy rollbacks and store infrastructure changes inside a version control system.

Tools like Terraform and Cloudformation are really popular choices among IaC tools, but they have shortcomings. The learning curve is one of them. Managing complex Cloudformation templates is no fun either.

CDK uses Cloudformation under the hood, but you are not managing those templates. CDK enables programmers who might not have previous IaC experience to provision and manage Cloud resources using mainstream programming languages.