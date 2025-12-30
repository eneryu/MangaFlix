import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user?.password) {
                    throw new Error("Email not found");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!isCorrectPassword) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    level: user.level,
                    exp: user.exp,
                    score: user.score,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role;
                token.level = (user as any).level;
                token.exp = (user as any).exp;
                token.score = (user as any).score;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role as string;
                session.user.level = token.level as number;
                session.user.exp = token.exp as number;
                session.user.score = token.score as number;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
