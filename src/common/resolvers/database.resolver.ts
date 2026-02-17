import { Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export type DatabaseProvider = 'mongodb' | 'postgres';

@Injectable({ scope: Scope.REQUEST })
export class DatabaseResolver {
  constructor(@Optional() @Inject(REQUEST) private readonly request?: any) {}

  private extractProviderFromToken(rawToken: string | undefined): DatabaseProvider | null {
    if (!rawToken || typeof rawToken !== 'string') return null;

    const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;
    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      const payload = JSON.parse(payloadJson);
      const provider = payload?.orgProvider ?? payload?.org_provider;
      return provider === 'mongodb' ? 'mongodb' : provider === 'postgres' ? 'postgres' : null;
    } catch {
      return null;
    }
  }

  get provider(): DatabaseProvider {
    const headerProvider = this.extractProviderFromToken(
      this.request?.headers?.authorization,
    );
    const refreshTokenProvider = this.extractProviderFromToken(
      this.request?.body?.refreshToken,
    );

    const provider =
      this.request?.organization?.config?.database_provider ??
      this.request?.currentUser?.organization?.config?.database_provider ??
      this.request?.auth?.orgProvider ??
      this.request?.body?.database_provider ??
      headerProvider ??
      refreshTokenProvider;

    return provider === 'mongodb' ? 'mongodb' : 'postgres';
  }
}
