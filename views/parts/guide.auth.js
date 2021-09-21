exports.isAuth = (req, res, next) => {
    if (req.session.userid) next()
    else res.redirect("/auth/login")
}

exports.notAuth = (req, res, next) => {
    if (req.session.userid) res.redirect("/")
    else next()
}

exports.isAdmin = (req, res, next) => {
    if (req.session.controlLevel == 'admin') next()
    else res.redirect("/")
}