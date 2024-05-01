import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course.model'; // Importáljuk a Course modellt
import { CourseService } from '../services/course.service'; 
import { StudentService } from '../services/student.service'; 
import { Student } from '../model/student.model'; 

@Component({
  selector: 'app-course',
  templateUrl: './courses.component.html', 
  styleUrls: ['./courses.component.css'] 
})
export class CoursesComponent implements OnInit {
  courses: Course[] = []; // courses tömb a Course objektumok tárolásához
  students: Student[] = []; // students tömb a Student objektumok tárolásához
  selectedCourse?: Course; // selectedCourse a kiválasztott Course objektum tárolásához
  newCourse: Course = new Course({ // newCourse egy új Course objektum tárolásához a létrehozáshoz
    id: 0,
    name: '',
    students: [],
    subject: null
  });

  constructor(private courseService: CourseService, private studentService: StudentService ) {}

  ngOnInit(): void {
    this.getCourses(); // Kurzusok lekérése az összetevő inicializálásakor
    this.getStudents(); // Diákok lekérése az összetevő inicializálásakor
  }

  // Metódus az összes kurzus lekéréséhez
  getCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses.map(c => new Course(c)); // Kapott adatok mappelése Course objektumokra
    });
  }
  
  // Metódus az összes diák lekéréséhez
  getStudents(): void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students.map(s => new Student(s)); // Kapott adatok mappelése Student objektumokra
    });
  }

  // Metódus egy adott kurzus lekéréséhez azonosító alapján
  getCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe(course => {
      this.selectedCourse = course; // Beállítjuk a kiválasztott kurzust
    });
  }

  // Metódus új kurzus létrehozásához
  createCourse(): void {
    if (this.newCourse.name) {
      this.courseService.createCourse(this.newCourse).subscribe(course => {
        this.courses.push(new Course(course)); // Új kurzus hozzáadása a courses tömbhöz
        this.newCourse = new Course({ // newCourse objektum resetelése
          id: 0,
          name: '',
          students: [],
          subject: null
        });
      });
    }
  }

  // Metódus meglévő kurzus frissítéséhez
  updateCourse(courseId: number): void {
    if (this.selectedCourse && this.selectedCourse.id) {
      this.courseService.updateCourse(this.selectedCourse.id, this.selectedCourse).subscribe(course => {
        const index = this.courses.findIndex(c => c.id === course.id); // Frissített kurzus indexének megkeresése
        if (index !== -1) {
          this.courses[index] = new Course(course); // Az új kurzus cseréje az indexen
        }
      });
    }
  }

  // Metódus kurzus törléséhez
  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      this.courses = this.courses.filter(c => c.id !== courseId); // Kurzus törlése a courses tömbből
      this.selectedCourse = undefined; // selectedCourse resetelése
    });
  }

  // Metódus diák hozzáadásához egy kurzushoz
  addStudentToCourse(courseId: number, studentId: number): void {
    this.courseService.addStudentToCourse(courseId, studentId).subscribe(() => {
      this.getCourse(courseId); // Kiválasztott kurzus frissítése diák hozzáadása után
    });
  }

  // Metódus diák eltávolításához egy kurzusból
  removeStudentFromCourse(courseId: number, studentId: number): void {
    this.courseService.removeStudentFromCourse(courseId, studentId).subscribe(() => {
      this.getCourse(courseId); // Kiválasztott kurzus frissítése diák eltávolítása után
    });
  }

  // Metódus egy kurzus kiválasztásának kezelésére
  onSelect(course: Course): void {
    this.selectedCourse = course; // Kiválasztott kurzus beállítása
  }
}