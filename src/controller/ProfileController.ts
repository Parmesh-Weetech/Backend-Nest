import AppDataSource from "../data-source.js";
import { Profile } from "../entity/Profile.js";
import { NextFunction, Request, Response } from "express"

export class ProfileController {
    private profileRepository = AppDataSource.getRepository(Profile)

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const profile = request.body;

            const profileData = await AppDataSource.transaction(async (manager) => {
                return await manager.save(manager.create(Profile, profile));
            })

            response.status(201).json({ message: "Profile created", data: profileData })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const profile = request.body;

            await AppDataSource.transaction(async (manager) => {
                await manager.update(Profile, { id: profile.id }, {
                    bio: profile.bio
                })
            })

            response.status(200).json({ message: "Updated profile" })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const profile = await AppDataSource.transaction(async (manager) => {
                const profile = await manager.findBy(Profile, {
                    id: request.body.id
                })

                return profile;
            })

            response.status(200).json({ message: "Fetched", data: profile })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }

    async getOne(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id;

            return await AppDataSource.transaction(async (manager) => {
                return await manager.findOne(Profile, {
                    where: {
                        id: id
                    }
                })
            })
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}