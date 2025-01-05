import * as DataLoader from 'dataloader';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

export default function createRolesLoader(rolesService: RolesService) {
  return new DataLoader<string, Role>(async (rolesIds: string[]) => {
    const roles = await rolesService.findByIds(rolesIds);

    return rolesIds.map((id) => roles.find((role) => role._id === id));
  });
}
