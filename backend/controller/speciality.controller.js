const db = require("../db");

class SpecialityController {
  async createSpeciality(req, res) {
    try {
      if (req.body.id) {
        const { id, title, instrument, id_departament } = req.body;
        await db.query(
          `INSERT INTO speciality (id, title, instrument, id_departament) VALUES ($1, $2, $3, $4)`,
          [id, title, instrument, id_departament]
        );
        return;
      }
      const { title, instrument, id_departament } = req.body;
      const newSpeciality = await db.query(
        `INSERT INTO speciality (title, instrument, id_departament) VALUES ($1, $2, $3) RETURNING *`,
        [title, instrument, id_departament]
      );

      res.json(newSpeciality.rows[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
  async getSpeciality(req, res) {
    try {
      const { id } = req.params;
      const speciality = await db.query(
        "SELECT * FROM speciality WHERE id = $1",
        [id]
      );

      res.json(speciality.rows[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
  async getAllSpeciality(req, res) {
    try {
      const speciality = await db.query("SELECT * FROM speciality");

      res.json(speciality.rows);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
  async updateSpeciality(req, res) {
    try {
      if (req.body.id) {
        const { id, title, instrument, id_departament } = req.body;
        await db.query(
          "UPDATE speciality SET title = $2, instrument = $3, id_departament = $4 WHERE id = $1",
          [id, title, instrument, id_departament]
        );
        return;
      }
      const { id } = req.params;
      const { title, instrument, id_departament } = req.body;
      const departament = await db.query(
        "UPDATE speciality SET title = $2, instrument = $3, id_departament = $4 WHERE id = $1 RETURNING *",
        [id, title, instrument, id_departament]
      );

      res.json(departament.rows[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
  async deleteSpeciality(req, res) {
    try {
      if (req.body.id) {
        const { id } = req.body;
        await db.query("DELETE FROM speciality WHERE id = $1", [id]);
        return;
      }
      const { id } = req.params;
      await db.query("DELETE FROM speciality WHERE id = $1", [id]);

      res.json("ok");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
  async revertChanges(item, res) {
    switch (item.operation) {
      case "INSERT":
        await this.deleteSpeciality({ body: { ...item } }, res);
        break;
      case "DELETE":
        await this.createSpeciality({ body: { ...item } }, res);
        break;
      case "UPDATE":
        await this.updateSpeciality({ body: { ...item } }, res);
        break;
      default:
        break;
    }
  }
  async undoSpeciality(req, res) {
    try {
      const { op_id, limit = 1 } = req.body;
      if (op_id) {
        const queryString = `select * from temp_speciality where op_id = ${op_id}`;
        const data = await db.query(queryString);
        await this.revertChanges(data.rows[0], res);
        res.json("reverted");
        return;
      }
      const queryString = `select * from temp_speciality order by op_id desc limit ${limit};`;
      const data = await db.query(queryString);
      data.rows.forEach(async (item) => {
        await this.revertChanges(item, res);
      });
      res.json("reverted");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new SpecialityController();
