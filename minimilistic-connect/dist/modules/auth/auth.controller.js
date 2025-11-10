"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
// Helper to get request metadata
const getReqMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get('User-Agent'),
});
exports.authController = {
    signup: async (req, res, next) => {
        try {
            const user = await auth_service_1.authService.signup(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    verifyEmail: async (req, res, next) => {
        try {
            const { token } = req.body;
            const message = await auth_service_1.authService.verifyEmail(token);
            res.status(200).json(message);
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const meta = getReqMeta(req);
            const tokens = await auth_service_1.authService.login(req.body, meta.ip, meta.userAgent);
            // NOTE: You can also set cookies here if needed
            res.status(200).json(tokens);
        }
        catch (error) {
            next(error);
        }
    },
    oauthCallback: async (req, res, next) => {
        try {
            const { provider, code } = req.body;
            const meta = getReqMeta(req);
            const tokens = await auth_service_1.authService.oauthCallback(provider, code, meta.ip, meta.userAgent);
            res.status(200).json(tokens);
        }
        catch (error) {
            next(error);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const meta = getReqMeta(req);
            const tokens = await auth_service_1.authService.refresh(refreshToken, meta.ip, meta.userAgent);
            res.status(200).json(tokens);
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const meta = getReqMeta(req);
            await auth_service_1.authService.logout(refreshToken, meta.ip, meta.userAgent);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    },
};
