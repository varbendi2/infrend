import { Component } from '@angular/core';
import { Student } from '../model/student.model';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html', 
  styleUrls: ['./students.component.css']   
})
export class StudentsComponent {
  students: Student[] = [];                 // A diákok tömbje
  selectedStudent?: Student;                 // Kiválasztott diák
  newStudent: Student = new Student({       // Az új diák, inicializálása üres diákként
    id: 0,
    name: '',
    department: '',
    courses: [],
    grades: []
  });

  constructor(private studentService: StudentService) {
    this.getStudents();                     // Diákok betöltése komponens inicializáláskor
  }

  // Diákok lekérése a szervízből
  getStudents(): void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students.map(s => new Student(s));
    });
  }

  // Kiválasztott diák kiválasztása
  onSelect(student: Student): void {
    this.selectedStudent = new Student(student);
  }

  // Új diák létrehozása
  createStudent(): void {
    this.studentService.createStudent(this.newStudent).subscribe(student => {
      this.students.push(new Student(student));
      this.newStudent = new Student({
        id: 0,
        name: '',
        department: '',
        courses: [],
        grades: []
      });
    });
  }

  // Diák adatainak frissítése
  updateStudent(): void {
    if (this.selectedStudent && this.selectedStudent.id) {
      this.studentService.updateStudent(this.selectedStudent.id, this.selectedStudent).subscribe(student => {
        const idx = this.students.findIndex(s => s.id === this.selectedStudent?.id);
        if (idx !== -1) {
          this.students[idx] = new Student(student);
        }
      });
    }
  }

  // Diák törlése
  deleteStudent(): void {
    if (this.selectedStudent && this.selectedStudent.id) {
      this.studentService.deleteStudent(this.selectedStudent.id).subscribe(() => {
        this.students = this.students.filter(s => s.id !== this.selectedStudent?.id);
        this.selectedStudent = undefined;
      });
    }
  }
}
