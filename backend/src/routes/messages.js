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
var index_js_1 = require("../blocks/index.js");
var router = (0, express_1.Router)();
/**
 * POST /api/messages
 * メッセージ送信
 */
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, content, role, messageId, timestamp, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, chatId = _a.chatId, userId = _a.userId, content = _a.content, role = _a.role;
                if (!chatId || !userId || !content || !role) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
                }
                messageId = "msg_".concat(Date.now());
                timestamp = Date.now();
                return [4 /*yield*/, index_js_1.chatTable.put({
                        chatId: chatId,
                        timestamp: timestamp,
                        messageId: messageId,
                        userId: userId,
                        content: content,
                        role: role,
                        createdAt: timestamp,
                    })];
            case 1:
                _b.sent();
                res.status(201).json({
                    success: true,
                    messageId: messageId,
                    timestamp: timestamp,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Send message error:', error_1);
                res.status(500).json({ error: 'Failed to send message' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/messages
 * チャットのメッセージ一覧取得
 */
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, _b, limit, _c, offset;
    return __generator(this, function (_d) {
        try {
            _a = req.query, chatId = _a.chatId, _b = _a.limit, limit = _b === void 0 ? '50' : _b, _c = _a.offset, offset = _c === void 0 ? '0' : _c;
            if (!chatId || typeof chatId !== 'string') {
                return [2 /*return*/, res.status(400).json({ error: 'chatId is required' })];
            }
            // ローカルでは簡略的な実装
            res.json({
                success: true,
                messages: [],
                total: 0,
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10),
            });
        }
        catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ error: 'Failed to get messages' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/messages/:messageId
 * メッセージ詳細取得
 */
router.get('/:messageId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId;
    return __generator(this, function (_a) {
        try {
            messageId = req.params.messageId;
            if (!messageId) {
                return [2 /*return*/, res.status(400).json({ error: 'messageId is required' })];
            }
            res.json({
                success: true,
                message: {
                    messageId: messageId,
                    content: 'Sample message',
                    role: 'user',
                },
            });
        }
        catch (error) {
            console.error('Get message error:', error);
            res.status(500).json({ error: 'Failed to get message' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * PUT /api/messages/:messageId
 * メッセージ編集
 */
router.put('/:messageId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, content;
    return __generator(this, function (_a) {
        try {
            messageId = req.params.messageId;
            content = req.body.content;
            if (!messageId) {
                return [2 /*return*/, res.status(400).json({ error: 'messageId is required' })];
            }
            res.json({
                success: true,
                messageId: messageId,
                content: content,
                updatedAt: Date.now(),
            });
        }
        catch (error) {
            console.error('Update message error:', error);
            res.status(500).json({ error: 'Failed to update message' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * DELETE /api/messages/:messageId
 * メッセージ削除
 */
router.delete('/:messageId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId;
    return __generator(this, function (_a) {
        try {
            messageId = req.params.messageId;
            if (!messageId) {
                return [2 /*return*/, res.status(400).json({ error: 'messageId is required' })];
            }
            res.json({
                success: true,
                message: 'Message deleted',
            });
        }
        catch (error) {
            console.error('Delete message error:', error);
            res.status(500).json({ error: 'Failed to delete message' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
