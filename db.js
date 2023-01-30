import mysql from 'mysql'

//setting up sql db

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2001kkkk",
    database: "blog",
})