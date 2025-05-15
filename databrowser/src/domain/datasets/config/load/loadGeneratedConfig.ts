// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  ROLE_CREATE,
  ROLE_DELETE,
  ROLE_READ,
  ROLE_UPDATE,
} from '../../../../config/tourism/roles';
import { CellComponent } from '../../../cellComponents/types';
import {
  domainIsKnownToHaveOpenApiDocument,
  domainWithOpenApiDocument,
  useOpenApi,
} from '../../../openApi';
import { DomainWithOpenApiDocument, OpenApi } from '../../../openApi/types';
import { hasTourismPaginationShape } from '../../pagination/types';
import {
  defaultMobilityTableQueryParameters,
  defaultTourismTableQueryParameters,
} from '../../ui/tableView/defaultValues';
import {
  AnyDomain,
  DatasetConfig,
  DetailViewConfig,
  ListElements,
  ListViewConfig,
  OperationKey,
  PathSegments,
  PropertyConfig,
} from '../types';
import { findCandidateConfigs } from '../utils';
import {
  DatasetConfigLoader,
  LoadAllDatasetConfigsFn,
  LoadDatasetConfigFn,
} from './types';

type ErrorMessage = string;

type ResourceName = string;

type Resources = Record<ResourceName, DatasetConfig>;

const isErrorMessage = (o: unknown): o is ErrorMessage =>
  o != null && typeof o === 'string';

const loadDatasetConfig: LoadDatasetConfigFn = async (domain, pathSegments) => {
  if (!domainIsKnownToHaveOpenApiDocument(domain)) {
    return Promise.reject(
      `ODH domain ${domain} is unknown, not able to generate dataset config`
    );
  }

  const document = await useOpenApi().loadDocument(domain);

  if (document == null) {
    return Promise.reject(`No OpenAPI document found for ODH domain ${domain}`);
  }

  const configOrErrorMessage = findGeneratedDatasetConfig(
    domain,
    pathSegments,
    document
  );

  return isErrorMessage(configOrErrorMessage)
    ? Promise.reject(configOrErrorMessage)
    : Promise.resolve(configOrErrorMessage);
};

const findGeneratedDatasetConfig = (
  domain: DomainWithOpenApiDocument,
  pathSegments: PathSegments,
  document: OpenApi.Document
): DatasetConfig | ErrorMessage => {
  const parseResult = parse(domain, document);

  if (isErrorMessage(parseResult)) {
    return parseResult;
  }

  const candidates = findCandidateConfigs(pathSegments, parseResult);

  if (candidates.length === 0) {
    return `Not able to find a match for path "${pathSegments}" in OpenAPI document for ODH domain ${domain}`;
  }

  if (candidates.length > 1) {
    console.debug(
      `Found ${candidates.length} matches for path "${pathSegments}" in OpenAPI document for ODH domain ${domain}`
    );
  }

  const config = candidates[0].config;
  config.description.title = pathSegments.at(-1);

  return config;
};

const parse = (
  domain: DomainWithOpenApiDocument,
  document: OpenApi.Document
): Resources | ErrorMessage => {
  // Use first server URL
  const serverUrl = document.servers?.map((server) => server.url)?.[0];
  if (serverUrl == null) {
    return `No server URL found in OpenAPI description for ODH domain "${domain}"`;
  }

  return Object.entries(document.paths).reduce<Resources>(
    (previous, [path, httpMethods]) => {
      if (httpMethods == null) {
        return previous;
      }

      const { datasetConfig, isResourceInstancePath, resourcePath } =
        getOrBuildBaseDatasetConfig(domain, serverUrl, path, previous);

      Object.entries(httpMethods).forEach((entry) => {
        const httpMethod = entry[0] as OpenApi.HttpMethods;
        const openApiOperation = entry[1] as OpenApi.OperationObject;

        // Begin resolve operation
        const operation = mapHttpMethodToOperations(
          httpMethod,
          isResourceInstancePath
        );

        if (operation == null) {
          console.error(
            `Unknown operation for path ${path} and method ${httpMethod}`
          );
          return;
        }

        if (datasetConfig.operations == null) {
          datasetConfig.operations = {};
        }
        const rolesAllowed = mapOperationToRoles(operation);
        datasetConfig.operations[operation] = { rolesAllowed };

        datasetConfig.description.description =
          httpMethods.summary ?? httpMethods[httpMethod]?.summary;
        // End resolve operation

        // Begin resolve view
        if (datasetConfig.views == null) {
          datasetConfig.views = {};
        }

        const schema = schemaFromEndpointMethod(
          domain,
          operation,
          openApiOperation
        );

        if (operation === 'readAll') {
          datasetConfig.views.table = listViewConfigFromProperties(schema);

          // Set default query parameters
          datasetConfig.views.table.defaultQueryParams =
            domain === 'tourism'
              ? defaultTourismTableQueryParameters
              : defaultMobilityTableQueryParameters;
        } else if (operation === 'read') {
          datasetConfig.views.detail = detailViewConfigFromProperties(schema);
        }
        // End resolve view
      });

      return {
        ...previous,
        [resourcePath]: datasetConfig,
      };
    },
    {}
  );
};

