import "reflect-metadata";
import express from "express";
import { createConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { Student } from "./entity/Student";
import { Course } from "./entity/Course";
import { Teacher } from "./entity/Teacher";
import { Subject } from "./entity/Subject";
import { Grade } from "./entity/Grade";
import cors from 'cors';

createConnection().then(async connection => {

    const app = express();
    app.use(express.json());
    app.use(cors());

    // Diákok lekérdezése
    app.get("/students", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const students = await studentRepository.find({ relations: ["courses", "grades"] });
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diákok lekérdezése közben." });
        }
    });

    // Új diák hozzáadása
    app.post("/students", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const newStudent = studentRepository.create(req.body); // feltételezve, hogy a body megfelelő formátumú
            const results = await studentRepository.save(newStudent);
            res.status(201).json(results);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt az új diák létrehozása közben." });
        }
    });

    // Egy diák lekérdezése az azonosítója alapján
    app.get("/students/:studentId", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const student = await studentRepository.findOne({ 
                where: { id: Number(req.params.studentId) }, 
                relations: ["courses", "grades"]
            });
            
    
            if (student) {
                res.json(student);
            } else {
                res.status(404).json({ error: "Diák nem található" });
            }
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diák lekérdezése közben." });
        }
    });

    // Egy diák frissítése
    app.put("/students/:studentId", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const student = await studentRepository.findOne({ 
                where: { id: Number(req.params.studentId) }
            });
    
            if (student) {
                studentRepository.merge(student, req.body); // új értékek összefésülése a req.body-ból a megtalált diákba
                const results = await studentRepository.save(student);
                res.json(results);
            } else {
                res.status(404).json({ error: "Diák nem található" });
            }
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diák frissítése közben." });
        }
    });

    // Diák törlése
    app.delete("/students/:studentId", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const student = await studentRepository.findOne({ 
                where: { id: Number(req.params.studentId) }
            });   
            if (student) {
                await studentRepository.remove(student);
                res.json({ message: "Diák eltávolítva" });
            } else {
                res.status(404).json({ error: "Diák nem található" });
            }
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diák eltávolítása közben." });
        }
    });

    // Tanárok lekérdezése
    app.get("/teachers", async (req: Request, res: Response) => {
        try {
            const teacherRepository = getRepository(Teacher);
            const teachers = await teacherRepository.find({ relations: ["subjects"] });
            res.json(teachers);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a tanárok lekérdezése közben." });
        }
    });

    // Új tanár hozzáadása
    app.post("/teachers", async (req: Request, res: Response) => {
        const teacherRepository = getRepository(Teacher);
        const teacher = teacherRepository.create(req.body); // új tanár példány létrehozása
        const results = await teacherRepository.save(teacher); // tanár példány mentése
        res.json(results);
    });

    // Egy tanár lekérdezése az azonosítója alapján
    app.get("/teachers/:teacherId", async (req: Request, res: Response) => {
        const teacherRepository = getRepository(Teacher);
        const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }, 
            relations: ["subjects"]
        });

        
    
        if (teacher) {
            res.json(teacher);
        } else {
            res.status(404).json({ error: "Tanár nem található" });
        }
    });

    // Tanár frissítése
    app.put("/teachers/:teacherId", async (req: Request, res: Response) => {
        const teacherRepository = getRepository(Teacher);
        const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });

    
        if (teacher) {
            teacherRepository.merge(teacher, req.body);
            const results = await teacherRepository.save(teacher);
            res.json(results);
        } else {
            res.status(404).json({ error: "Tanár nem található" });
        }
    });

    // Tanár törlése
    app.delete("/teachers/:teacherId", async (req: Request, res: Response) => {
        const teacherRepository = getRepository(Teacher);
        const teacher = await await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });
    
        if (teacher) {
            await teacherRepository.remove(teacher);
            res.json({ message: "Tanár eltávolítva" });
        } else {
            res.status(404).json({ error: "Tanár nem található" });
        }
    });

    // Kurzusok lekérdezése
    app.get("/courses", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const courses = await courseRepository.find({ relations: ["students","subject"] });
        res.json(courses);
    });

    // Új kurzus hozzáadása
    app.post("/courses", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = courseRepository.create(req.body);
        const results = await courseRepository.save(course);
        res.json(results);
    });  

    // Egy kurzus lekérdezése az azonosítója alapján
    app.get("/courses/:courseId", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students","subject"]
        });
        
    
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: "Kurzus nem található" });
        }
    });

    // Kurzus frissítése
    app.put("/courses/:courseId", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }
        });
    
        if (course) {
            courseRepository.merge(course, req.body);
            const results = await courseRepository.save(course);
            res.json(results);
        } else {
            res.status(404).json({ error: "Kurzus nem található" });
        }
    });

    // Kurzus törlése
    app.delete("/courses/:courseId", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }
        });
        if (course) {
            await courseRepository.remove(course);
            res.json({ message: "Kurzus eltávolítva" });
        } else {
            res.status(404).json({ error: "Kurzus nem található" });
        }
    });
    
    // Tárgyhoz kurzus hozzáadása
    app.post('/subjects/addcourse/:subjectId/:courseId', async (req: Request, res: Response) => {
        const { subjectId, courseId } = req.params;
      
        const subjectRepository = getRepository(Subject);
        const courseRepository = getRepository(Course);
      
        try {
          // Tárgy keresése azonosító alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tárgy nem található' });
          }
      
          // Kurzus keresése azonosító alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["subject"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Kurzus nem található' });
          }
      
          // Kurzus hozzáadása a tárgyhoz, ha még nem lett hozzáadva
          const isCourseAdded = subject.courses.some((c) => c.id === course.id);
          if (!isCourseAdded) {
            subject.courses.push(course);
          }
      
          // Tárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Kurzus hozzáadva a tárgyhoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

    // Kurzus eltávolítása a tárgyból
    app.delete('/subjects/removecourse/:subjectId/:courseId', async (req: Request, res: Response) => {
        const { subjectId, courseId } = req.params;
      
        const subjectRepository = getRepository(Subject);
        const courseRepository = getRepository(Course);
      
        try {
          // Tárgy keresése azonosító alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tárgy nem található' });
          }
      
          // Kurzus keresése azonosító alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["subject"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Kurzus nem található' });
          }
      
          // Ellenőrzés, hogy a kurzus már hozzá van-e adva a tárgyhoz
          const courseIndex = subject.courses.findIndex((c) => c.id === course.id);
          if (courseIndex === -1) {
            return res.status(404).json({ error: 'A kurzus nincs társítva a tárgyhoz' });
          }
      
          // Kurzus eltávolítása a tárgyból
          subject.courses.splice(courseIndex, 1);
      
          // Tárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Kurzus eltávolítva a tárgyból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

      // Diák hozzáadása a kurzushoz
      app.post('/courses/addstudent/:courseId/:studentId', async (req: Request, res: Response) => {
        const { courseId, studentId } = req.params;
      
        const courseRepository = getRepository(Course);
        const studentRepository = getRepository(Student);
      
        try {
          // Kurzus keresése azonosító alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Kurzus nem található' });
          }
      
          // Diák keresése azonosító alapján
          const student = await studentRepository.findOne({ 
            where: { id: Number(req.params.studentId) }, 
            relations: ["courses"]
        });
      
          if (!student) {
            return res.status(404).json({ error: 'Diák nem található' });
          }
      
          // Ellenőrzés, hogy a diák már felvette-e a kurzust
          const hasTakenCourse = student.courses.some((c) => c.id === course.id);
          if (hasTakenCourse) {
            return res.status(400).json({ error: 'A diák már felvette a kurzust' });
          }
      
          // Diák hozzáadása a kurzushoz
          course.students.push(student);
      
          // Kurzus mentése az adatbázisba
          await courseRepository.save(course);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Diák hozzáadva a kurzushoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
      
      // Diák eltávolítása a kurzusból
      app.delete('/courses/removestudent/:courseId/:studentId', async (req: Request, res: Response) => {
        const { courseId, studentId } = req.params;
      
        const courseRepository = getRepository(Course);
        const studentRepository = getRepository(Student);
      
        try {
          // Kurzus keresése azonosító alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students"]
        });
      
      
          if (!course) {
            return res.status(404).json({ error: 'Kurzus nem található' });
          }
      
          // Diák keresése azonosító alapján
          const student = await studentRepository.findOne({ 
            where: { id: Number(req.params.studentId) }, 
        });
      
      
          if (!student) {
            return res.status(404).json({ error: 'Diák nem található' });
          }
      
          // Ellenőrzés, hogy a diák már hozzá van-e adva a kurzushoz
          const studentIndex = course.students.findIndex((s) => s.id === student.id);
          if (studentIndex === -1) {
            return res.status(404).json({ error: 'A diák nincs beiratkozva a kurzusba' });
          }
      
          // Diák eltávolítása a kurzusból
          course.students.splice(studentIndex, 1);
      
          // Kurzus mentése az adatbázisba
          await courseRepository.save(course);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Diák eltávolítva a kurzusból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
      
    

    // Tárgyak lekérdezése
    app.get("/subjects", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subjects = await subjectRepository.find({ relations: ["courses"] });
        res.json(subjects);
    });

    // Új tárgy hozzáadása
    app.post("/subjects", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = subjectRepository.create(req.body);
        const results = await subjectRepository.save(subject);
        res.json(results);
    });

    // Tárgy lekérdezése az azonosítója alapján
    app.get("/subjects/:subjectId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
    
        if (subject) {
            res.json(subject);
        } else {
            res.status(404).json({ error: "Tárgy nem található" });
        }
    });

    // Tárgy frissítése
    app.put("/subjects/:subjectId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }
        });
    
        if (subject) {
            subjectRepository.merge(subject, req.body);
            const results = await subjectRepository.save(subject);
            res.json(results);
        } else {
            res.status(404).json({ error: "Tárgy nem található" });
        }
    });

    // Tárgy törlése
    app.delete("/subjects/:subjectId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }
        });
    
        if (subject) {
            await subjectRepository.remove(subject);
            res.json({ message: "Tárgy eltávolítva" });
        } else {
            res.status(404).json({ error: "Tárgy nem található" });
        }
    });

    // Tanár hozzáadása a tárgyhoz
    app.post("/subjects/addteacher/:subjectId/:teacherId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const teacherRepository = getRepository(Teacher);
        try {
          // Tanár keresése azonosító alapján
          const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });
      
          if (!teacher) {
            return res.status(404).json({ error: 'Tanár nem található' });
          }
      
          // Tárgy keresése azonosító alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["teachers"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tárgy nem található' });
          }
      
          // Tanár hozzáadása a tárgyhoz, ha még nem lett hozzáadva
          if (!subject.teachers.includes(teacher)) {
            subject.teachers.push(teacher);
          }
      
          // Tárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Tanár hozzáadva a tárgyhoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
      
      // Tanár eltávolítása a tárgyból
      app.delete('/subjects/removeteacher/:subjectId/:teacherId', async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const teacherRepository = getRepository(Teacher);
        try {
          // Tanár keresése azonosító alapján
          const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });
      
          if (!teacher) {
            return res.status(404).json({ error: 'Tanár nem található' });
          }
      
          // Tárgy keresése azonosító alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["teachers"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tárgy nem található' });
          }
      
          // Ellenőrzés, hogy a tanár már hozzá van-e adva a tárgyhoz
          const teacherIndex = subject.teachers.findIndex((t) => t.id === teacher.id);
          if (teacherIndex === -1) {
            return res.status(404).json({ error: 'A tanár nincs társítva a tárgyhoz' });
          }
      
          // Tanár eltávolítása a tárgyból
          subject.teachers.splice(teacherIndex, 1);
      
          // Tárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikerüzenet visszaküldése
          return res.status(200).json({ message: 'Tanár eltávolítva a tárgyból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
    
    app.listen(3000, () => {
        console.log("A szerver fut a 3000-es porton");
    });

}).catch(error => console.log(error));
