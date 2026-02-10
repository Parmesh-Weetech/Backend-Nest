import { DataSource, Not, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Role } from "../role/entities/role.entity";
import { Organization } from "../organization/entities/organization.entity";

import { User } from "./entities/user.entity";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.findOne({
            where: { id: id }, relations: {
                organization: true,
                roles: {
                    organization: true,
                    permissions: {
                        organization: true,
                    },
                },
            }
        });

        if(!user) return null;

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.findOne({
            where: { email: email }, relations: {
                organization: true,
                roles: {
                    organization: true,
                    permissions: {
                        organization: true,
                    },
                },
            }
        });

        if(!user) return null;

        return user;
    }

    async findAll(id: string): Promise<User[] | [] | null> {
        const fetchedUser = await this.find({ where: { id: Not(id) }, relations: ['roles'] });

        if (fetchedUser && fetchedUser.length === 0) {
            return [];
        } else if (!fetchedUser || fetchedUser === undefined || fetchedUser === null) {
            return null;
        }

        return fetchedUser;
    }

    async createUser(createUserDTO: CreateUserDTO, requiredRoles: Role[], organization: Organization): Promise<User | null> {
        const newUser = this.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            roles: requiredRoles,
            organization: organization
        });

        const saveUser = this.save(newUser);

        if (!saveUser) return null;

        return saveUser;
    }

    async updateUser(user: User): Promise<User | null> {
        const saveUser = this.save(user);

        if (!saveUser) return null;

        return saveUser
    }

    async softDeleteUser(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete(id);

        if (
            affectedRows.affected === null ||
            affectedRows.affected === undefined ||
            affectedRows.affected === 0
        ) return false;

        return true;
    }
}