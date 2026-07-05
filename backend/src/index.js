"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var auth_js_1 = require("./routes/auth.js");
var chats_js_1 = require("./routes/chats.js");
var messages_js_1 = require("./routes/messages.js");
var files_js_1 = require("./routes/files.js");
var ai_js_1 = require("./routes/ai.js");
var email_js_1 = require("./routes/email.js");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
var NODE_ENV = process.env.NODE_ENV || 'development';
// Middleware
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // ローカル開発環境
        var localOrigins = ['http://localhost:3000', 'http://localhost:5173'];
        // Codespaces環境
        var codespacesOrigin = origin && origin.match(/app\.github\.dev$/);
        if (!origin || localOrigins.includes(origin) || codespacesOrigin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Request logging
app.use(function (req, _res, next) {
    console.log("[".concat(new Date().toISOString(), "] ").concat(req.method, " ").concat(req.path));
    next();
});
// Health check endpoint
app.get('/health', function (_req, res) {
    res.json({
        status: 'ok',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', auth_js_1.default);
app.use('/api/chats', chats_js_1.default);
app.use('/api/messages', messages_js_1.default);
app.use('/api/files', files_js_1.default);
app.use('/api/ai', ai_js_1.default);
app.use('/api/email', email_js_1.default);
// Error handling middleware
app.use(function (err, _req, res, _next) {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: NODE_ENV === 'development' ? err.message : undefined,
    });
});
// 404 handler
app.use(function (_req, res) {
    res.status(404).json({ error: 'Not Found' });
});
// Start server
app.listen(PORT, function () {
    console.log("\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n\u2551  AWS Blocks Chatbot Backend            \u2551\n\u2551  Express Server Listening              \u2551\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n\nEnvironment: ".concat(NODE_ENV, "\nPort: ").concat(PORT, "\nBase URL: http://localhost:").concat(PORT, "\n\nEndpoints:\n  - /api/auth      (Authentication)\n  - /api/chats     (Chat Management)\n  - /api/messages  (Message Handling)\n  - /api/files     (File Upload/Storage)\n  - /api/ai        (AI Response Generation)\n  - /api/email     (Email Notifications)\n  "));
});
exports.default = app;
