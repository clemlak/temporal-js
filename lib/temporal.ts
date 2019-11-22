import axios from 'axios';
import * as querystring from 'querystring';
import rp from 'request-promise-native';


// global variables
const devURL: string = 'https://dev.api.temporal.cloud';
const prodURL: string = 'https://api.temporal.cloud';

class Temporal {
    // class variables
    public endpoint: string;
    public version: string;
    private token: string;

    constructor(prod: boolean) {
        if (prod) {
            this.endpoint = prodURL;
        } else {
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

    uploadDirectory(file: string, holdTime: number) {
        const options = {
        method: 'POST',
        uri: `${this.endpoint}/${this.version}/ipfs/public/file/add/directory`,
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