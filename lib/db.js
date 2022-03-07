import { MongoClient } from "mongodb";

export async function connectDb() {
  const client = await MongoClient.connect(
    "mongodb+srv://prajwal:G3kTzZsmwYERJamD@cluster0.o1p1x.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client;
}
