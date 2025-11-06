const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const clientToken = req.cookies.token;

    if (clientToken) {
        try {
            const decoded = jwt.verify(clientToken, process.env.JWT_SECRET);

            req.user = { ...decoded, userType: "cliente" };

            return next();
        } catch (err) {
            console.error(
                "Token de cliente inválido (se buscará token de invitado):",
                err.message
            );
        }
    }

    const guestToken = req.cookies.guest_session;

    if (guestToken) {
        try {
            const decoded = jwt.verify(guestToken, process.env.JWT_SECRET);

            req.user = { ...decoded, userType: "noCliente" };

            return next();
        } catch (err) {
            console.error("Token de invitado inválido:", err.message);
            return res
                .status(403)
                .json({ error: "Token de invitado no válido." });
        }
    }
};


module.exports = {verifyToken};