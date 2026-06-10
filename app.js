import express from "express";
import orderRoutes from "./src/routes/orderRoutes.js"
import DatabaseConnection from "./src/config/DatabaseConnection.js";

const db = DatabaseConnection.getInstance();
db.conectar();

const app = express();

app.use(express.json());

app.use(orderRoutes);

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta: ${PORT}`
    );

});

export default app;