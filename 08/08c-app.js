import framework from "./08a-framework.js";
import { writeFile, readFile, unlink, rmdir } from "fs";
import jwt from "jsonwebtoken";

const secret = "S1234sasdfASSDSDAhnkskjsdf";
const app = framework();
const port = 8000;

function checkUser(request, callback) {
    let user = request.headers.user;
    let pass = request.headers.pass;
    readFile("db.json", function (error, fileData) {
        if (error) {
            console.log("error reading db.json", error);
            callback(error, null);
        } else {
            fileData = JSON.parse(fileData.toString());
            let found = false;
            for (let x of fileData.data) {
                if (
                    x.username === user &&
                    x.password === pass &&
                    x.type === "admin"
                ) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        }
    });
}

function verifyToken(request) {
    let token = request.headers.token;
    let decoded = {};

    if (!token) {
        decoded.result = false;
        return decoded;
    }

    try {
        decoded.data = jwt.verify(token, secret);
        decoded.result = true;
        return decoded;
    } catch (error) {
        decoded.result = false;
        return decoded;
    }
}

app.get("sum", function (request, response) {
    let items = request.url.split("/");
    let output = Number(items[2]) + Number(items[3]);
    response.writeHead(200);
    response.write(String(output));
    response.end();
});

app.get("minus", function (request, response) {
    let items = request.url.split("/");
    let output = Number(items[2]) - Number(items[3]);
    response.writeHead(200);
    response.write(String(output));
    response.end();
});

app.get("print", function (request, response) {
    response.writeHead(200);
    response.write(String(request.url));
    response.end();
});

app.get("createFile", function (request, response) {
    let items = request.url.split("/");
    writeFile(items[2], items[3], function (error) {
        if (error) {
            response.writeHead(500);
            response.write("create file error: " + error.message);
            response.end();
        } else {
            response.writeHead(200);
            response.write("create file done");
            response.end();
        }
    });
});

app.get("readFile", function (request, response) {
    let items = request.url.split("/");
    readFile(items[2], function (error, data) {
        if (error) {
            response.writeHead(500);
            response.write("read file error: " + error.message);
            response.end();
        } else {
            response.writeHead(200);
            response.write("read file done \n");
            response.write(data);
            response.end();
        }
    });
});

app.get("deleteFile", function (request, response) {
    let items = request.url.split("/");
    unlink(items[2], function (error) {
        if (error) {
            response.writeHead(404);
            response.write("delete file error-file not found: " + error.message);
            response.end();
        } else {
            response.writeHead(200);
            response.write("delete file done");
            response.end();
        }
    });
});

app.get("delete", function (request, response) {
    let items = request.url.split("/");
    rmdir(items[2], function (error) {
        if (error) {
            response.writeHead(404);
            response.write("delete directory error-directory not found: " + error.message);
            response.end();
        } else {
            response.writeHead(200);
            response.write("delete directory done");
            response.end();
        }
    });
});

app.get("token", function (request, response) {
    checkUser(request, function (error, result) {
        if (error) {
            console.log("system error", error);
            response.writeHead(500);
            response.write("system error");
            response.end();
        } else {
            if (result === false) {
                console.log("admin not found");
                response.writeHead(403);
                response.write("admin not found");
                response.end();
            } else {
                next();
            }
        }
    });

    function next() {
        let x = {
            username: request.headers.user
        };
        let token = jwt.sign(x, secret);
        console.log(token);
        response.writeHead(200);
        response.write(token);
        response.end();
    }
});

app.get("user", function (request, response) {
    const id = Number(request.url.split("/")[2]);
    readFile("db.json", function (error, data) {
        if (error) {
            response.writeHead(500);
            response.write("read file error: " + error.message);
            response.end();
        } else {
            const db = JSON.parse(data.toString());
            let found = null;

            for (const user of db.data) {
                if (user.id === id) {
                    found = user;
                    break;
                }
            }

            if (found) {
                response.writeHead(200);
                response.end(JSON.stringify(found));
            } else {
                response.writeHead(404);
                response.end("user not found");
            }
        }
    });
});

app.post("user", function (request, response) {
    let decoded = verifyToken(request);
    if (!decoded.result) {
        response.writeHead(401);
        response.write("token not found or invalid");
        response.end();
    } else {
        readFile("db.json", function (error, data) {
            if (error) {
                response.writeHead(500);
                response.write("read file error: " + error.message);
                response.end();
            } else {
                const users = JSON.parse(data.toString());
                const clientData =
                    typeof request.data === "string"
                        ? JSON.parse(request.data)
                        : request.data;

                const newUser = {
                    id: Math.floor(100000000 + Math.random() * 900000000),
                    username: clientData.username,
                    password: clientData.password
                };

                users.data.push(newUser);
                writeFile("db.json", JSON.stringify(users, null, 2), function (error) {
                    if (error) {
                        response.writeHead(500);
                        response.write("edit file error: " + error.message);
                        response.end();
                    } else {
                        response.writeHead(201);
                        response.write("signup is done " + JSON.stringify(newUser));
                        response.end();
                    }
                });
            }
        });
    }
});

app.delete("user", function (request, response) {
    let items = request.url.split("/");
    let userId = Number(items[2]);

    checkUser(request, function (error, result) {
        if (error) {
            console.log("system error", error);
            response.writeHead(500);
            response.write("system error");
            response.end();
        } else {
            if (result === false) {
                console.log("admin not found");
                response.writeHead(403);
                response.write("admin not found");
                response.end();
            } else {
                console.log("admin found");
                readFile("db.json", function (error, fileData) {
                    if (error) {
                        console.log("error reading db.json", error);
                        response.writeHead(500);
                        response.write("error reading db.json");
                        response.end();
                    } else {
                        fileData = JSON.parse(fileData.toString());

                        let found = false;
                        for (let i = 0; i < fileData.data.length; i++) {
                            if (fileData.data[i].id === userId) {
                                found = true;
                                fileData.data.splice(i, 1);
                                break;
                            }
                        }

                        if (!found) {
                            console.log("user not found");
                            response.writeHead(404);
                            response.write("user not found");
                            response.end();
                        } else {
                            writeFile("db.json", JSON.stringify(fileData, null, 2), function (error) {
                                if (error) {
                                    console.log("error writing db.json", error);
                                    response.writeHead(500);
                                    response.write("error writing db.json");
                                    response.end();
                                } else {
                                    console.log("removeUser done");
                                    response.writeHead(200);
                                    response.write("removeUser done");
                                    response.end();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

app.put("user", function (request, response) {
    checkUser(request, function (error, result) {
        if (error) {
            console.log("system error", error);
            response.writeHead(500);
            response.write("system error");
            response.end();
        } else {
            if (result === false) {
                console.log("admin not found");
                response.writeHead(403);
                response.write("admin not found");
                response.end();
            } else {
                next();
            }
        }
    });

    function next() {
        readFile("db.json", function (error, data) {
            if (error) {
                response.writeHead(500);
                response.write("read file error: " + error.message);
                response.end();
            } else {
                const db = JSON.parse(data.toString());
                const clientData =
                    typeof request.data === "string"
                        ? JSON.parse(request.data)
                        : request.data;
                const id = Number(clientData.id);
                let found = null;

                for (let i = 0; i < db.data.length; i++) {
                    if (db.data[i].id === id) {
                        db.data[i].username = clientData.username;
                        db.data[i].password = clientData.password;
                        found = db.data[i];
                        break;
                    }
                }

                if (found) {
                    writeFile("db.json", JSON.stringify(db, null, 2), function (error) {
                        if (error) {
                            response.writeHead(500);
                            response.end("edit file error: " + error.message);
                        } else {
                            response.writeHead(200);
                            response.end("user updated: " + JSON.stringify(found));
                        }
                    });
                } else {
                    response.writeHead(404);
                    response.end("user not found");
                }
            }
        });
    }
});

app.listen(port, () => {
    console.log("app listen to : ", port);
});
