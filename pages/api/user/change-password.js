import { getSession } from "next-auth/react";
import { verifyPassword, hashPassword } from "../../../lib/auth";
import { connectDb } from "../../../lib/db";

async function handler(req, res) {
  const { method } = req;

  if (method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userEmail = session.user.email;

  // get the old and new password from the request object
  const { newPassword, oldPassword } = req.body;

  const client = await connectDb();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const isEqual = await verifyPassword(oldPassword, currentPassword);

  if (!isEqual) {
    res.status(403).json({ message: "Invalid password" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated" });
}

export default handler;
