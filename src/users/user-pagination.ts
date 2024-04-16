import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { User } from "src/users/user.entity";

export interface CustomPaginationOptions extends IPaginationOptions {
    user: User;
}
