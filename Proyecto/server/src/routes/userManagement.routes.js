const { guestSessionController, registerController, loginController, verifyController, logoutController } = require("../controllers/userManagement.controllers");
const { Router } = require("express");
const router = Router();

// needed fields in request: rut, correo, telefono
router.post("/api/userManagement/guest-session", async (req, res) => {
    guestSessionController(req, res);
});

// needed fields in request: rut, nombre, correo, password, telefono, ocupacion, ingresoLiquido, direccion
router.post("/api/userManagement/register", async (req, res) => {
    registerController(req, res);
});

// needed fields in request: rut, password
router.post("/api/userManagement/login", async (req, res) => {
    loginController(req, res);
});

// needed fields in request: N/A
router.post("/api/userManagement/logout", (req, res) => {
    logoutController(res);
});

// needed fields in request: Cookies(token)
router.get("/api/userManagement/verify", (req, res) => {
    verifyController(req, res);
});

module.exports = router;
