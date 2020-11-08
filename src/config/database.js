module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'fastfeed',

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
