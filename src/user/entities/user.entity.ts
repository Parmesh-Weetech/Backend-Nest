import { Exclude, Expose } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import bcrypt from "bcryptjs";
import { Auth } from "src/auth/entities/auth.entity";
import { Role } from "src/role/entities/role.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Expose()
    id: string

    @Column()
    @Expose()
    name: string

    @Column({ unique: true })
    @Expose()
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({ default: "6cff2f02-0c0e-4c56-9e61-7d5b88159656" })
    @Exclude()
    roleId: string

    @ManyToOne(() => Auth, (auth) => auth.user)
    @JoinColumn()
    auth: Auth

    @ManyToOne(() => Role, role => role.users)  // Many users can belong to one role
    role: Role;


    @BeforeInsert()
    @BeforeUpdate()
    async hashpassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}