const getOrBuildBaseDatasetConfig = (
  domain: DomainWithOpenApiDocument,
  serverUrl: string,
  path: string,
  knownDatasetConfigs: Resources
): {
  datasetConfig: DatasetConfig;
  isResourceInstancePath: boolean;
  resourcePath: string;
} => {
  const pathSegments = path.split('/').filter((p) => p.trim().length > 0);

  // Check if the last path param is a resource instance ID
  const isResourceInstancePath =
    domain === 'mobility' ? false : pathSegments.at(-1)?.match('{.*}') != null;

  const resourcePathSegments = isResourceInstancePath
    ? pathSegments.slice(0, -1)
    : pathSegments;

  const resourcePath = '/' + resourcePathSegments.join('/');

  if (knownDatasetConfigs[resourcePath] != null) {
    return {
      datasetConfig: knownDatasetConfigs[resourcePath],
      isResourceInstancePath,
      resourcePath,
    };
  }

  return {
    datasetConfig: {
      baseUrl: serverUrl,
      source: 'generated',
      route: {
        domain,
        pathSegments: resourcePathSegments,
      },
      description: {
        title:
          resourcePathSegments.length > 0
            ? resourcePathSegments.slice(1).join('/')
            : '',
      },
    },
    isResourceInstancePath,
    resourcePath,
  };
};

const mapHttpMethodToOperations = (
  httpMethod: OpenApi.HttpMethods,
  isInstance: boolean
): OperationKey | undefined => {
  switch (httpMethod) {
    case 'get':
      return isInstance ? 'read' : 'readAll';
    case 'delete':
      return 'delete';
    case 'post':
      return 'create';
    case 'put':
      return 'update';
  }
};

const mapOperationToRoles = (operation: OperationKey): string[] => {
  switch (operation) {
    case 'read':
    case 'readAll':
      return ROLE_READ;
    case 'create':
      return ROLE_CREATE;
    case 'update':
      return ROLE_UPDATE;
    case 'delete':
      return ROLE_DELETE;
  }
};

const schemaFromEndpointMethod = (
  domain: DomainWithOpenApiDocument,
  operation: OperationKey,
  endpointMethod: OpenApi.OperationObject
): OpenApi.SchemaObject | undefined => {
  if (operation === 'read' || operation === 'readAll') {
    if (domain === 'mobility') {
      return mobilityDefaultSchema;
    }

    // At this point, we know that the domain is tourism

    const responseOk = endpointMethod.responses?.[200] as
      | OpenApi.ResponseObject
      | undefined;
    const schema = responseOk?.content?.['application/json']?.schema as
      | OpenApi.SchemaObject
      | undefined;

    // In tourism API, there are two different shapes of the response schema:
    // 1. A paginated response, which has a specific shape (with properties like
    //    CurrentPage, TotalResults, TotalPages, PreviousPage, NextPage, Items)
    // 2. A plain array of objects, which is a simple array of objects
    //    (with no pagination properties)

    // Case 1 - paginated result: the schema is nested inside the tourism pagination
    // data structure
    if (hasTourismPaginationShape(schema?.properties)) {
      // The schema we're interested in is inside the Items.items property
      type ListSchema = {
        properties?: {
          Items?: { items?: { properties: OpenApi.SchemaObject | undefined } };
        };
      };
      return (schema as ListSchema)?.properties?.Items?.items?.properties;
    }

    // Case 2 - plain array of objects: the schema is inside schema.items.properties
    if (
      schema?.type === 'array' &&
      (schema.items as OpenApi.SchemaObject)?.properties != null
    ) {
      return (schema.items as OpenApi.SchemaObject)?.properties;
    }

    return schema;
  }

  if (operation === 'create' || operation === 'update') {
    const requestBody = endpointMethod.requestBody as
      | OpenApi.RequestBodyObject
      | undefined;
    return requestBody?.content['application/json']?.schema as
      | OpenApi.SchemaObject
      | undefined;
  }
};

