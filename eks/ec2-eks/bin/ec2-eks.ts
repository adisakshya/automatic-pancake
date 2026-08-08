#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { EksCpStack } from '../lib/eks-cp-stack';

const app = new cdk.App();
new EksCpStack(app, 'EksCpStack', {
    env: {
        region: process.env.AWS_REGION,
        account: process.env.ACCOUNT_ID
    }
});
