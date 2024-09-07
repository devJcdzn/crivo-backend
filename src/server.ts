import fastify from "fastify";
import cors from "@fastify/cors";
import { createUser } from "./routes/create-user";
import { authRoute } from "./routes/auth-route";
import { createCompany } from "./routes/create-company";
import { createTransactions } from "./routes/create-transaction";
import { getSummary } from "./routes/get-summary";
import { getTransactions } from "./routes/get-transactions";
import { createCategory } from "./routes/create-category";
import { getCategories } from "./routes/get-categories";
import { updateTransaction } from "./routes/update-transaction";
import { deleteTransaction } from "./routes/delete-transaction";
import { getUsers } from "./routes/get-user";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(authRoute);
app.register(createUser);
app.register(createCompany);
app.register(createCategory);
app.register(createTransactions);

app.register(getUsers);
app.register(getSummary);
app.register(getCategories);
app.register(getTransactions);

app.register(updateTransaction);

app.register(deleteTransaction);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🔥 HTTP Server running on port 3333");
});
