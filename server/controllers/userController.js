const mysql = require("mysql");

//connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

exports.view = (req, res) => {
    //connection to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        //User the connection
        connection.query(
            "select ROW_NUMBER() OVER (ORDER BY english) AS id, english, vietnam from vocabulary where status = 'active'",
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.render("home", { rows });
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};

exports.viewAll = (req, res) => {
    //connection to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        //User the connection
        connection.query(
            "select ROW_NUMBER() OVER (ORDER BY english) AS id, english, vietnam from vocabulary",
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.render("home", { rows });
                } else {
                    console.log(err);
                }
            }
        );
    });
};

exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query(
            `select * from vocabulary where (english LIKE '%${searchTerm}%') or (vietnam LIKE '%${searchTerm}%')`,
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.render("home", { rows });
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};

exports.form = (req, res) => {
    res.render("adduser");
};

exports.create = (req, res) => {
    const { english, vietnam, mean } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query(
            `insert into vocabulary set english = '${english}', vietnam = '${vietnam}', mean = '${mean}'`,
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.render("adduser", { alert: "Add successefully" });
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};

exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        //User the connection
        connection.query(
            `select * from vocabulary where id = ${req.params.id}`,
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.render("edit", { rows });
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};

exports.update = (req, res) => {
    const { english, vietnam, mean } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);

        //User the connection
        connection.query(
            `update vocabulary set english = '${english}', vietnam = '${vietnam}', mean = '${mean}' where id = ${req.params.id}`,
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.redirect("/");
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};

exports.remove = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as ID: ` + connection.threadId);
        const sql = `delete from vocabulary where id = ${req.params.id}`;
        //User the connection
        connection.query(
            `update vocabulary set status = 'remove' where id = ${req.params.id}`,
            (err, rows) => {
                //When done with the connection, release it
                connection.release();

                if (!err) {
                    res.redirect("/");
                } else {
                    console.log(err);
                }
                console.log("The data from user table: \n", rows);
            }
        );
    });
};