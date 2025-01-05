import * as DataLoader from 'dataloader';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export default function createUsersLoader(UsersService: UsersService) {
  return new DataLoader<string, User[]>(async (roleIds: string[]) => {
    const users = await UsersService.findByRoleIds(roleIds);

    return roleIds.map((id) => users.filter((user) => user.roleId === id));
  });
}
