import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  async getUsers(
    @Query()
    filter: any,
  ) {
    const users = await this.usersService.getUsers(filter);

    return users;
  }

  @Get(':id')
  async getSingleFreelancer(@Param('id') freelancerId: string) {
    return this.usersService.getSingleFreelancer(freelancerId);
  }

  @Post(':id')
  async changeUserData(@Body() body: any, @Param('id') userId: string) {
    return this.usersService.changeUserData(userId, body);
  }

  @Post('subscriptions/:type')
  async subscribeUser(
    @Body()
    body: {
      id: string;
      value: boolean;
      email: string;
      subType: string;
      alertsQuery?: any;
    },
    @Param('type') type: string,
  ) {
    return this.usersService.subscribeUser(body, type);
  }

  @Get(':id/bookmarks')
  async getBookmarks(@Param('id') userId: string) {
    return this.usersService.getBookmarks({ userId });
  }

  @Post(':id/bookmarks/delete')
  async deleteBookmarks(
    @Param('id') userId: string,
    @Body()
    data: {
      itemId: string;
      userEmail: string;
      type: 'jobs' | 'freelancers';
    },
  ) {
    return this.usersService.deleteBookmarks({ ...data, userId });
  }

  @Post(':id/bookmarks')
  async addBookmarks(
    @Param('id') userId: string,
    @Body()
    data: {
      itemId: string;
      userEmail: string;
      type: 'jobs' | 'freelancers';
    },
  ) {
    return this.usersService.addBookmarks({ ...data, userId });
  }
}
