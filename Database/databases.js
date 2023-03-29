// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

knex("users")
  .select("id", "name")
  .then((rows) => {
    console.log(rows);
  })
  .catch((error) => {
    console.error(error);
  });

exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("color");
    table.string("");
    table.image("");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
