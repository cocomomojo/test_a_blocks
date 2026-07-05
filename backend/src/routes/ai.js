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
 * POST /api/ai/generate
 * AI レスポンス生成（Bedrock エミュレーション）
 */
router.post('/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, messages, lastUserMessage, response;
    var _b;
    return __generator(this, function (_c) {
        try {
            _a = req.body, chatId = _a.chatId, userId = _a.userId, messages = _a.messages;
            if (!chatId || !userId || !messages || messages.length === 0) {
                return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
            }
            lastUserMessage = ((_b = messages
                .reverse()
                .find(function (m) { return m.role === 'user'; })) === null || _b === void 0 ? void 0 : _b.content) || '';
            response = generateMockResponse(lastUserMessage);
            res.json({
                success: true,
                response: response,
                model: 'bedrock-local-emulation',
                generatedAt: Date.now(),
            });
        }
        catch (error) {
            console.error('Generate response error:', error);
            res.status(500).json({ error: 'Failed to generate response' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * ローカルエミュレーション用の簡略レスポンス生成
 */
function generateMockResponse(userInput) {
    var responses = {
        hi: 'こんにちは！何かお手伝いできることはありますか？',
        hello: 'Hello! How can I assist you today?',
        help: 'I can help you with various tasks. What do you need?',
        thanks: 'You\'re welcome! Is there anything else I can help with?',
        bye: 'Goodbye! Have a great day!',
    };
    var lowerInput = userInput.toLowerCase().trim();
    for (var _i = 0, _a = Object.entries(responses); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (lowerInput.includes(key)) {
            return value;
        }
    }
    // デフォルト応答
    return "I received your message: \"".concat(userInput, "\". This is a local emulation response. In production, this would be powered by Bedrock AI.");
}
/**
 * POST /api/ai/stream
 * AI レスポンス ストリーミング生成
 */
router.post('/stream', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, messages, lastUserMessage, fullResponse_1, index_1, interval_1;
    var _b;
    return __generator(this, function (_c) {
        try {
            _a = req.body, chatId = _a.chatId, userId = _a.userId, messages = _a.messages;
            if (!chatId || !userId || !messages || messages.length === 0) {
                return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
            }
            // Server-Sent Events (SSE) でストリーミング応答を返す
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            lastUserMessage = ((_b = messages.reverse().find(function (m) { return m.role === 'user'; })) === null || _b === void 0 ? void 0 : _b.content) || '';
            fullResponse_1 = generateMockResponse(lastUserMessage);
            index_1 = 0;
            interval_1 = setInterval(function () {
                if (index_1 < fullResponse_1.length) {
                    res.write("data: ".concat(JSON.stringify({ chunk: fullResponse_1[index_1] }), "\n\n"));
                    index_1++;
                }
                else {
                    res.write('data: [DONE]\n\n');
                    clearInterval(interval_1);
                    res.end();
                }
            }, 50);
        }
        catch (error) {
            console.error('Stream response error:', error);
            res.status(500).json({ error: 'Failed to stream response' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/ai/models
 * 利用可能なモデル一覧
 */
router.get('/models', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                success: true,
                models: [
                    {
                        id: 'bedrock-local-emulation',
                        name: 'Bedrock Local Emulation',
                        type: 'text-generation',
                        maxTokens: 512,
                    },
                ],
            });
        }
        catch (error) {
            console.error('List models error:', error);
            res.status(500).json({ error: 'Failed to list models' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
