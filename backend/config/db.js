import dns from "dns";
import mongoose from "mongoose";
import { URL } from "url";

const dnsServers = [
    process.env.NODE_DNS_SERVER_1 || "8.8.8.8",
    process.env.NODE_DNS_SERVER_2 || "1.1.1.1"
];

dns.setServers(dnsServers);

const baseOptions = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 15000,
    bufferCommands: false,
    tls: true,
};

const buildDirectUriFromSrv = async (srvUri) => {
    const url = new URL(srvUri);
    const user = url.username;
    const pass = url.password;
    const host = url.hostname;
    const query = url.searchParams;

    if (!user || !pass || !host) {
        throw new Error("Invalid mongodb+srv URI format");
    }

    const srvHost = `_mongodb._tcp.${host}`;
    const srvRecords = await dns.promises.resolveSrv(srvHost);
    if (!srvRecords || srvRecords.length === 0) {
        throw new Error("No SRV records found for Atlas cluster");
    }

    const hosts = srvRecords.map((record) => `${record.name}:${record.port}`).join(",");

    if (!query.has("retryWrites")) query.set("retryWrites", "true");
    if (!query.has("w")) query.set("w", "majority");
    if (!query.has("tls")) query.set("tls", "true");
    if (!query.has("authSource")) query.set("authSource", "admin");

    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts}/?${query.toString()}`;
};

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    console.log("===========================================");
    console.log("Connecting to MongoDB...");
    console.log("Using DNS servers:", dnsServers.join(", "));
    console.log("MONGO_URI:", mongoUri ? `${mongoUri.substring(0, 25)}...` : "Using local fallback");
    console.log("===========================================");

    const tryConnect = async (uri, timeout = 10000, options = {}) => {
        return mongoose.connect(uri, {
            ...baseOptions,
            serverSelectionTimeoutMS: timeout,
            ...options,
        });
    };

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }

    try {
        await tryConnect(mongoUri);
        console.log("✓ DB Connected successfully!");
    } catch (error) {
        console.error("✗ Atlas Connection Error:", error.message);

        if (mongoUri.startsWith("mongodb+srv://")) {
            console.log("Trying Atlas direct-host fallback...");
            try {
                const directUri = await buildDirectUriFromSrv(mongoUri);
                console.log("Resolved direct-host fallback URI:", `${directUri.substring(0, 80)}...`);
                await tryConnect(directUri, 30000);
                console.log("✓ Connected via direct-host fallback!");
                return;
            } catch (fallbackError) {
                console.error("✗ Direct-host fallback failed:", fallbackError.message);
            }
        }

        console.log("Trying local MongoDB fallback...");
        try {
            await tryConnect("mongodb://127.0.0.1:27017/fooddelivery", 5000);
            console.log("✓ Connected to local MongoDB!");
            return;
        } catch (localError) {
            console.error("✗ Local fallback failed:", localError.message);
            throw localError;
        }
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in database:", collections.map((c) => c.name));
};
