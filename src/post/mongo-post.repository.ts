import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPostRepository } from './post.repository.interface';

@Injectable()
export class MongoPostRepository implements IPostRepository {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<any>,
    ) { }

    private toPlain(document: any) {
        if (!document) return null;

        const raw = typeof document.toObject === 'function'
            ? document.toObject()
            : document;

        const id = raw?._id?.toString?.() ?? String(raw._id ?? raw.id);
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id,
        };
    }

    async create(data: any) {
        const document = new this.postModel(data);
        const saved = await document.save();
        return this.toPlain(saved);
    }

    async findAll(userId: string) {
        let posts = await this.postModel.aggregate([
            { $match: { userId } },
            {
                $lookup: {
                    from: "users",
                    let: { userIdStr: "$userId" },   // post.userId
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", { $toObjectId: "$$userIdStr" }] }
                            }
                        },
                        {
                            $lookup: {
                                from: "roles",
                                as: "role",
                                let: { roleId: "$roles" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $in: [
                                                    "$_id",
                                                    {
                                                        $map: {
                                                            input: "$$roleId",   // the array of strings
                                                            as: "r",
                                                            in: { $toObjectId: "$$r" } // convert each string individually
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "organizations",
                                            as: "organization",
                                            let: { orgId: "$organization" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: ["$_id", { $toObjectId: "$$orgId" }]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                    ],
                    as: "user",
                }
            },
            { $unwind: "$user" }
        ]);

        posts = Array.isArray(posts) ? posts.map((post) => {
            post.user.roles = post.user.role.map((r) => {
                r.organization = r.organization.map((org) => this.toPlain(org))
                return this.toPlain(r);
            });
            post.user = this.toPlain(post.user);
            return this.toPlain(post);
        }) : [];



        return posts;
    }

    async findOne(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const [post] = await this.postModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "users",
                    as: "user",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$userId" }]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 1
            }
        ]);

        post.user = this.toPlain(post.user);
        return this.toPlain(post);
    }

    async update(id: string, data: any) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.postModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
        return this.toPlain(document);
    }

    async remove(id: string) {
        const result = await this.postModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
