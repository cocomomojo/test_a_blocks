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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_js_1 = require("../blocks/index.js");
var router = (0, express_1.Router)();
/**
 * POST /api/chats
 * 新規チャット作成
 */
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, title, _b, participants, chatId, now, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, title = _a.title, _b = _a.participants, participants = _b === void 0 ? [] : _b;
                if (!userId || !title) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
                }
                chatId = "chat_".concat(Date.now());
                now = Date.now();
                return [4 /*yield*/, index_js_1.chatTable.put({
                        chatId: chatId,
                        userId: userId,
                        title: title,
                        participants: __spreadArray([userId], participants, true),
                        createdAt: now,
                        timestamp: now,
                        messageCount: 0,
                    })];
            case 1:
                _c.sent();
                res.status(201).json({
                    success: true,
                    chatId: chatId,
                    title: title,
                    createdAt: now,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('Create chat error:', error_1);
                res.status(500).json({ error: 'Failed to create chat' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/chats
 * ユーザーのチャット一覧取得
 */
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        try {
            userId = req.query.userId;
            if (!userId || typeof userId !== 'string') {
                return [2 /*return*/, res.status(400).json({ error: 'userId is required' })];
            }
            // ローカルでは簡略的な実装
            // 本番環境ではクエリ機能を使用
            res.json({
                success: true,
                chats: [],
                count: 0,
            });
        }
        catch (error) {
            console.error('Get chats error:', error);
            res.status(500).json({ error: 'Failed to get chats' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/chats/:chatId
 * チャット詳細取得
 */
router.get('/:chatId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId;
    return __generator(this, function (_a) {
        try {
            chatId = req.params.chatId;
            if (!chatId) {
                return [2 /*return*/, res.status(400).json({ error: 'chatId is required' })];
            }
            res.json({
                success: true,
                chat: {
                    chatId: chatId,
                    title: 'Sample Chat',
                    createdAt: Date.now(),
                },
            });
        }
        catch (error) {
            console.error('Get chat error:', error);
            res.status(500).json({ error: 'Failed to get chat' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * PUT /api/chats/:chatId
 * チャット更新（タイトル変更など）
 */
router.put('/:chatId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, _a, title, participants;
    return __generator(this, function (_b) {
        try {
            chatId = req.params.chatId;
            _a = req.body, title = _a.title, participants = _a.participants;
            if (!chatId) {
                return [2 /*return*/, res.status(400).json({ error: 'chatId is required' })];
            }
            // ローカルでは簡略的な実装
            res.json({
                success: true,
                chatId: chatId,
                title: title,
                participants: participants,
            });
        }
        catch (error) {
            console.error('Update chat error:', error);
            res.status(500).json({ error: 'Failed to update chat' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * DELETE /api/chats/:chatId
 * チャット削除
 */
router.delete('/:chatId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId;
    return __generator(this, function (_a) {
        try {
            chatId = req.params.chatId;
            if (!chatId) {
                return [2 /*return*/, res.status(400).json({ error: 'chatId is required' })];
            }
            res.json({
                success: true,
                message: 'Chat deleted',
            });
        }
        catch (error) {
            console.error('Delete chat error:', error);
            res.status(500).json({ error: 'Failed to delete chat' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
