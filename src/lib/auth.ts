import { NextAuthOptions } from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"
import connectDB from "./db"
import User from "@/model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

// sign in:-
// email password
// email check === user exist
// check password
// signin successfully
// user data


// sign in
// token generate
// token ke ander user details bhi dal diya
// session ke ander user ki details dalna hai token se


const authOptions:NextAuthOptions = {
    providers:[
        // login kaise karenge
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{ label:'Email', type:'text' },
                password:{ label:'Password', type:'password' },
            },
            async authorize(credentials, req) {
                let email = credentials?.email
                let password = credentials?.password
                if (!email || !password) {
                    throw new Error("email or password is not found")
                }
                await connectDB()
                let user = await User.findOne({ email })
                if (!user) {
                    throw new Error("user not found")                    
                }
                let isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    throw new Error("incorrect password")
                }
                return {
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    image:user.image
                }
            },
        }),
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks:{
        // token ke ander user details dala
        async signIn({ account, user }) {
            if (account?.provider == "google") {
                await connectDB()
                let existUser = await User.findOne({email:user?.email})
                if (!existUser) {
                    let existUser = await User.create({
                        name:user.name,
                        email:user?.email
                    })
                }
                user.id = existUser._id as string
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
            }
            return token
        },
        // session ke ander user ki details dalega
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image as string
            }
            return session
        }
    },
    session:{
        strategy:'jwt',
        maxAge:30*24*60*60*1000
    },
    pages:{
        signIn: '/login',
        error: '/login'
    },
    secret:process.env.NEXT_AUTH_SECRET 
}
export default authOptions