db = db.getSiblingDB('admin');
db.auth('root', 'supersecret');
db = db.getSiblingDB('thesis');

db.createUser({
  user: 'backend_user',
  pwd: 'T4b9yFq7Zx3L8pD2',
  roles: [
    {
      role: 'readWrite',
      db: 'thesis',
    },
  ],
});
