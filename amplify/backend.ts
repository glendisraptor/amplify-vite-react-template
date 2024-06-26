import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
});

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// update the schema property to add custom attributes
if (Array.isArray(cfnUserPool.schema)) {
  cfnUserPool.schema.push({
    name: 'role',
    attributeDataType: 'String',
  });
}