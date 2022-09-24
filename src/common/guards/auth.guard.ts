import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GroupService } from 'src/group/group.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entitiy';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly groupService: GroupService,
    private readonly roleService: RoleService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!allowedRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const auth_json_webtoken = request.headers.authorization;

    const decoded_auth_json_webtoken = jwt.decode(
      auth_json_webtoken.slice(7, auth_json_webtoken.length),
      process.env.JWT_TEXT,
    );
    const user = decoded_auth_json_webtoken.user;
    const user_roles = user.user_roles;

    const userRoles: string[] = [];
    console.log(userRoles);
    console.log(allowedRoles);

    for (const role of user_roles) {
      userRoles.push(role.role_name);
    }
    const allowed = this.isAllowed(allowedRoles, userRoles);
    if (!allowed) {
      throw new ForbiddenException(
        'You are not authorized to access this route',
      );
    } else {
      return true;
    }
  }

  isAllowed(allowedRoles, userRoles: String[]) {
    const allUsersRoles = [];
    userRoles.map((role) => {
      allUsersRoles.push(role);
    });
    const hasRole = allUsersRoles.some((role) => allowedRoles.includes(role));
    return hasRole;
  }
}
