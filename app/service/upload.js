const service = require("egg").Service;

class upload extends service {
  async updateImageUrl() {
    await this.app.mysql.update("user", {});
  }
}

module.exports = upload;
