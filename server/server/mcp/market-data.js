"use strict";
/**
 * MCP Market Data Service
 * Fetches and processes real-time market data from Indian exchanges
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MarketDataService = void 0;
var utils_1 = require("../utils");
var node_fetch_1 = require("node-fetch");
var MCP_URL = process.env.MCP_URL;
var MCP_API_KEY = process.env.MCP_API_KEY;
var MarketDataService = /** @class */ (function () {
    function MarketDataService() {
        this.marketData = [];
        // If MCP is not configured, use mock data
        if (!MCP_URL || !MCP_API_KEY) {
            this.initializeMarketData();
        }
        this.lastUpdateTime = Date.now();
    }
    /**
     * Initialize with sample market data for development
     */
    MarketDataService.prototype.initializeMarketData = function () {
        this.marketData = [
            {
                id: 1,
                symbol: "NIFTY",
                name: "NIFTY 50",
                value: 19425.35,
                change: 92.7,
                changePercent: 0.48,
                lastUpdated: new Date(),
                data: this.generateChartData(19425.35, 10, 0.48)
            },
            {
                id: 2,
                symbol: "SENSEX",
                name: "SENSEX",
                value: 64882.3,
                change: 335.62,
                changePercent: 0.52,
                lastUpdated: new Date(),
                data: this.generateChartData(64882.3, 30, 0.52)
            },
            {
                id: 3,
                symbol: "BANKNIFTY",
                name: "BANK NIFTY",
                value: 44328.8,
                change: -53.15,
                changePercent: -0.12,
                lastUpdated: new Date(),
                data: this.generateChartData(44328.8, 20, -0.12)
            }
        ];
    };
    /**
     * Get all market data
     */
    MarketDataService.prototype.getMarketData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(MCP_URL && MCP_API_KEY)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(MCP_URL, "/market-data"), {
                                headers: { 'Authorization': "Bearer ".concat(MCP_API_KEY) }
                            })];
                    case 2:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Failed to fetch market data from MCP');
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        // NOTE: If your MCP API returns date strings, you may want to convert them to Date objects here.
                        return [2 /*return*/, data];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching real-time market data from MCP:', error_1);
                        // fallback to mock data
                        return [2 /*return*/, this.marketData];
                    case 5: return [2 /*return*/, this.marketData];
                }
            });
        });
    };
    /**
     * Get market data by symbol
     */
    MarketDataService.prototype.getMarketDataBySymbol = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(MCP_URL && MCP_API_KEY)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(MCP_URL, "/market-data/symbol/").concat(encodeURIComponent(symbol)), {
                                headers: { 'Authorization': "Bearer ".concat(MCP_API_KEY) }
                            })];
                    case 2:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Failed to fetch market data by symbol from MCP');
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        // NOTE: If your MCP API returns date strings, you may want to convert them to Date objects here.
                        return [2 /*return*/, data];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error fetching real-time market data by symbol from MCP:', error_2);
                        // fallback to mock data
                        return [2 /*return*/, this.marketData.find(function (market) { return market.symbol.toLowerCase() === symbol.toLowerCase(); })];
                    case 5: return [2 /*return*/, this.marketData.find(function (market) { return market.symbol.toLowerCase() === symbol.toLowerCase(); })];
                }
            });
        });
    };
    /**
     * Add market data
     */
    MarketDataService.prototype.addMarketData = function (data) {
        var _a;
        var newData = __assign(__assign({ id: (0, utils_1.generateRandomId)() }, data), { lastUpdated: new Date(), data: (_a = data.data) !== null && _a !== void 0 ? _a : [] // Ensure data is present, fallback to empty array
         });
        this.marketData.push(newData);
        this.lastUpdateTime = Date.now();
        return newData;
    };
    /**
     * Update market data
     */
    MarketDataService.prototype.updateMarketData = function (id, data) {
        var _a, _b;
        var index = this.marketData.findIndex(function (market) { return market.id === id; });
        if (index === -1)
            return undefined;
        var updatedData = __assign(__assign(__assign({}, this.marketData[index]), data), { lastUpdated: new Date(), data: (_b = (_a = data.data) !== null && _a !== void 0 ? _a : this.marketData[index].data) !== null && _b !== void 0 ? _b : [] // Ensure data is present
         });
        this.marketData[index] = updatedData;
        this.lastUpdateTime = Date.now();
        return updatedData;
    };
    /**
     * Get last update time
     */
    MarketDataService.prototype.getLastUpdateTime = function () {
        return this.lastUpdateTime;
    };
    /**
     * Generate chart data for visualization
     */
    MarketDataService.prototype.generateChartData = function (baseValue, volatility, trend) {
        var data = [];
        var value = baseValue - (baseValue * Math.abs(trend) / 100) * 50; // Start from a value that will trend to the current value
        var now = Date.now();
        var timeStep = 5 * 60 * 1000; // 5 minutes
        // Direction of the trend
        var direction = trend >= 0 ? 1 : -1;
        for (var i = 0; i < 50; i++) {
            // Random change with trend bias
            var randomChange = (Math.random() - 0.5) * volatility;
            var trendChange = (volatility * 0.1) * direction;
            // Update value
            value = value + randomChange + trendChange;
            // Add data point
            data.push({
                time: now - (50 - i) * timeStep,
                value: value
            });
        }
        return data;
    };
    return MarketDataService;
}());
exports.MarketDataService = MarketDataService;
