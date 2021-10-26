import fs from "fs";

export default async function deleteFile(path: any) {

    try {

        await fs.promises.stat(path);

    } catch (error) { return console.log("Error", error); }

    return await fs.promises.unlink(path);
}
