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
var node_cron_1 = require("node-cron");
var prisma_1 = require("../lib/prisma");
var yahoo_finance2_1 = require("yahoo-finance2");
function updateAllStocks() {
    return __awaiter(this, void 0, void 0, function () {
        var symbols, uniqueSymbols, _i, uniqueSymbols_1, symbol, result, _a, result_1, day, err_1, err_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, prisma_1.prisma.stockPrice.findMany({
                            select: { symbol: true },
                            distinct: ['symbol'],
                        })];
                case 1:
                    symbols = _d.sent();
                    uniqueSymbols = Array.from(new Set(symbols.map(function (s) { return s.symbol; })));
                    _i = 0, uniqueSymbols_1 = uniqueSymbols;
                    _d.label = 2;
                case 2:
                    if (!(_i < uniqueSymbols_1.length)) return [3 /*break*/, 11];
                    symbol = uniqueSymbols_1[_i];
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 9, , 10]);
                    return [4 /*yield*/, yahoo_finance2_1.default.historical(symbol, {
                            period1: '2023-01-01',
                            interval: '1d',
                        })];
                case 4:
                    result = _d.sent();
                    if (!result || result.length === 0) {
                        return [3 /*break*/, 10];
                    }
                    _a = 0, result_1 = result;
                    _d.label = 5;
                case 5:
                    if (!(_a < result_1.length)) return [3 /*break*/, 8];
                    day = result_1[_a];
                    return [4 /*yield*/, prisma_1.prisma.stockPrice.upsert({
                            where: {
                                symbol_date: {
                                    symbol: symbol.toUpperCase(),
                                    date: day.date,
                                },
                            },
                            update: {
                                open: day.open,
                                high: day.high,
                                low: day.low,
                                close: day.close,
                                volume: BigInt((_b = day.volume) !== null && _b !== void 0 ? _b : 0),
                            },
                            create: {
                                symbol: symbol.toUpperCase(),
                                date: day.date,
                                open: day.open,
                                high: day.high,
                                low: day.low,
                                close: day.close,
                                volume: BigInt((_c = day.volume) !== null && _c !== void 0 ? _c : 0),
                            },
                        })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _d.sent();
                    console.error("Error updating ".concat(symbol, ":"), err_1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_2 = _d.sent();
                    console.error('Error in updateAllStocks:', err_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}

node_cron_1.default.schedule('*/30 * * * *', updateAllStocks); // Run every 30 minutes

if (require.main === module) {
    updateAllStocks();
}
