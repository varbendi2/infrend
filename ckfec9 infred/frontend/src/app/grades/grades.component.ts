import { Component, OnInit } from '@angular/core';
import { GradeCreationObject, GradeService } from '../services/grade.service'; 
import { Grade } from '../model/grade.model'; 
import { Student } from '../model/student.model'; 
import { Subject } from '../model/subject.model'; 
import { Course } from '../model/course.model'; 
import { CourseService } from '../services/course.service'; 
import { StudentService } from '../services/student.service'; 
import { SubjectService } from '../services/subject.service'; 

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html', 
  styleUrls: ['./grades.component.css'] 
})
export class GradesComponent implements OnInit {
  grades: Grade[] = []; // Osztályzatok tömbje
  students: Student[] = []; // Tanulók tömbje
  courses: Course[] = []; // Kurzusok tömbje
  subjects: Subject[] = []; // Tantárgyak tömbje
  newGrade = { // Új osztályzat objektum
    grade: null,
    student: { id: null },
    course: { id: null },
    subject: { id: null },
  };

  courseIdInput: number | null = null; // Kurzus azonosítója bemeneti mezőből
  averageGradeByCourse: number | null = null; // Átlagos osztályzat a kurzusonként

  studentIdInput: number | null = null; // Tanuló azonosítója bemeneti mezőből
  averageGradeByStudent: number | null = null; // Átlagos osztályzat a tanulónként

  constructor(
    private gradeService: GradeService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.getGrades(); // Osztályzatok lekérése
    this.getStudents(); // Tanulók lekérése
    this.getCourses(); // Kurzusok lekérése
    this.getSubjects(); // Tantárgyak lekérése
  }

  getGrades(): void {
    this.gradeService.getGrades().subscribe(
      data => {
        this.grades = data; // Osztályzatok tömbjének frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe(
      data => {
        this.students = data; // Tanulók tömbjének frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }

  getSubjects(): void {
    this.subjectService.getSubjects().subscribe(
      data => {
        this.subjects = data; // Tantárgyak tömbjének frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }
  
  getCourses(): void {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data; // Kurzusok tömbjének frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }

  createGrade() {
    // Ellenőrzés, hogy minden mező ki legyen töltve
    if (this.newGrade.student.id === null || this.newGrade.course.id === null || this.newGrade.subject.id === null || this.newGrade.grade === null) {
      console.error('Minden mezőt ki kell tölteni az osztályzat létrehozása előtt');
      return;
    }

    // Új osztályzat létrehozása
    let body: GradeCreationObject = {
      studentId: this.newGrade.student.id,
      courseId: this.newGrade.course.id,
      subjectId: this.newGrade.subject.id,
      gradeValue: this.newGrade.grade,
    };

    // Új osztályzat létrehozása a szerveren keresztül
    this.gradeService.createGrade(body).subscribe(
      () => {
        // Az új osztályzat létrehozása után az újGrade objektum törlése
        this.newGrade = {
          grade: null,
          student: { id: null },
          course: { id: null },
          subject: { id: null },
        };
      },
      (error) => {
        console.log(error); // Hiba kezelése
      }
    );
  }

  // Átlagos osztályzat lekérése kurzusonként
  getAverageGradeByCourse(courseId: number) {
    this.gradeService.getAverageGradeByCourse(courseId).subscribe(
      response => {
        this.averageGradeByCourse = response.average; // Átlagos osztályzat frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }

  // Átlagos osztályzat lekérése tanulónként
  getAverageGradeByStudent(studentId: number) {
    this.gradeService.getAverageGradeByStudent(studentId).subscribe(
      response => {
        this.averageGradeByStudent = response.average; // Átlagos osztályzat frissítése
      },
      error => {
        console.log(error); // Hiba kezelése
      }
    );
  }
}