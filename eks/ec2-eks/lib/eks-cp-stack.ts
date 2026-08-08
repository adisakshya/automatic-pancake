import cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const eks = require('@aws-cdk/aws-eks');
const iam = require('@aws-cdk/aws-iam');

/**
 * AWS Managed Polciy ARNs
 */
const EKS_POLICIES: string[] = [
  "arn:aws:iam::aws:policy/AmazonEKSServicePolicy",
  "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
];

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
          name: 'eks-cp-public-subnet-01',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: '192.168.64.0/18'
        },
        {
          name: 'eks-cp-private-subnet-01',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: '192.168.128.0/18',
        },
        {
          name: 'eks-cp-private-subnet-02',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: '192.168.192.0/18'
        }
      ]
    });

    // Roles
    const eksRole = new iam.Role(this, 'EksServiceRole', {
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicyArns: EKS_POLICIES
    });

    // Security groups
    const eksCpSg = new ec2.SecurityGroup(this, 'eks-cp-sg', {
      vpc: eksCpVpc,
      securityGroupName: 'eks-cp-ng-sg',
      description: 'Allow cluster communication with worker nodes'
    });

    // Create cluster
    const eksCluster = new eks.Cluster(this, 'eks-cluster', {
      version: eks.KubernetesVersion.V1_17,
      defaultCapacity: 0,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.SMALL)
    });

    // Stack outputs
    const publicSubnetIds = eksCpVpc.publicSubnets.map((s:any) => s.subnetId);
    const privateSubnetIds = eksCpVpc.privateSubnets.map((s:any) => s.subnetId);
    const eksClusterName = this.stackOutput('EksClusterName', eksCluster.clusterName);
  }
  
  protected stackOutput(name: string, value: string) {
    return new cdk.CfnOutput(this, name, {
        value: value,
        exportName: `${name}`
    });
  }
}
