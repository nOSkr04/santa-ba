import { readFileSync } from "fs";
import { connect } from "mongoose";
import colors from "colors";
import { config } from "dotenv";
import { create, deleteMany } from "./models/User.js";

config({ path: "./config/config.env" });

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const users = JSON.parse(readFileSync(__dirname + "/data/user.json", "utf-8"));

const importData = async () => {
  try {
    await create(users);
    console.log("Өгөгдлийг импортлолоо....".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await deleteMany();
    console.log("Өгөгдлийг бүгдийг устгалаа....".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
