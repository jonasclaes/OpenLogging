import { ILog, ILogConstructorProperties } from ".";
import { database, Database } from "../database";

export class Log implements ILog {
    public id: number | null = null;
    public source_id: string | null = null;
    public timestamp: number | null = null;
    public category: string | null = null;
    public message: string | null = null;

    constructor (props?: ILogConstructorProperties) {
        if (props) {
            this.id = props.id || null;
            this.source_id = props.source_id || null;
            this.timestamp = props.timestamp || null;
            this.category = props.category || null;
            this.message = props.message || null;
        }
    }

    public static async createTable(): Promise<void> {
        await new Promise((resolve, reject) => {
            database.getConnection().query("CREATE TABLE `logs` (`id` int(11) NOT NULL, `source_id` char(36), `timestamp` int(11), `category` tinytext, `message` text COLLATE utf8_unicode_ci) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `logs` ADD PRIMARY KEY (`id`)", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `logs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static findAll(limit: number, offset: number): Promise<Log[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `logs` LIMIT ? OFFSET ?", [limit, offset], (err, results: ILog[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: Log[] = [];
                    results.forEach(element => {
                        returnArray.push(new Log(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public static findById(id: number): Promise<Log> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `logs` WHERE id = ?", [id], (err, results: ILog[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Log(results[0]));
                }
            });
        });
    }

    public static findBySourceId(source_id: string): Promise<Log[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `logs` WHERE source_id = ?", [source_id], (err, results: ILog[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: Log[] = [];
                    results.forEach(element => {
                        returnArray.push(new Log(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public static findByCategory(category: string): Promise<Log[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `logs` WHERE category = ?", [category], (err, results: ILog[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: Log[] = [];
                    results.forEach(element => {
                        returnArray.push(new Log(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public async save(): Promise<void> {
        if (this.id == null) {
            // Insert;

            if (this.timestamp == null) {
                this.timestamp = Date.now();
            }

            return new Promise((resolve, reject) => {
                database.getConnection().query("INSERT INTO `logs` (`id`, `source_id`, `timestamp`, `category`, `message`) VALUES (NULL, ?, ?, ?, ?)", [this.source_id, this.timestamp, this.category, this.message], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            // Update;
            return new Promise((resolve, reject) => {
                database.getConnection().query("UPDATE `logs` SET `source_id` = ?, `timestamp` = ?, `category` = ?, `message` = ? WHERE `logs`.`id` = ?", [this.source_id, this.timestamp, this.category, this.message, this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }

    public async delete(): Promise<void> {
        if (this.id != null) {
            return new Promise((resolve, reject) => {
                database.getConnection().query("DELETE FROM `logs` WHERE `logs`.`id` = ?", [this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }
}