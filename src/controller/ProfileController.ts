import AppDataSource from "../data-source.js";
import { Profile } from "../entity/Profile.js";
import { NextFunction, Request, Response } from "express"

export class ProfileController {
    private profileRepository = AppDataSource.getRepository(Profile)

    async save(request: Request, response: Response, next: NextFunction) {
        const profile = request.body

        await AppDataSource.transaction(async (manager) => {
            await manager.save(manager.create(Profile, profile));
        })

        response.status(201).json({message: "Profile created"})
    }
}