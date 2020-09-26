import * as cdk from '@aws-cdk/core';
const ec2 = require('@aws-cdk/aws-ec2');
const eks = require('@aws-cdk/aws-eks');
const iam = require('@aws-cdk/aws-iam');

export class EksCpStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for control plane
    const eksCpVpc = new ec2.Vpc(this, 'eks-cp-vpc', {
      cidr: '192.168.0.0/16',
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'eks-cp-subnet-01',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: '192.168.64.0/18'
        },
        {
          name: 'eks-cp-subnet-02',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: '192.168.128.0/18',
        },
        {
          name: 'eks-cp-subnet-03',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: '192.168.192.0/18'
        }
      ]
    });

    // Security group
    const eksCpSg = new ec2.SecurityGroup(this, 'eks-cp-sg', {
      vpc: eksCpVpc,
      securityGroupName: 'eks-cp-ng-sg',
      description: 'Allow cluster communication with worker nodes'
    });

    // Roles
    const eksClusterAdmin = new iam.Role(this, 'eksClusterAdmin', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // Create cluster
    const eksCluster = new eks.Cluster(this, 'eks-cluster', {
      vpc: eksCpVpc,
      mastersRole: eksClusterAdmin,
      defaultCapacity: 0,
      version: eks.KubernetesVersion.V1_16
    });

    // Stack outputs
    const eksCpVpcId = this.stackOutput('EksCpVpcId', eksCpVpc.vpcId);
    const eksCpSecurityGroupId = this.stackOutput('EksCpSecurityGroupId', eksCpSg.securityGroupId);
    const eksClusterName = this.stackOutput('EksClusterName', eksCluster.clusterName);
  }
  
  protected stackOutput(name: string, value: string) {
    return new cdk.CfnOutput(this, name, {
        value: value,
        exportName: `${name}`
    });
  }
}
