import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class TicketGuard implements CanActivate {
  constructor(private readonly ticketService: TicketService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user.user;
    const user_id = user._id;
    const ticket_id = request.params.id;
    const ticket = await this.ticketService.findOne(ticket_id);
    if (ticket.ticket_responsible['_id'] == user_id) {
      return true;
    } else {
      throw new ForbiddenException(
        'Only the responsible for this ticket can edit',
      );
    }
  }
}
