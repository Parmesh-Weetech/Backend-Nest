import express from 'express';
import dotenv from 'dotenv';
import dbConnect, { sequelize } from './config/db.ts';
import { User } from './models/User.ts';
import { Profile } from './models/Profile.ts';
import { Transaction } from 'sequelize';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.sync();

User.hasOne(Profile, {
  foreignKey: 'userId',
  as: 'profile'
});
Profile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

const t = await sequelize.transaction();

app.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name: name,
      email: email,
      password: password
    })

    const profile = await Profile.create({
      userId: user.id
    })

    res.status(201).json({ message: "User Created", data: user.toJSON() })
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "error is there", error: error.message })
  }
});

app.put("/update", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    await user?.set({
      name: name,
      email: email
    });

    await user?.save();

    res.status(202).json({
      message: "User updated",
      data: user?.toJSON()
    })
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})

app.delete("/delete/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({
      where: {
        email: email
      },
      // force: true
    });

    await user?.destroy();

    res.status(200).json({ message: "User deleted", data: user });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})

app.get("/all", async (req, res) => {
  try {
    // const user = await User.findAll({
    //   where: {
    //     id: 2
    //   }
    // });

    const [user, metaData] = await sequelize.query('SELECT * FROM users');
    res.status(200).json({ message: "Fetched", data: user, metaData: metaData })
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(2, { transaction: t })

    res.status(200).json(user)
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on http://localhost:${PORT}`);
});