import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return false;
      }

      const token = authHeader.split(' ')[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      
      req.user = decoded;
      return true;
    } catch (err) {
      return false;
    }
  }
} 