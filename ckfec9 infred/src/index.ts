import "reflect-metadata";
import express from "express";
import { createConnection, getRepository, MoreThan, LessThan, Between } from "typeorm";
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

    // Endpoint az összes diák lekéréséhez
    app.get("/students", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const students = await studentRepository.find({ relations: ["courses", "grades"] });
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diákok lekérése közben." });
        }
    });

    // Új diák létrehozása
    app.post("/students", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const newStudent = studentRepository.create(req.body); // Feltételezve, hogy a body megfelelő formátumban van
            const results = await studentRepository.save(newStudent);
            res.status(201).json(results);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt az új diák létrehozása közben." });
        }
    });

    // Egy diák lekérése ID alapján
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
            res.status(500).json({ error: "Hiba történt a diák lekérése közben." });
        }
    });

    // Diák frissítése ID alapján
    app.put("/students/:studentId", async (req: Request, res: Response) => {
        try {
            const studentRepository = getRepository(Student);
            const student = await studentRepository.findOne({ 
                where: { id: Number(req.params.studentId) }
            });
    
            if (student) {
                studentRepository.merge(student, req.body); // Összefésüli az új értékeket a req.body-ból a megtalált diákba
                const results = await studentRepository.save(student);
                res.json(results);
            } else {
                res.status(404).json({ error: "Diák nem található" });
            }
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a diák frissítése közben." });
        }
    });

    // Diák törlése ID alapján
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
            res.status(500).json({ error: "Hiba történt a diák törlése közben." });
        }
    });

    // Tanárok lekérése
    app.get("/teachers", async (req: Request, res: Response) => {
        try {
            const teacherRepository = getRepository(Teacher);
            const teachers = await teacherRepository.find({ relations: ["subjects"] });
            res.json(teachers);
        } catch (err) {
            res.status(500).json({ error: "Hiba történt a tanárok lekérése közben." });
        }
    });

    // Tanár létrehozása
    app.post("/teachers", async (req: Request, res: Response) => {
        const teacherRepository = getRepository(Teacher);
        const teacher = teacherRepository.create(req.body); // Új tanár példány létrehozása
        const results = await teacherRepository.save(teacher); // A tanár példány mentése
        res.json(results);
    });

    // Tanár lekérése ID alapján
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

    // Tanár frissítése ID alapján
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

    // Tanár törlése ID alapján
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

    // Tanfolyamok lekérése
    app.get("/courses", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const courses = await courseRepository.find({ relations: ["students","subject"] });
        res.json(courses);
    });

    // Tanfolyam létrehozása
    app.post("/courses", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = courseRepository.create(req.body);
        const results = await courseRepository.save(course);
        res.json(results);
    });  

    // Tanfolyam lekérése ID alapján
    app.get("/courses/:courseId", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students","subject"]
        });
        
    
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: "Tanfolyam nem található" });
        }
    });

    // Tanfolyam frissítése ID alapján
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
            res.status(404).json({ error: "Tanfolyam nem található" });
        }
    });

    // Tanfolyam törlése ID alapján
    app.delete("/courses/:courseId", async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }
        });
        if (course) {
            await courseRepository.remove(course);
            res.json({ message: "Tanfolyam eltávolítva" });
        } else {
            res.status(404).json({ error: "Tanfolyam nem található" });
        }
    });
    
    // Tanfolyam hozzáadása tantárgyhoz
    app.post('/subjects/addcourse/:subjectId/:courseId', async (req: Request, res: Response) => {
        const { subjectId, courseId } = req.params;
      
        const subjectRepository = getRepository(Subject);
        const courseRepository = getRepository(Course);
      
        try {
          // Tantárgy keresése ID alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tantárgy nem található' });
          }
      
          // Tanfolyam keresése ID alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["subject"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Tanfolyam nem található' });
          }
      
          // Hozzáadja a tanfolyamot a tantárgyhoz, ha még nem volt hozzáadva
          const isCourseAdded = subject.courses.some((c) => c.id === course.id);
          if (!isCourseAdded) {
            subject.courses.push(course);
          }
      
          // Tantárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Tanfolyam hozzáadva a tantárgyhoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

    // Tanfolyam eltávolítása tantárgyból
    app.delete('/subjects/removecourse/:subjectId/:courseId', async (req: Request, res: Response) => {
        const { subjectId, courseId } = req.params;
      
        const subjectRepository = getRepository(Subject);
        const courseRepository = getRepository(Course);
      
        try {
          // Tantárgy keresése ID alapján
          const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
      
          if (!subject) {
            return res.status(404).json({ error: 'Tantárgy nem található' });
          }
      
          // Tanfolyam keresése ID alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["subject"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Tanfolyam nem található' });
          }
      
          // Ellenőrzi, hogy a tanfolyam már hozzá van-e adva a tantárgyhoz
          const courseIndex = subject.courses.findIndex((c) => c.id === course.id);
          if (courseIndex === -1) {
            return res.status(404).json({ error: 'A tanfolyam nincs hozzárendelve a tantárgyhoz' });
          }
      
          // Tanfolyam eltávolítása a tantárgyból
          subject.courses.splice(courseIndex, 1);
      
          // Tantárgy mentése az adatbázisba
          await subjectRepository.save(subject);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Tanfolyam eltávolítva a tantárgyból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

    // Diák hozzáadása tanfolyamhoz
    app.post('/courses/addstudent/:courseId/:studentId', async (req: Request, res: Response) => {
        const { courseId, studentId } = req.params;
      
        const courseRepository = getRepository(Course);
        const studentRepository = getRepository(Student);
      
        try {
          // Tanfolyam keresése ID alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Tanfolyam nem található' });
          }
      
          // Diák keresése ID alapján
          const student = await studentRepository.findOne({ 
            where: { id: Number(req.params.studentId) }, 
            relations: ["courses"]
        });
      
          if (!student) {
            return res.status(404).json({ error: 'Diák nem található' });
          }
      
          // Ellenőrzi, hogy a diák már felvette-e a tanfolyamot
          const hasTakenCourse = student.courses.some((c) => c.id === course.id);
          if (hasTakenCourse) {
            return res.status(400).json({ error: 'A diák már felvette a tanfolyamot' });
          }
      
          // Diák hozzáadása a tanfolyamhoz
          course.students.push(student);
      
          // Tanfolyam mentése az adatbázisba
          await courseRepository.save(course);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Diák hozzáadva a tanfolyamhoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
      
    // Diák eltávolítása tanfolyamból
    app.delete('/courses/removestudent/:courseId/:studentId', async (req: Request, res: Response) => {
        const { courseId, studentId } = req.params;
      
        const courseRepository = getRepository(Course);
        const studentRepository = getRepository(Student);
      
        try {
          // Tanfolyam keresése ID alapján
          const course = await courseRepository.findOne({ 
            where: { id: Number(req.params.courseId) }, 
            relations: ["students"]
        });
      
      
          if (!course) {
            return res.status(404).json({ error: 'Tanfolyam nem található' });
          }
      
          // Diák keresése ID alapján
          const student = await studentRepository.findOne({ 
            where: { id: Number(req.params.studentId) }, 
        });
      
      
          if (!student) {
            return res.status(404).json({ error: 'Diák nem található' });
          }
      
          // Ellenőrzi, hogy a diák már hozzá van-e adva a tanfolyamhoz
          const studentIndex = course.students.findIndex((s) => s.id === student.id);
          if (studentIndex === -1) {
            return res.status(404).json({ error: 'A diák nincs beiratkozva a tanfolyamra' });
          }
      
          // Diák eltávolítása a tanfolyamból
          course.students.splice(studentIndex, 1);
      
          // Tanfolyam mentése az adatbázisba
          await courseRepository.save(course);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Diák eltávolítva a tanfolyamból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });
      

    // Tantárgyak lekérése
    app.get("/subjects", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subjects = await subjectRepository.find({ relations: ["courses"] });
        res.json(subjects);
    });

    // Tantárgy létrehozása
    app.post("/subjects", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = subjectRepository.create(req.body);
        const results = await subjectRepository.save(subject);
        res.json(results);
    });

    // Tantárgy lekérése ID alapján
    app.get("/subjects/:subjectId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["courses"]
        });
    
        if (subject) {
            res.json(subject);
        } else {
            res.status(404).json({ error: "Tantárgy nem található" });
        }
    });

    // Tantárgy frissítése ID alapján
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
            res.status(404).json({ error: "Tantárgy nem található" });
        }
    });

    // Tantárgy törlése ID alapján
    app.delete("/subjects/:subjectId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const subject = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }
        });
    
        if (subject) {
            await subjectRepository.remove(subject);
            res.json({ message: "Tantárgy eltávolítva" });
        } else {
            res.status(404).json({ error: "Tantárgy nem található" });
        }
    });

    // Tanár hozzáadása tantárgyhoz
    app.post("/subjects/addteacher/:subjectId/:teacherId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const teacherRepository = getRepository(Teacher);
        try {
          // Tanár keresése ID alapján
          const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });
      
          if (!teacher) {
            return res.status(404).json({ error: 'Tanár nem található' });
          }
      
          // Tantárgy keresése ID alapján
          const course = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["teachers"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Tantárgy nem található' });
          }
      
          // Tanár hozzáadása a tantárgyhoz, ha még nem volt hozzáadva
          if (!course.teachers.includes(teacher)) {
            course.teachers.push(teacher);
          }
      
          // Tantárgy mentése az adatbázisba
          await subjectRepository.save(course);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Tanár hozzáadva a tantárgyhoz' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

    // Tanár eltávolítása tantárgyból
    app.delete("/subjects/removeteacher/:subjectId/:teacherId", async (req: Request, res: Response) => {
        const subjectRepository = getRepository(Subject);
        const teacherRepository = getRepository(Teacher);
        try {
          // Tanár keresése ID alapján
          const teacher = await teacherRepository.findOne({ 
            where: { id: Number(req.params.teacherId) }
        });
      
          if (!teacher) {
            return res.status(404).json({ error: 'Tanár nem található' });
          }
      
          // Tantárgy keresése ID alapján
          const course = await subjectRepository.findOne({ 
            where: { id: Number(req.params.subjectId) }, 
            relations: ["teachers"]
        });
      
          if (!course) {
            return res.status(404).json({ error: 'Tantárgy nem található' });
          }
      
          // Tanár eltávolítása a tantárgyból
          course.teachers = course.teachers.filter((t) => t.id !== teacher.id);
      
          // Tantárgy mentése az adatbázisba
          await subjectRepository.save(course);
      
          // Sikeres válasz visszaadása
          return res.status(200).json({ message: 'Tanár eltávolítva a tantárgyból' });
        } catch (error) {
          // Hiba kezelése
          console.error(error);
          return res.status(500).json({ error: 'Hiba történt' });
        }
      });

    // Érdemjegyek lekérése
    app.get("/grades", async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grades = await gradeRepository.find({ relations: ["student", "course"] });
        res.json(grades);
    });

    // Érdemjegy létrehozása
    app.post("/grades", async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grade = gradeRepository.create(req.body);
        const results = await gradeRepository.save(grade);
        res.json(results);
    });

    // Érdemjegy lekérése ID alapján
    app.get("/grades/:gradeId", async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grade = await gradeRepository.findOne({ 
            where: { id: Number(req.params.gradeId) }, 
            relations: ["student", "course"]
        });
    
        if (grade) {
            res.json(grade);
        } else {
            res.status(404).json({ error: "Érdemjegy nem található" });
        }
    });

    // Érdemjegy frissítése ID alapján
    app.put("/grades/:gradeId", async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grade = await gradeRepository.findOne({ 
            where: { id: Number(req.params.gradeId) }
        });
    
        if (grade) {
            gradeRepository.merge(grade, req.body);
            const results = await gradeRepository.save(grade);
            res.json(results);
        } else {
            res.status(404).json({ error: "Érdemjegy nem található" });
        }
    });

    // Érdemjegy törlése ID alapján
    app.delete("/grades/:gradeId", async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grade = await gradeRepository.findOne({ 
            where: { id: Number(req.params.gradeId) }
        });
    
        if (grade) {
            await gradeRepository.remove(grade);
            res.json({ message: "Érdemjegy eltávolítva" });
        } else {
            res.status(404).json({ error: "Érdemjegy nem található" });
        }
    });

    app.listen(3000, () => {
        console.log("A szerver fut a 3000-es porton.");
    });

}).catch(error => console.log(error));
