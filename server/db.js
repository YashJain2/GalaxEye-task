//importing pg library for connecting to postgress DB using credentials
const Pool = require("pg").Pool
//currently hardcoded the credentials 
//TODO: Shift the credentials in .env using then fetch using process.env
const pool= new Pool({
    user:"docker",
    password: "docker",
    host: "postgresql_db",
    port: 5432,
    database: "aoi_app"
})

module.exports=pool;