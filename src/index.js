import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

export async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();
    }
}

export async function getCollectionStats(dbName) {
    const uri = process.env.DB_URI;
    let mongoClient, db, colls;
    let today = new Date();
    let documents = [];

    try {
        mongoClient = await connectToCluster(uri);
        db = mongoClient.db(dbName);
        colls = db.listCollections({type: "collection"});

        while (await colls.hasNext()) {
            let coll = await colls.next();
            console.log(`Getting stats for ${coll.name}`);
            let collection = db.collection(coll.name);
            let info = await collection.stats();
            if (info.ok) {
                let doc = ({
                    ns: info.ns,
                    count: info.count,
                    size: info.size,
                    storageSize: info.storageSize,
                    nindexes: info.nindexes,
                    totalIndexSize: info.totalIndexSize,
                    timestamp: today
                });
                documents.push(doc);
            }
        }

        const stats = mongoClient.db(process.env.RESULTS_DB).collection(process.env.RESULTS_COLL);
        const options = { ordered: false};
        const result = await stats.insertMany(documents, options);
        console.log(`${result.insertedCount} documents were inserted.`);
    } finally {
        await mongoClient.close();
    }
}

config();
await getCollectionStats(process.env.SOURCE_DB);