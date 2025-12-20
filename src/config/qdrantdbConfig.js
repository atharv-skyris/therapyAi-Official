import {QdrantClient} from '@qdrant/js-client-rest';

const qdrantClient = new QdrantClient({
    url:process.env.QDRANT_URL,
    apiKey:process.env.QDRANT_APIKEY,
});

export default qdrantClient