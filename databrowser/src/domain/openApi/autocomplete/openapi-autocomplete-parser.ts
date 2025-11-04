// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

//
// Note: this file was largely generated with the help of GitHub Copilot
//

import { OpenAPIV3 } from 'openapi-types';

export class OpenAPIParser {
  private spec: OpenAPIV3.Document;
  private resolvedRefs = new Map<string, OpenAPIV3.SchemaObject>();
  private visitedRefs = new Set<string>();

  constructor(spec: OpenAPIV3.Document) {
    this.spec = spec;
  }

  /**
   * Extract paths from a specific endpoint and method
   */
  public extractPathsFromEndpoint(
    path: string,
    method: `${OpenAPIV3.HttpMethods}`
  ): string[] {
    const pathItem = this.spec.paths[path];
    if (!pathItem) {
      return [];
    }

    // Get the operation based on the method
    const operation = pathItem[method];

    if (!operation?.responses) {
      return [];
    }

    const paths = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [statusCode, response] of Object.entries(operation.responses)) {
      this.extractPathsFromResponse(response)
        .filter((path) => path !== '{language}')
        .forEach((path) => paths.add(path));
    }

    return Array.from(paths).sort();
  }

  /**
   * Extract paths from a specific response
   */
  private extractPathsFromResponse(
    response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject
  ): string[] {
    const paths: string[] = [];

    // Handle reference objects
    if ('$ref' in response) {
      const resolvedSchema = this.resolveReference(response.$ref);
      if (resolvedSchema) {
        return this.extractPathsFromSchema(resolvedSchema, '');
      }
      return paths;
    }

    if (!response.content) {
      return paths;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [mediaType, mediaTypeObj] of Object.entries(response.content)) {
      if (mediaTypeObj.schema) {
        const schemaPaths = this.extractPathsFromSchema(
          mediaTypeObj.schema,
          ''
        );
        paths.push(...schemaPaths);
      }
    }

    return paths;
  }

  /**
   * Extract paths from a schema object recursively
   */
  private extractPathsFromSchema(
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    currentPath: string,
    depth: number = 0
  ): string[] {
    // Prevent infinite recursion
    if (depth > 50) {
      return [];
    }

    const paths: string[] = [];

    // Handle $ref
    if ('$ref' in schema) {
      const resolvedSchema = this.resolveReference(schema.$ref);
      if (resolvedSchema && !this.visitedRefs.has(schema.$ref)) {
        this.visitedRefs.add(schema.$ref);
        const refPaths = this.extractPathsFromSchema(
          resolvedSchema,
          currentPath,
          depth + 1
        );
        paths.push(...refPaths);
        this.visitedRefs.delete(schema.$ref);
      }
      return paths;
    }

    if (schema.deprecated) {
      // Optionally, you can choose to skip deprecated schemas
      return paths;
    }

    // Handle different schema types
    switch (schema.type) {
      case 'object':
        paths.push(...this.handleObjectSchema(schema, currentPath, depth));
        break;

      case 'array':
        paths.push(...this.handleArraySchema(schema, currentPath, depth));
        break;

      default:
        // For primitive types, add the current path if it's not empty
        if (currentPath) {
          paths.push(currentPath);
        }
        break;
    }

    // Handle composition keywords
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        paths.push(
          ...this.extractPathsFromSchema(subSchema, currentPath, depth + 1)
        );
      }
    }

    if (schema.oneOf) {
      for (const subSchema of schema.oneOf) {
        paths.push(
          ...this.extractPathsFromSchema(subSchema, currentPath, depth + 1)
        );
      }
    }

    if (schema.anyOf) {
      for (const subSchema of schema.anyOf) {
        paths.push(
          ...this.extractPathsFromSchema(subSchema, currentPath, depth + 1)
        );
      }
    }

    return paths;
  }

  /**
   * Handle object schema properties
   */
  private handleObjectSchema(
    schema: OpenAPIV3.SchemaObject,
    currentPath: string,
    depth: number
  ): string[] {
    const paths: string[] = [];

    // Add the current object path
    if (currentPath) {
      paths.push(currentPath);
    }

    // Process properties
    if (schema.properties) {
      for (const [propertyName, propertySchema] of Object.entries(
        schema.properties
      )) {
        const newPath = currentPath
          ? `${currentPath}.${propertyName}`
          : propertyName;
        paths.push(
          ...this.extractPathsFromSchema(propertySchema, newPath, depth + 1)
        );
      }
    }

    // Handle additionalProperties
    if (
      schema.additionalProperties &&
      typeof schema.additionalProperties === 'object'
    ) {
      const dynamicPath = currentPath
        ? `${currentPath}.{language}`
        : '{language}';
      paths.push(
        ...this.extractPathsFromSchema(
          schema.additionalProperties,
          dynamicPath,
          depth + 1
        )
      );
    }

    return paths;
  }

  /**
   * Handle array schema items
   */
  private handleArraySchema(
    schema: OpenAPIV3.ArraySchemaObject,
    currentPath: string,
    depth: number
  ): string[] {
    const paths: string[] = [];

    // Add the current array path
    if (currentPath) {
      paths.push(currentPath);
      paths.push(`${currentPath}.*`); // Array notation
    }

    // Process array items
    if (schema.items) {
      const itemPath = currentPath ? `${currentPath}.*` : '.*';
      paths.push(
        ...this.extractPathsFromSchema(schema.items, itemPath, depth + 1)
      );
    }

    return paths;
  }

  /**
   * Resolve $ref to actual schema
   *
   * Note that this method should actually never be called, because the OpenAPI documents
   * are supposed to be fully parsed and resolved before this point.
   */
  private resolveReference(ref: string): OpenAPIV3.SchemaObject | null {
    console.warn(`This reference is unresolved, which is unexpected: ${ref}`);

    if (this.resolvedRefs.has(ref)) {
      return this.resolvedRefs.get(ref)!;
    }

    // Handle component references
    if (ref.startsWith('#/components/schemas/')) {
      const schemaName = ref.replace('#/components/schemas/', '');
      const schema = this.spec.components?.schemas?.[schemaName];

      if (schema && '$ref' in schema) {
        // If it's still a reference, resolve it recursively
        return this.resolveReference(schema.$ref);
      } else if (schema) {
        this.resolvedRefs.set(ref, schema);
        return schema;
      }
    }

    // Handle other internal references
    if (ref.startsWith('#/')) {
      const parts = ref.substring(2).split('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = this.spec;

      for (const part of parts) {
        current = current?.[part];
        if (!current) {
          break;
        }
      }

      if (current && typeof current === 'object') {
        if ('$ref' in current) {
          // If it's still a reference, resolve it recursively
          return this.resolveReference(current.$ref);
        }
        this.resolvedRefs.set(ref, current);
        return current;
      }
    }

    return null;
  }
}
