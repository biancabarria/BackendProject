const fs = require("fs");

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param {json} json
 * @returns object
 */
const JsonToObject = (json) => {
  try {
    if (json.length > 0) {
      return JSON.parse(json);
    } else {
      return JSON.parse("[]");
    }
  } catch (error) {
    console.log("Se produjo un error convirtiendo el Json a Objecto");
    throw error;
  }
};

/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param {object} object
 * @returns json
 */
const ObjectToJson = (object) => {
  try {
    return JSON.stringify(object);
  } catch (error) {
    console.log("Se produjo un error convirtiendo el Objecto a Json");
    throw error;
  }
};

/**
 * Read a file
 * @param {string} fileName
 * @returns a content of a file
 */
const readfile = async (fileName) => {
  try {
    return await fs.promises.readFile(fileName, "utf-8");
  } catch (error) {
    console.log("Se produjo un error leyendo el archivo solicitado");
    throw error;
  }
};

/**
 * creates a empty new file
 * @param {string} fileName
 */
const newFile = async (fileName) => {
  try {
    await fs.promises.writeFile(fileName, "");
  } catch (e) {
    throw error;
  }
};

/**
 * Check that the file exists. Call a new file if not.
 * @param {string} fileName
 */
const fileExist = async (fileName) => {
  if (fs.existsSync(fileName) == false) {
    await newFile(fileName);
  }
};

/**
 * write a json data in a file
 * @param {string} fileName
 * @param {json} json
 */
const writeFile = async (fileName, json) => {
  try {
    await fs.promises.writeFile(fileName, json);
  } catch (error) {
    throw error;
  }
};

class Contenedor {

  id = 1

  constructor(file) {
    this.file = file;
  }

  async save(data) {
    try {
        await fileExist(this.file);
        const array = await this.getAll()
        if (array.length == 0) {
          data['id'] = this.id
          data['timestamp'] = Date.now()
          data = Array(data)
        } else {
            const array = await this.getAll();
            const index = array[array.length - 1].id + 1;
            data['id'] = index
            data['timestamp'] = Date.now()
            array.push(data)
            data = array
        }
    } catch (error) {
        throw error
    }
    await fs.promises.writeFile(this.file, JSON.stringify(data))
  }

  async update(id, data) {
    try {
      let array = await this.getAll()
      let identifier = parseInt(id)
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === identifier) {
          for (const [key, value] of Object.entries(data)) {
            array[i][key] = value
          }
          await fs.promises.writeFile(this.file, JSON.stringify(array))
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      await fileExist(this.file);
      return JsonToObject(await fs.promises.readFile(this.file, "utf-8"));
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
        const contenido = JSON.parse(await readfile(this.file))
        return contenido.find(product => product.id === id)
    } catch (error) {
        return null
    }
  }

  async deleteById(id) {
    try {
      const contenido = JSON.parse(await readfile(this.file))
      const contenidoSinId = contenido.filter(data => data.id !== id)
      await writeFile(this.file, JSON.stringify(contenidoSinId))
    } catch (error) {
        return null
    }
}

}

module.exports = Contenedor;