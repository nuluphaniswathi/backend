const connection = require("../db/db.config");
//to establish connection between server and jest framework
const request = require("supertest");
const app = require("../server");

//get users data
test("route for getting all users data by super admin",async()=>{
    const res=await request(app).get("/superadmin-api/users");
    //expect(res.body[0]).toHaveProperty("id");
    // console.log("payload.......",res.body.payload);
    // expect(res.body.payload[0]).toHaveProperty("user_name");
    // expect(res.body.payload[0]).toHaveProperty("role");
    expect(res.status).toBe(200);
});

test("route for login",async()=>{
    const res= await request(app).post("/user-api/login ").send({
    "email":"pramod@westagilelabs.com",
    "password":"pramod"
    });
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("user_name");
    expect(res.body.user).toHaveProperty("role");
    expect(res.status).toBe(200);
});

//route to read all projects by admin
test("route for getting all projects data by  admin",async()=>{
    const res=await request(app).get("/admin-api/admin/portfolio-dashboard")
    .set('Authorization','bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJlbWFpbCI6InByYW1vZEB3ZXN0YWdpbGVsYWJzLmNvbSIsImlhdCI6MTY3ODgxNjI0MSwiZXhwIjoxNjc5MzM0NjQxfQ.YIrx8Sit1DyrOAFhE6Z8E09JGceuma2go8cJaWo5ce0");
    console.log("payload.....",res.body.payload)
    
    expect(res.status).toBe(200);

});

test("Admin can see the raising resource request",async()=>{
    const res=await request(app).get("/admin-api/admin/resourcerequest")
    .set('Authorization','bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2Nzg2ODU0NzYsImV4cCI6MTY3OTExNzQ3Nn0.G4wOPmTZgblF6L24GGUzjjHpM70rq82oxYXL1pW2RFo");
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});

test("Admin can see the raising resource request",async()=>{
    const res=await request(app).delete("/admin-api/admin/projectId/1")
    .set('Authorization','bearer ' + 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2Nzg2ODU0NzYsImV4cCI6MTY3OTExNzQ3Nn0.G4wOPmTZgblF6L24GGUzjjHpM70rq82oxYXL1pW2RFo")
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});


test("Admin can see the raising resource request",async()=>{
    const res=await request(app).delete("/admin-api/admin/projectId/1")
    .set('Authorization','bearer ' + 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2Nzg2ODU0NzYsImV4cCI6MTY3OTExNzQ3Nn0.G4wOPmTZgblF6L24GGUzjjHpM70rq82oxYXL1pW2RFo")
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});

test("Project manager can update the project update details",async()=>{
    const res=await request(app).put("/project-manager-api/projects/update-projectupdate/projectManagerEmail/jayram@westagilelabs.com").send({
        "project_id":2,
        "Date":"2023/03/14",
        "status_update":"project in progress",
        "schedule_status":"red",
        "resourcing_status":"amber",
        "quality_status":"red",
        "client_inputs":false
    })
    .set('Authorization','bearer ' + 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicHJvamVjdCBtYW5hZ2VyIiwiaWF0IjoxNjc4NzAxMzMyLCJleHAiOjE2NzkxMzMzMzJ9.dH-eIBb-C2h3cIH7SX8dV4v4EcV0VBeafxIfoADfggE")
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(401);
});

test("get project detail under specific gdo",async()=>{
    const res=await request(app).get("/gdoHead-api/projects/divya@westagilelabs.com")
    .set('Authorization','bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ2RvaGVhZCIsImlhdCI6MTY3ODc5Njc2MCwiZXhwIjoxNjc5MzE1MTYwfQ.dlNTBTEcqL2jKnqzdryPv_n83nyxfbdjxX9oz6cmmLo");
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});

test("get specific project details under gdo",async()=>{
    const res=await request(app).get("/gdoHead-api/projectId/5/gdoEmail/divya@westagilelabs.com")
    .set('Authorization','bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ2RvaGVhZCIsImlhdCI6MTY3ODc5Njc2MCwiZXhwIjoxNjc5MzE1MTYwfQ.dlNTBTEcqL2jKnqzdryPv_n83nyxfbdjxX9oz6cmmLo");
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});

test("gdo can get last two weeks project update details",async()=>{
    const res=await request(app).get("/gdoHead-api/projectupdate/lasttwoweeks/projectId/3 ")
    .set('Authorization','bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR2RvIGhlYWQiLCJpYXQiOjE2Nzg2MTA1ODQsImV4cCI6MTY3OTA0MjU4NH0.ptGkRJ8fp1rC8iGj0riZ0AqhMBzPxg69IccCwQKP4Jw");
    console.log("payload.....",res.body.payload);
    expect(res.status).toBe(200);
});
















