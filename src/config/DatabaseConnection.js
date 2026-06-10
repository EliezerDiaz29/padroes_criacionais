export default class DatabaseConnection {

    static conexionUnica = null;

    constructor() {
        console.log(
            "Conexão com o Database estabelecida"
        );
    }

    static getInstance() {

        if (!DatabaseConnection.conexionUnica) {

            DatabaseConnection.conexionUnica =
                new DatabaseConnection();
        }

        return DatabaseConnection.conexionUnica;
    }

    conectar() {
        console.log(
            "Conectado ao Database"
        );
    }
}