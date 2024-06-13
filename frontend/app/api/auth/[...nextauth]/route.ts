import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { Adapter } from 'next-auth/adapters';
import * as UserController from '@/controllers/User';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserDB } from '@/lib/types';
import { compare } from 'bcrypt';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },

  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,

  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const user = (await UserController.get(credentials?.email ?? '')) as
          | UserDB
          | null
          | undefined;

        if (!user) return null;

        const isPasswordValid = await compare(
          credentials?.password ?? '',
          user.password,
        );

        if (!isPasswordValid) return null;

        return {
          email: user.email,
          name: user.name,
          image: user.image ?? '',
          isAdmin: user.isAdmin ?? false,
        };
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

const handler: unknown = NextAuth(authOptions);

export { handler as GET, handler as POST };
