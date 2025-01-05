import * as DataLoader from 'dataloader';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { ObjectId } from 'typeorm';

export default function createRolesLoader(rolesService: RolesService) {
  return new DataLoader<ObjectId, Role>(async (rolesIds: ObjectId[]) => {
    const roles = await rolesService.findByIds(rolesIds);
    return rolesIds.map((id) => roles.find((role) => role._id.equals(id)));
  });
}
