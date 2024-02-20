import mongoose from 'mongoose';
import { randPastDate, randCity, randBoolean, randTransactionType, randPronoun, randNumber, randEmail } from '@ngneat/falso';
import Sales from "../models/SalesModel";

const uri = process.env.DB_URL!;

const generateSalesData = async () => {
    await mongoose.connect(uri, {
        ALPNProtocols: undefined,
        appName: "",
        auth: undefined,
        authMechanism: undefined,
        authMechanismProperties: undefined,
        authSource: "",
        autoCreate: false,
        autoEncryption: undefined,
        autoIndex: false,
        bufferCommands: false,
        ca: undefined,
        cert: undefined,
        checkKeys: false,
        checkServerIdentity: undefined,
        ciphers: undefined,
        compressors: undefined,
        connectTimeoutMS: 0,
        crl: undefined,
        dbName: "",
        directConnection: false,
        driverInfo: undefined,
        ecdhCurve: undefined,
        enableUtf8Validation: false,
        family: undefined,
        forceServerObjectId: false,
        heartbeatFrequencyMS: 0,
        hints: undefined,
        ignoreUndefined: false,
        journal: false,
        key: undefined,
        loadBalanced: false,
        localAddress: undefined,
        localPort: undefined,
        localThresholdMS: 0,
        lookup: undefined,
        maxConnecting: 0,
        maxIdleTimeMS: 0,
        maxPoolSize: 0,
        maxStalenessSeconds: 0,
        minDHSize: undefined,
        minHeartbeatFrequencyMS: 0,
        minPoolSize: 0,
        monitorCommands: false,
        noDelay: false,
        pass: "",
        passphrase: undefined,
        pfx: undefined,
        pkFactory: undefined,
        proxyHost: "",
        proxyPassword: "",
        proxyPort: 0,
        proxyUsername: "",
        raw: false,
        readConcern: undefined,
        readConcernLevel: undefined,
        readPreference: undefined,
        readPreferenceTags: [],
        rejectUnauthorized: undefined,
        replicaSet: "",
        retryReads: false,
        retryWrites: false,
        secureContext: undefined,
        secureProtocol: undefined,
        serializeFunctions: false,
        serverApi: undefined,
        serverSelectionTimeoutMS: 0,
        servername: undefined,
        session: undefined,
        socketTimeoutMS: 0,
        srvMaxHosts: 0,
        srvServiceName: "",
        ssl: false,
        tls: false,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        tlsCAFile: "",
        tlsCRLFile: "",
        tlsCertificateKeyFile: "",
        tlsCertificateKeyFilePassword: "",
        tlsInsecure: false,
        user: "",
        w: undefined,
        waitQueueTimeoutMS: 0,
        writeConcern: undefined,
        wtimeoutMS: 0,
    });

    const data =  [] as any;
    for (let i = 0; i < 1000; i++) {
        data.push({
            saleDate: randPastDate(),
            storeLocation: randCity(),
            couponUsed: randBoolean(),
            purchaseMethod: randTransactionType(),
            customer: {
                pronoun: randPronoun(),
                age: randNumber({ min: 18, max: 100 }),
                email: randEmail(),
                satisfaction: randNumber({ min: 0, max: 10 })
            }
        });
    }

    try {
        await Sales.insertMany(data);
        console.log('Data generated and inserted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await mongoose.disconnect();
    }
};

generateSalesData().then(() => console.log('Finished.'));
