import { ApolloServer, gql } from 'apollo-server';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const typeDefs = gql`
  type Crime {
    cmplnt_num: String
    addr_pct_cd: String
    boro_nm: String
    cmplnt_fr_dt: String
    cmplnt_fr_tm: String
    cmplnt_to_dt: String
    cmplnt_to_tm: String
    crm_atpt_cptd_cd: String
    jurisdiction_code: String
    juris_desc: String
    ky_cd: String
    law_cat_cd: String
    loc_of_occur_desc: String
    ofns_desc: String
    parks_nm: String
    patrol_boro: String
    pd_cd: String
    pd_desc: String
    prem_typ_desc: String
    rpt_dt: String
    station_name: String
    susp_age_group: String
    susp_race: String
    susp_sex: String
    vic_age_group: String
    vic_race: String
    vic_sex: String
    x_coord_cd: String
    y_coord_cd: String
    latitude: String
    longitude: String
    lat_lon: LatLon
    geocoded_column: GeocodedColumn
  }

  type LatLon {
    latitude: String
    longitude: String
  }

  type GeocodedColumn {
    type: String
    coordinates: [Float]
  }

  type Query {
    crimes(limit: Int): [Crime]
  }
`;

const client = new MongoClient(process.env.MONGO_URI);
let collection;

const resolvers = {
  Query: {
    crimes: async (_, { limit = null }) => {
      if (limit === null) {
        return await collection.find().toArray();
      } else if (limit > 0) {
        return await collection.find().limit(limit).toArray();
      }
    }
  }
};

const start = async () => {
  await client.connect();
  const db = client.db("nyc_crime");
  collection = db.collection("incidents");

  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