const listViewConfigFromProperties = (
  properties: OpenApi.SchemaObject | undefined
): ListViewConfig => {
  const elements: ListElements[] = Object.keys(properties ?? [])
    .map((name) => {
      return {
        title: name,
        component: CellComponent.TypeBasedCell,
        objectMapping: {
          data: name,
        },
        class: 'w-60 leading-3',
      };
    })
    .sort(sortByMainOrderAndLocalCompare);

  return { elements };
};

const detailViewConfigFromProperties = (
  properties: OpenApi.SchemaObject | undefined
): DetailViewConfig => {
  const subcategoryProperties: PropertyConfig[] = Object.keys(properties ?? [])
    .map((name) => {
      return {
        title: name,
        component: CellComponent.TypeBasedCell,
        objectMapping: {
          data: name,
        },
      };
    })
    .sort(sortByMainOrderAndLocalCompare);

  return {
    elements: [
      {
        name: 'All data',
        slug: 'all',
        subcategories: [
          {
            name: '',
            properties: subcategoryProperties,
          },
        ],
      },
    ],
  };
};

const sortByMainOrderAndLocalCompare = (
  a: PropertyConfig,
  b: PropertyConfig
) => {
  const mainOrder = ['ID', 'NAME', 'TITLE', 'ACTIVE'];

  const aIndex = mainOrder.indexOf(a.title.toUpperCase());
  const bIndex = mainOrder.indexOf(b.title.toUpperCase());

  if (aIndex < 0 && bIndex < 0) {
    return a.title.localeCompare(b.title);
  } else if (aIndex < 0) {
    return 1;
  } else if (bIndex < 0) {
    return -1;
  }

  return aIndex - bIndex;
};

const loadAllDatasetConfigs: LoadAllDatasetConfigsFn = async () => {
  const result: Record<AnyDomain, DatasetConfig[]> = {};

  for (const domain of Object.keys(domainWithOpenApiDocument)) {
    const document = await useOpenApi().loadDocument(
      domain as DomainWithOpenApiDocument
    );

    // If no OpenAPI document could be found, then there are no view configs to return
    if (document == null) {
      continue;
    }

    // Use first server URL
    const serverUrl = document.servers?.map((server) => server.url)?.[0];

    if (serverUrl == null) {
      return Promise.reject(
        `No server URL found in OpenAPI description for ODH domain "${domain}"`
      );
    }

    const resources = parse(domain as DomainWithOpenApiDocument, document);

    result[domain] = Object.values(resources);
  }

  return result;
};

// This is a default schema for mobility, which is used because the mobility
// OpenAPI document does not contain any correct schemas. Hopefully, this will
// be fixed in the future.
const mobilityDefaultSchema: OpenApi.SchemaObject = {
  type: 'object',
  properties: {
    sname: {
      type: 'string',
    },
    stype: {
      type: 'string',
    },
    scode: {
      type: 'string',
    },
    sorigin: {
      type: 'string',
    },
    sactive: {
      type: 'boolean',
    },
    scoordinate: {
      type: 'object',
    },
    smetadata: {
      type: 'object',
    },
    sparent: {
      type: 'object',
    },
  },
};

export const providerForGeneratedDatasetConfig: DatasetConfigLoader = {
  source: 'generated',
  loadDatasetConfig,
  loadAllDatasetConfigs,
};
