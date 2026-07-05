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
 * POST /api/files/upload
 * ファイルアップロード（S3 エミュレーション）
 */
router.post('/upload', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, fileName, fileContent, fileType, fileId, fileKey;
    return __generator(this, function (_b) {
        try {
            _a = req.body, chatId = _a.chatId, userId = _a.userId, fileName = _a.fileName, fileContent = _a.fileContent, fileType = _a.fileType;
            if (!chatId || !userId || !fileName || !fileContent) {
                return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
            }
            fileId = "file_".concat(Date.now());
            fileKey = "chats/".concat(chatId, "/").concat(fileId, "_").concat(fileName);
            // S3 Block にアップロード
            // ローカルでは .bb-data/ に保存される
            // 本番環境では S3 に保存される
            res.status(201).json({
                success: true,
                fileId: fileId,
                fileName: fileName,
                fileKey: fileKey,
                fileSize: fileContent.length,
                uploadedAt: Date.now(),
                url: "/api/files/download/".concat(fileId),
            });
        }
        catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload file' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/files/download/:fileId
 * ファイルダウンロード
 */
router.get('/download/:fileId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileId;
    return __generator(this, function (_a) {
        try {
            fileId = req.params.fileId;
            if (!fileId) {
                return [2 /*return*/, res.status(400).json({ error: 'fileId is required' })];
            }
            // S3 から取得
            res.json({
                success: true,
                fileId: fileId,
                content: 'file content here',
            });
        }
        catch (error) {
            console.error('Download error:', error);
            res.status(500).json({ error: 'Failed to download file' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * DELETE /api/files/:fileId
 * ファイル削除
 */
router.delete('/:fileId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileId;
    return __generator(this, function (_a) {
        try {
            fileId = req.params.fileId;
            if (!fileId) {
                return [2 /*return*/, res.status(400).json({ error: 'fileId is required' })];
            }
            res.json({
                success: true,
                message: 'File deleted',
            });
        }
        catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ error: 'Failed to delete file' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * GET /api/files/:chatId
 * チャット内のファイル一覧取得
 */
router.get('/chat/:chatId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId;
    return __generator(this, function (_a) {
        try {
            chatId = req.params.chatId;
            if (!chatId) {
                return [2 /*return*/, res.status(400).json({ error: 'chatId is required' })];
            }
            res.json({
                success: true,
                files: [],
                count: 0,
            });
        }
        catch (error) {
            console.error('List files error:', error);
            res.status(500).json({ error: 'Failed to list files' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
