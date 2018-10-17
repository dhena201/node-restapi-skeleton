const {
    Strategy,
    ExtractJwt,
} = require('passport-jwt');
const db = require('../models');

module.exports = (passport, config) => {
    let key = config.jwtSecret;
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: key,
    };
    const jwtStrategy = new Strategy(opts, (jwtPayload, done) => {
        db.User.findOne({
            where: { email: jwtPayload.email } ,
            include: [{
                model: db.UserDetail,
                as: 'one',
                where: {
                    company: jwtPayload.company
                },
                include: [{
                    model: db.Role
                }]
            }]
        })
            .then(user => {
                user.name = user.one.name
                user.role_id = user.one.roles
                user.roles = user.one.Role.name
                user.company = user.one.company
                user.employee = user.one.employee
                user.status = user.one.status
                done(null, user); return null
            })
            .catch(err => done(err, false));
    });

    passport.use(jwtStrategy);
};

