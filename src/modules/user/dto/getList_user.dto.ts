import { PageOptionsDto } from '../../../common/dtos/pageOption';

export class GetUserParams extends PageOptionsDto {
  username: string;
  email: string;
  balance: string;
}
