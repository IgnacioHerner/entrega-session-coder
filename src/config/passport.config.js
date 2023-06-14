import passport from "passport";
import local, { Strategy } from 'passport-local'
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use (
        "register",
        new LocalStrategy (
            {
                passReqToCallback: true,
                usernameField: 'email',
            },
            async (req, username, password, done) => {
                const {first_name, last_name, age, email} = req.body

                try {
                    const user = await userModel.findOne({email: username})

                    if (user) {
                        console.log("El usuario ya existe")
                        return done(null, false)
                    }

                    const hashedPassword = createHash(password)

                    const newUser = {
                        first_name,
                        last_name,
                        age,
                        email,
                        password: hashedPassword,
                    }

                    const result = await userModel.create(newUser)
                    return done(null, result)
                } catch (error) {
                    return done("error en la contraseña" + error)
                }
            }
        )
    )

    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email",
            },
            async(username, password, done) => {
                try {
                    const user = await userModel.findOne({email: username})
                    if(!user) {
                        console.log("El usuario ingresado no existe")
                        return done(null, false)
                    }
                    
                    if (!isValidPassword(user, password)){
                        return done(null, false)
                    }

                    return done(null, user)
                } catch(error) {
                    done("error" + error)
                }              
            }
        )
    )

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        return done(null, user)
    })

}

export default initializePassport