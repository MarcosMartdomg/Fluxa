/**
 * Variable Resolver Service
 * Handles the resolution of {{trigger.body.email}} type variables at runtime
 */

export class VariableResolver {
  /**
   * Resolves all variables in a string or object
   */
  static resolve(
    target: any,
    context: { trigger: any; nodes: Record<string, any> }
  ): any {
    if (typeof target === 'string') {
      return this.resolveString(target, context);
    }

    if (Array.isArray(target)) {
      return target.map((item) => this.resolve(item, context));
    }

    if (typeof target === 'object' && target !== null) {
      const resolved: any = {};
      for (const [key, value] of Object.entries(target)) {
        resolved[key] = this.resolve(value, context);
      }
      return resolved;
    }

    return target;
  }

  private static resolveString(
    str: string,
    context: { trigger: any; nodes: Record<string, any> }
  ): string {
    const regex = /{{(.*?)}}/g;
    return str.replace(regex, (match, path) => {
      const resolved = this.getValueByPath(path.trim(), context);
      return resolved !== undefined ? String(resolved) : match;
    });
  }

  private static getValueByPath(path: string, context: any): any {
    const parts = path.split('.');
    let current = context;

    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }

    return current;
  }
}
