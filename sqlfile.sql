use project_pulse;
show tables;
DESC EMPLOYEES;
create database project_pulse;
select * from employees;
drop table employees;
desc employees;
insert into employees(emp_name) values("prashanth"),("mohan");
insert into employees(emp_name) values
("teja"),
("seetha"),
("srinath"),
("anu"),
("kushala"),
("mahesh"),
("naren"),
("vasanthi"),
("venkat"),
("thirish"),
("lakshman"),
("shivani"),
("prasu"),
("divya"),
("madhu"),
("madhavi");
insert into employees(emp_name) values 
("pramod"),("varun"),("sashi"),("vishnu");
select * from projects;
#truncate projects;
desc projects;
select * from project_concerns;
select * from project_updates;
select * from resourcing_request;
select * from team_composition;
select * from user;
insert into user values(1,"teja@westagilelabs.com","teja","$2a$05$mSsW.xv.Q0Mmb9YRlHNBDOMXMJlaR3gqaqiMTaR.UPjqUsvY8pQHK","super admin");
SET SQL_SAFE_UPDATES=0;
drop table resourcing_request;
delete from user where email="pramodh@westagilelabs.com" and role is null;
insert into user values(11,"suresh@westagilelabs.com","suresh","$2a$05$8/DPhy3rHHZ3eyKtKaj3WeUIx3ZMDhYMg1Ycfbdsa3AZ08WjRYAom","super admin");
