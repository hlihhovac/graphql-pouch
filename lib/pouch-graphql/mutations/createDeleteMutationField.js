const GraphQL = require('graphql');
const utils = require('../utils');
const payloadInterface = require('./payloadInterface');
const clientMutationId = require('./clientMutationId');
const viewer = require('../queries/viewer');

module.exports = {
  createGraphQLInputType: createGraphQLInputType,
  createGraphQLPayloadType: createGraphQLPayloadType,
  createRelayInputType: createRelayInputType,
  createRelayPayloadType: createRelayPayloadType,
};

function createGraphQLInputType(typeName) {
  return {
    id: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
      description: `Locates the single ${typeName} node to delete using its required ID field.`
    }
  };
}

function createGraphQLPayloadType(typeName, object_types) {
  return new GraphQL.GraphQLObjectType({
    name: `Delete${typeName}Payload`,
    description: `Contains the ${typeName} node deleted by the mutation.`,
    fields: {
      [utils.lowerCaseFirstLetter(typeName)]: {
        type: object_types[typeName],
        description: `The deleted ${typeName}.`,
        resolve: source => source,
      },
      [`deleted${typeName}Id`] : {
        type: GraphQL.GraphQLID,
        description: `The deleted ${typeName} id.`,
        resolve: source => source.id,
      }
    }
  });
}

function createRelayInputType(typeName) {
  return new GraphQL.GraphQLInputObjectType({
    name: `Delete${typeName}Input`,
    description: `Locates the single ${typeName} node to delete using its required ID field.`,
    fields: {
      clientMutationId: clientMutationId.forInput,
      id: {
        type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
        description: `Locates the single ${typeName} node to delete using its required ID field.`
      }
    }
  });
}

function createRelayPayloadType(schemaName, typeName, object_types) {
  return new GraphQL.GraphQLObjectType({
    name: `Delete${typeName}Payload`,
    description: `Contains the ${typeName} node deleted by the mutation.`,
    interfaces: [payloadInterface.createPayloadInterface(schemaName, object_types)],
    fields: {
      [utils.lowerCaseFirstLetter(typeName)]: {
        type: object_types[typeName],
        description: `The deleted ${typeName}.`,
        resolve: source => source,
      },
      [`deleted${typeName}Id`]: {
        type: GraphQL.GraphQLID,
        description: `The deleted ${typeName} id.`,
        resolve: source => source.id,
      },
      clientMutationId: clientMutationId.forPayload,
      viewer: viewer.createViewerField(schemaName, object_types),
    }
  });
}
