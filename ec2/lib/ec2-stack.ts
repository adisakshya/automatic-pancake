import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class Ec2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'ec2Vpc', {
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Public'
        }
      ]
    });

    // Allow SSH connection from anywhere
    const securityGroup = new ec2.SecurityGroup(this, 'ec2VpcSecurityGroup', {
      vpc,
      securityGroupName: "ec2-vpc-sg",
      description: 'Allow SSH access to ec2 instances from anywhere',
      allowAllOutbound: true
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');

    // Define AMI
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
    });

    // Instance details
    const ec2Instance = new ec2.Instance(this, 'ec2Instance', {
      vpc,
      machineImage: ami,
      securityGroup: securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      keyName: 'ec2'
    });

    // Stack output
    const ec2InstancePublicIp = this.stackOutput("Ec2InstancePublicIp", ec2Instance.instancePublicIp);
    const ec2InstancePublicDnsName = this.stackOutput("Ec2InstancePublicDnsName", ec2Instance.instancePublicDnsName);
  }

  protected stackOutput(name: string, value: string) {
    return new cdk.CfnOutput(this, name, {
        value: value,
        exportName: `${name}`
    });
  }
}
