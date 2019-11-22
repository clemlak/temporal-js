"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var querystring = __importStar(require("querystring"));
var request_promise_native_1 = __importDefault(require("request-promise-native"));
// global variables
var devURL = 'https://dev.api.temporal.cloud';
var prodURL = 'https://api.temporal.cloud';
var Temporal = /** @class */ (function () {
    function Temporal(prod) {
        if (prod) {
            this.endpoint = prodURL;
        }
        else {
            this.endpoint = devURL;
        }
        this.version = 'v2';
        this.token = '';
    }
    /**
     * @notice Registers a new user
     * @param username The username of the new user
     * @param email The email of the new user
     * @param password The password of the new user
     * @return An object containing all the information of the new account
     */
    Temporal.prototype.register = function (username, email, password) {
        return axios_1.default.post(this.endpoint + "/" + this.version + "/auth/register", querystring.stringify({
            username: username,
            email_address: email,
            password: password,
        }))
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Logs in an user
     * @param username The username of the user
     * @param password The password of the user
     * @return An object containing the id of the token and its expiry date
     */
    Temporal.prototype.login = function (username, password) {
        var _this = this;
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/auth/login",
            data: {
                username: username,
                password: password,
            },
        })
            .then(function (res) {
            _this.token = res.data.token;
            return res.data;
        })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Gets the username of the current user
     * @return The username of the current user
     */
    Temporal.prototype.getUsernameFromToken = function () {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/account/token/username",
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Gets the available credits of the current user
     * @return The available credits
     */
    Temporal.prototype.getCredits = function () {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/account/credits/available",
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Refreshes the current auth token
     * @return An object containing the id of the token and its expiry date
     */
    Temporal.prototype.refreshAuthToken = function () {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/auth/refresh",
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Generates an IPFS key
     * @param keyType The type of the key rsa or ed25519
     * @param keyBits 2048 -> 4096 for RSA and 256 for ED25519
     * @return A success message
     */
    Temporal.prototype.generateIpfsKey = function (keyType, keyBits, keyName) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/account/key/ipfs/new",
            data: querystring.stringify({
                key_type: keyType,
                key_bits: keyBits,
                key_name: keyName,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Gets the IPFS keys
     * @return An object containing the IPFS keys owned by the current user
     */
    Temporal.prototype.getIpfsKeys = function () {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/account/key/ipfs/get",
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Exports a key as a mnemonic phrase
     * @param keyName The name of the key to export
     * @return An array containing the words of the mnemonic
     */
    Temporal.prototype.exportKey = function (keyName) {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/account/key/export/" + keyName,
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Publishes a message to the given pubsub topic
     * @param topic The topic to be published to
     * @param message The message to be published
     * @return An object containing the topic and the message
     */
    Temporal.prototype.publishPubSubMessage = function (topic, message) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/ipfs/public/pubsub/publish/" + topic,
            data: querystring.stringify({
                message: message,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Pins content for a specific period
     * @param hash The hash of the content
     * @param holdTime The number of months to pin for
     */
    Temporal.prototype.pin = function (hash, holdTime) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/ipfs/public/pin/" + hash,
            data: querystring.stringify({
                hold_time: holdTime,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    Temporal.prototype.extendPin = function (hash, holdTime) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/ipfs/public/pin/" + hash + "/extend",
            data: querystring.stringify({
                hold_time: holdTime,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Uploads a public file
     * @param file The file to upload
     * @param holdTime The number of months to pin for
     * @return The IPFS hash of the file
     */
    Temporal.prototype.uploadPublicFile = function (file, holdTime) {
        var options = {
            method: 'POST',
            uri: this.endpoint + "/" + this.version + "/ipfs/public/file/add",
            formData: {
                hold_time: holdTime,
                file: file,
            },
            headers: {
                Authorization: "Bearer " + this.token,
            },
        };
        return request_promise_native_1.default(options)
            .then(function (res) {
            var json = JSON.parse(res);
            return json.response;
        })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    Temporal.prototype.uploadDirectory = function (file, holdTime) {
        var options = {
            method: 'POST',
            uri: this.endpoint + "/" + this.version + "/ipfs/public/file/add/directory",
            formData: {
                hold_time: holdTime,
                file: file,
            },
            headers: {
                Authorization: "Bearer " + this.token,
            },
        };
        return request_promise_native_1.default(options)
            .then(function (res) {
            var json = JSON.parse(res);
            return json.response;
        })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Gets the stat of an object
     * @param hash The hash of the object
     * @return An object containing the Hash, BlockSize,
     * CumulativeSize, DataSize, LinksSize and NumLinks
     */
    Temporal.prototype.getObjectStat = function (hash) {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/ipfs/public/stat/" + hash,
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Gets the dag
     * @param hash The hash to look for
     * @return An object containing the associated IPLD
     */
    Temporal.prototype.getDag = function (hash) {
        return axios_1.default({
            method: 'get',
            url: this.endpoint + "/" + this.version + "/ipfs/public/dag/" + hash,
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Downloads a file
     * @param hash The hash of the file to download
     * @return The file as a stream
     */
    Temporal.prototype.download = function (hash) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/ipfs/utils/download/" + hash,
            data: querystring.stringify({
                network_name: '',
            }),
            responseType: 'stream',
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    /**
     * Publishes IPNS records to the public networks
     * @param hash The hash of the content
     * @param lifetime The lifetime of the content
     * @param ttl The lifetime of the content
     * @param key The key of the content
     * @param resolve
     * @return A success message
     */
    Temporal.prototype.publishDetails = function (hash, lifetime, ttl, key, resolve) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/ipns/public/publish/details",
            data: querystring.stringify({
                hash: hash,
                life_time: lifetime,
                ttl: ttl,
                key: key,
                resolve: resolve,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    Temporal.prototype.searchRequest = function (query, tags, // the ?: indicates optional
    categories, // the ?: indicates optional 
    mimeTypes, // the ?: indicates optional 
    hashes, // the ?: indicates optional 
    required) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/lens/search",
            data: querystring.stringify({
                query: query,
                tags: tags,
                categories: categories,
                mime_types: mimeTypes,
                hashes: hashes,
                required: required,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response.results; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    Temporal.prototype.indexRequest = function (hash, type) {
        return axios_1.default({
            method: 'post',
            url: this.endpoint + "/" + this.version + "/lens/index",
            data: querystring.stringify({
                object_identifier: hash,
                object_type: type,
            }),
            headers: {
                Authorization: "Bearer " + this.token,
            },
        })
            .then(function (res) { return res.data.response; })
            .catch(function (err) {
            throw new Error(err.response.data.response);
        });
    };
    return Temporal;
}());
module.exports = Temporal;
