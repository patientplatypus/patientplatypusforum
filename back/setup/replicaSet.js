rsconf = {
  _id : "rs",
  members: [
    { _id : 0, host : "mongo1:27017" },
    { _id : 1, host : "mongo2:27017" },
    { _id : 2, host : "mongo3:27017" }
  ]
}

rs.initiate(rsconf);
// rs.slaveOk()
// rs.add("mongo2:27017")
// rs.add("mongo3:27017")
// rs.slaveOk()
rs.conf();