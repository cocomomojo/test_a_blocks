"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
/**
 * POST /api/email/send
 * メール送信（SES エミュレーション）
 */
router.post('/send', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, subject, body, chatId, emailId;
    return __generator(this, function (_b) {
        try {
            _a = req.body, to = _a.to, subject = _a.subject, body = _a.body, chatId = _a.chatId;
            if (!to || !subject || !body) {
                return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
            }
            emailId = "email_".concat(Date.now());
            // ローカルエミュレーションでは、メール送信ログをコンソールに出力
            // 本番環境では SES に統合
            console.log("\n[EMAIL NOTIFICATION]\nID: ".concat(emailId, "\nTo: ").concat(to, "\nSubject: ").concat(subject, "\nBody: ").concat(body, "\nChat ID: ").concat(chatId || 'N/A', "\nSent at: ").concat(new Date().toISOString(), "\n    "));
            res.json({
                success: true,
                emailId: emailId,
                to: to,
                subject: subject,
                status: 'sent',
                timestamp: Date.now(),
            });
        }
        catch (error) {
            console.error('Send email error:', error);
            res.status(500).json({ error: 'Failed to send email' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/email/status/:emailId
 * メール送信ステータス確認
 */
router.get('/status/:emailId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailId;
    return __generator(this, function (_a) {
        try {
            emailId = req.params.emailId;
            if (!emailId) {
                return [2 /*return*/, res.status(400).json({ error: 'emailId is required' })];
            }
            res.json({
                success: true,
                emailId: emailId,
                status: 'delivered',
                deliveredAt: Date.now(),
            });
        }
        catch (error) {
            console.error('Get email status error:', error);
            res.status(500).json({ error: 'Failed to get email status' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * POST /api/email/notify-user
 * ユーザー通知メール送信
 * （新規メッセージ、新規返信など）
 */
router.post('/notify-user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, chatId, emailId, notificationSubject, notificationBody;
    return __generator(this, function (_b) {
        try {
            _a = req.body, to = _a.to, chatId = _a.chatId;
            if (!to) {
                return [2 /*return*/, res.status(400).json({ error: 'Email is required' })];
            }
            emailId = "email_".concat(Date.now());
            notificationSubject = "New message in chat".concat(chatId ? " ".concat(chatId) : '');
            notificationBody = "You have received a new message. Check your chat for details.";
            console.log("\n[EMAIL NOTIFICATION - USER UPDATE]\nID: ".concat(emailId, "\nTo: ").concat(to, "\nSubject: ").concat(notificationSubject, "\nBody: ").concat(notificationBody, "\nSent at: ").concat(new Date().toISOString(), "\n    "));
            res.json({
                success: true,
                emailId: emailId,
                to: to,
                type: 'user-notification',
                status: 'sent',
                timestamp: Date.now(),
            });
        }
        catch (error) {
            console.error('Send notification error:', error);
            res.status(500).json({ error: 'Failed to send notification' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
