// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { OpenAPIV3 } from 'openapi-types';
import { OpenAPIParser } from './openapi-autocomplete-parser';

//
// Note: this file was largely generated with the help of GitHub Copilot
//

export class AutocompleteGenerator {
  private parser: OpenAPIParser;
  private allPaths: string[];

  constructor(openApiSpec: OpenAPIV3.Document, forPath: string) {
    this.parser = new OpenAPIParser(openApiSpec);
    this.allPaths = this.parser.extractPathsFromEndpoint(forPath, 'get');
  }

  /**
   * Generate autocomplete suggestions based on input
   */
  public generateSuggestions(
    input: string,
    maxSuggestions: number = 50
  ): string[] {
    // get all numbers from input, such that they can be replaced in the path
    const pathVariables = Array.from(input.matchAll(/\.\d+\.?/g)).map(
      (match) => match[0]
    );

    const cleanInput = this.cleanInput(input).replaceAll(/\.\d+/g, '.0');

    if (cleanInput.length === 0) {
      // Return top-level paths when no input
      const topLevelPaths = this.getTopLevelPaths();
      return topLevelPaths.slice(0, maxSuggestions);
    }

    const matchedPaths = this.findMatchingPaths(cleanInput);

    const limitedPaths = matchedPaths.slice(0, maxSuggestions);

    // Reinsert path variables into the suggestions
    const finalPaths = limitedPaths.map((path) => {
      let modifiedPath = path;
      pathVariables.forEach((variable) => {
        modifiedPath = modifiedPath.replace('.0', variable);
      });

      return modifiedPath.replaceAll(/\.{2,}/g, '.');
    });

    return finalPaths;
  }

  /**
   * Clean and normalize input
   */
  private cleanInput(input: string): string {
    return input.trim().toLowerCase();
  }

  /**
   * Get top-level paths (no dots in the path)
   */
  private getTopLevelPaths(): string[] {
    return this.allPaths.filter((path) => !path.includes('.'));
  }

  /**
   * Find paths that match the input using various strategies
   */
  private findMatchingPaths(cleanInput: string): string[] {
    const exactMatches: string[] = [];
    const startsWith: string[] = [];

    for (const path of this.allPaths) {
      const lowerPath = path.toLowerCase();

      if (lowerPath === cleanInput) {
        exactMatches.push(path);
      } else if (lowerPath.startsWith(cleanInput)) {
        startsWith.push(path);
      }
    }

    // Return results in order of relevance
    return [...exactMatches, ...startsWith.sort()];
  }
}
