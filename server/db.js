const Pool = require("pg").Pool
const pool= new Pool({
    user:"docker",
    password: "docker",
    host: "postgresql_db",
    port: 5432,
    database: "aoi_app"
})

module.exports=pool;