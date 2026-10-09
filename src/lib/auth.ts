import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DATABASE_URL as string);
const db = client.db("BazarDor");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.BETTER_AUTH_GOGGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOGGLE_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
