// user-profile.view.ts
import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
    name: "user_profile_view",
    expression: `
    SELECT
      u.id   AS "userId",
      u.name AS "userName",
      p.id   AS "profileId",
      p.bio  AS "profileBio"
    FROM "user" u
    LEFT JOIN profile p
      ON u."profileId" = p.id
  `
})
export class UserProfileView {
    @ViewColumn()
    userId: string;

    @ViewColumn()
    userName: string;

    @ViewColumn()
    profileId: string | null;

    @ViewColumn()
    profileBio: string | null;
}
