CREATE DATABASE StudentDB;

Use StudentDB;

CREATE TABLE students (
studentId INT AUTO_INCREMENT,
studentName VARCHAR(50) NOT NULL,
Course VARCHAR(55),Semester VARCHAR(50) NOT NULL,PRIMARY KEY (studentId));
            
INSERT INTO students(studentName, Course, Semester) VALUES ('Paul', 'MBA', 'Second');
INSERT INTO students(studentName, Course, Semester) VALUES ('John', 'IT', 'Third');         
INSERT INTO students(studentName, Course, Semester) VALUES ('Sebastian', 'Medicine', 'fifth');
            
SELECT * FROM students;