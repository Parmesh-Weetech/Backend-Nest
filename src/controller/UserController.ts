import AppDataSource from "../data-source.js"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User.js"
import { Profile } from "../entity/Profile.js"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await AppDataSource.transaction(async (manager) => {
                return manager.find(User, {
                    relations: ["profile"]
                })
            })

            response.status(200).json({ message: "User Fetched Successfully", data: result })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;

            const result = await AppDataSource.transaction(async (manager) => {

                const user = await manager.findOne(User, {
                    where: { id: id },
                    relations: ["profile"]
                });

                if (!user) {
                    return "unregistered user"
                }
                return user
            })

            response.status(200).json(result)
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const { name, bio } = request.body;

            const result = await AppDataSource.transaction(async (manager) => {
                const profile = await manager.create(Profile, {
                    bio: bio
                });

                await manager.save(profile);

                const createUser = await manager.create(User, {
                    name: name,
                    profile: profile
                });

                return await manager.save(createUser);
            });

            response.status(201).json({ message: "User Created Successfully", data: result });
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const { id, name, bio } = request.body;

            const result = await AppDataSource.transaction(async (manager) => {
                const user = await manager.findOne(User, {
                    where: { id },
                    relations: ["profile"]
                });

                const profile = await manager.findOne(Profile, {
                    where: { id: user.profile.id }
                })

                if (!user || !profile) {
                    throw new Error("User not found");
                }

                if (name) {
                    user.name = name;
                    await manager.save(user);
                }

                if (bio && user.profile) {
                    user.profile.bio = bio;
                    await manager.save(user.profile);
                }

                return user;
            })

            response.status(200).json({ message: "User Updated Successfully", data: result })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;

            await AppDataSource.transaction(async (manager) => {
                const user = await manager.findOne(User, {
                    where: { id },
                    relations: ["profile"]
                });

                const profile = await manager.findOne(Profile, {
                    where: { id: user.profile.id }
                })

                if (!user || !profile) {
                    throw new Error("User not found");
                }

                await manager.delete(Profile, user.profile.id);
            });

            return response.json({ message: "User and profile deleted" });
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}