import axios from 'axios';
import * as querystring from 'querystring';
import rp from 'request-promise-native';
import ipfsapi from "ipfs-http-client";

// global variables
const devURL: string = 'https://dev.api.temporal.cloud';
const prodURL: string = 'https://api.temporal.cloud';
const devIPFSURL: string = 'dev.api.ipfs.temporal.cloud';
const prodIPFSURL: string = 'api.ipfs.temporal.cloud';

class Temporal {
    // class variables
    public endpoint: string;
    public ipfsendpoint: string;
    public version: string;
    private token: string;

    constructor(prod: boolean) {
        if (prod) {
            this.endpoint = prodURL;
            this.ipfsendpoint = prodIPFSURL;
        } else {
            this.endpoint = devURL;
            this.ipfsendpoint = devIPFSURL;
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
    register(username: string, email: string, password: string) {
        return axios.post(
        `${this.endpoint}/${this.version}/auth/register`,
        querystring.stringify({
            username,
            email_address: email,
            password,
        }),
        )
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Logs in an user
     * @param username The username of the user
     * @param password The password of the user
     * @return An object containing the id of the token and its expiry date
     */
    login(username: string, password: string) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/auth/login`,
        data: {
            username,
            password,
        },
        })
        .then((res) => {
            this.token = res.data.token;
            return res.data;
        })
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Gets the username of the current user
     * @return The username of the current user
     */
    getUsernameFromToken() {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/account/token/username`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Gets the available credits of the current user
     * @return The available credits
     */
    getCredits() {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/account/credits/available`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Refreshes the current auth token
     * @return An object containing the id of the token and its expiry date
     */
    refreshAuthToken() {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/auth/refresh`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Generates an IPFS key
     * @param keyType The type of the key rsa or ed25519
     * @param keyBits 2048 -> 4096 for RSA and 256 for ED25519
     * @return A success message
     */
    generateIpfsKey(keyType: number, keyBits: number, keyName: string) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/account/key/ipfs/new`,
        data: querystring.stringify({
            key_type: keyType,
            key_bits: keyBits,
            key_name: keyName,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Gets the IPFS keys
     * @return An object containing the IPFS keys owned by the current user
     */
    getIpfsKeys() {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/account/key/ipfs/get`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Exports a key as a mnemonic phrase
     * @param keyName The name of the key to export
     * @return An array containing the words of the mnemonic
     */
    exportKey(keyName: string) {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/account/key/export/${keyName}`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Publishes a message to the given pubsub topic
     * @param topic The topic to be published to
     * @param message The message to be published
     * @return An object containing the topic and the message
     */
    publishPubSubMessage(topic: string, message: string) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/ipfs/public/pubsub/publish/${topic}`,
        data: querystring.stringify({
            message,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Pins content for a specific period
     * @param hash The hash of the content
     * @param holdTime The number of months to pin for
     */
    pin(hash: string, holdTime: number) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/ipfs/public/pin/${hash}`,
        data: querystring.stringify({
            hold_time: holdTime,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Extends hold duration of the given hash
     * @notice Requires a non-free account
     * @param hash The ipfs hash to extend the hold time for
     * @param holdTime The number of months to extend. Total hold time must not be greater than 24 months
     */
    extendPin(hash: string, holdTime: number) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/ipfs/public/pin/${hash}/extend`,
        data: querystring.stringify({
            hold_time: holdTime,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Uploads a public file
     * @param file The file to upload
     * @param holdTime The number of months to pin for
     * @return The IPFS hash of the file
     */
    uploadPublicFile(file: string, holdTime: number) {
        const options = {
        method: 'POST',
        uri: `${this.endpoint}/${this.version}/ipfs/public/file/add`,
        formData: {
            hold_time: holdTime,
            file,
        },
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        };

        return rp(options)
        .then((res) => {
            const json = JSON.parse(res);

            return json.response;
        })
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Uploads a directory and pins the root hash for 1 month
     * @notice IF you want to pin for longer than 1 month call the extendPin call afterwards
     * @param file the path to the directory to upload
     */
    uploadDirectory(file: string, holdTime: number) {
        let api = ipfsapi({
            // the hostname (or ip address) of the endpoint providing the ipfs api
            host:  this.ipfsendpoint,
            // the port to connect on
            port: '443',
            'api-path': '/api/v0/',
            // the protocol, https for security
            protocol: 'https',
            // provide the jwt within an authorization header
            headers: {
                authorization: 'Bearer ' + this.token
            }
        });
        api.addFromFs(file, { recursive: true },  function (err, response) {
            if (err) {
                console.error(err, err.stack)
            } else {
                response.forEach(element => {
                    if (file.includes(element.path)) {
                        console.log("make sure to extend pin duration")
                        return element.path;
                    }
                });
            }
        })
    }

    /**
     * Gets the stat of an object
     * @param hash The hash of the object
     * @return An object containing the Hash, BlockSize,
     * CumulativeSize, DataSize, LinksSize and NumLinks
     */
    getObjectStat(hash: string) {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/ipfs/public/stat/${hash}`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Gets the dag
     * @param hash The hash to look for
     * @return An object containing the associated IPLD
     */
    getDag(hash: string) {
        return axios({
        method: 'get',
        url: `${this.endpoint}/${this.version}/ipfs/public/dag/${hash}`,
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Downloads a file
     * @param hash The hash of the file to download
     * @return The file as a stream
     */
    download(hash: string) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/ipfs/utils/download/${hash}`,
        data: querystring.stringify({
            network_name: '',
        }),
        responseType: 'stream',
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Publishes IPNS records to the public networks
     * @param hash The hash of the content
     * @param lifetime The lifetime of the content
     * @param ttl The lifetime of the content
     * @param key The key of the content
     * @param resolve
     * @return A success message
     */
    publishDetails(hash: string, lifetime: string, ttl: string, key: string, resolve: boolean) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/ipns/public/publish/details`,
        data: querystring.stringify({
            hash,
            life_time: lifetime,
            ttl,
            key,
            resolve,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }

    /**
     * Submits a search to Lens for ipfs content matching the query
     * @param query the search query to match content against
     * @param tags optional tags to filter by
     * @param categories optional search categories to filter by
     * @param mimeTypes optional content mime types to filter by
     * @param hashes optional hashes to filter by
     * @param required whether or not an exact match is required
     */
    searchRequest(
        query: string, 
        tags?: string[], // the ?: indicates optional
        categories?: string[], // the ?: indicates optional 
        mimeTypes?: string[], // the ?: indicates optional 
        hashes?: string[], // the ?: indicates optional 
        required?: boolean, // the ?: indicates optional
    ) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/lens/search`,
        data: querystring.stringify({
            query,
            tags,
            categories,
            mime_types: mimeTypes,
            hashes,
            required,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response.results)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }
    
    /**
     * Index an IPFS hash to be searchable through lens
     * @param hash The IPFS hash to idnex
     * @param type The type of content, use IPLD for all types
     */
    indexRequest(hash: string, type: string) {
        return axios({
        method: 'post',
        url: `${this.endpoint}/${this.version}/lens/index`,
        data: querystring.stringify({
            object_identifier: hash,
            object_type: type,
        }),
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        })
        .then(res => res.data.response)
        .catch((err) => {
            throw new Error(err.response.data.response);
        });
    }
}

module.exports = Temporal;