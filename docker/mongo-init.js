db = db.getSiblingDB("jala_agency");

db.createUser({
  user: "admin_sop",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "jala_agency",
    },

    {
        role: 'dbAdmin',
        db: 'jala_agency'
    }
  ],
});


console.log('the main user i jala_Agency has be created')
