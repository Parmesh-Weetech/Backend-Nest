import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source.js";
import { User } from "../entity/User.js";
import { Profile } from "../entity/Profile.js";

export class UserController_Join {
    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            // const users = await this.userRepository
            //     .createQueryBuilder("user")
            //     .innerJoinAndSelect("user.profile", "profile")
            //     .getMany(); // INNER JOIN

            // const users = await this.userRepository.createQueryBuilder("user")
            //     .leftJoinAndSelect("user.profile", "profile")
            //     .getMany(); // LEFT JOIN

            const users = await AppDataSource.getRepository(Profile).createQueryBuilder("profile")
                .leftJoinAndSelect("profile.user", "user")
                .getMany(); // RIGHT JOIN

            response.status(200).json(users)

        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async getOne(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;

            // const user = await this.userRepository.createQueryBuilder("user")
            //     .innerJoinAndSelect("user.profile", "profile")
            //     .where("user.id = :id", { id: id })
            //     .getOne(); // INNER JOIN

            // const user = await this.userRepository.createQueryBuilder("user")
            //     .leftJoinAndSelect("user.profile", "profile")
            //     .where("user.id = :id", { id: id })
            //     .getOne(); // LEFT JOIN

            const user = await AppDataSource.getRepository(Profile).createQueryBuilder("profile")
                .leftJoinAndSelect("profile.user", "user")
                .where("user.id = :id", { id: id }) // Where condition based on id we want to fetch the data
                .getOne(); // RIGHT JOIN

            // const user = await this.userRepository
            //     .createQueryBuilder("user")
            //     .leftJoin("user.profile", "profile")
            //     .select(["user.id", "user.name", "profile.bio"]) // explicitly select needed columns
            //     .where("user.id = :id", { id })
            //     .getOne(); // this join method used when you want to only display specific column not every column from both the table.

            // There are two types of results you can get using select query builder: entities and raw results.Most of the time, you need to select real entities from your database, for example, users.For this purpose, you use getOne and getMany.However, sometimes you need to select specific data, like the sum of all user photos.Such data is not an entity, it's called raw data. To get raw data, you use getRawOne and getRawMany.

            // this is useful when we want to do the count from db like entry count.

            response.status(200).json(user);
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}