#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EksCpStack } from '../lib/eks-cp-stack';

const app = new cdk.App();
new EksCpStack(app, 'EksCpStack');
