import { Component, OnInit } from '@angular/core';
import { Teacher } from '../model/teacher.model';
import { TeacherService } from '../services/teacher.service';
import { SubjectService } from '../services/subject.service';
import { Subject } from '../model/subject.model';

@Component({
  selector: 'app-teacher',
  templateUrl: './teachers.component.html', 
  styleUrls: ['./teachers.component.css']    
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];                 // A tanárok tömbje
  selectedTeacher?: Teacher;                 // Kiválasztott tanár
  subjects: Subject[] = [];                  // A tantárgyak tömbje
  newTeacher: Teacher = new Teacher({       // Az új tanár, inicializálása üres tanárként
    id: 0,
    name: '',
    department: '',
    subjects: []
  });

  constructor(private teacherService: TeacherService, private subjectService: SubjectService) {}

  ngOnInit() {
    this.getTeachers();                     // Tanárok betöltése komponens inicializáláskor
    this.subjectService.getSubjects().subscribe(subjects => {  // Tantárgyak betöltése
      this.subjects = subjects;
    });
  }

  // Tanárok lekérése a szervízből
  getTeachers(): void {
    this.teacherService.getTeachers().subscribe(teachers => {
      this.teachers = teachers.map(s => new Teacher(s));
    });
  }

  // Egy tanár lekérése az azonosítója alapján
  getTeacher(teacherId: number): void {
    this.teacherService.getTeacherById(teacherId)
      .subscribe(teacher => this.selectedTeacher = teacher);
  }

  // Új tanár létrehozása
  createTeacher(): void {
    if (this.newTeacher) {
      this.teacherService.createTeacher(this.newTeacher)
        .subscribe(teacher => {
          this.teachers.push(new Teacher(teacher));
          this.newTeacher = new Teacher({
            id: 0,
            name: '',
            department: '',
            subjects: []
          });
        });
    }
  }

  // Tanár adatainak frissítése
  updateTeacher(teacherId: number): void {
    if (this.selectedTeacher && this.selectedTeacher.id) {
      this.teacherService.updateTeacher(this.selectedTeacher.id, this.selectedTeacher)
        .subscribe((teacher) => {
          // A kiválasztott tanár frissítése a tanárok tömbjében
          const index = this.teachers.findIndex(s => s.id === this.selectedTeacher?.id);
          if (index !== -1) {
            this.teachers[index] = new Teacher(teacher);
          }
        });
    }
  }

  // Tanár törlése
  deleteTeacher(teacherId: number): void {
    this.teacherService.deleteTeacher(teacherId)
      .subscribe(() => {
        // A törölt tanár eltávolítása a tanárok tömbjéből
        this.teachers = this.teachers.filter(teacher => teacher.id !== teacherId);
        this.selectedTeacher = undefined;
      });
  }

  // Tantárgy hozzáadása a tanárhoz
  addSubjectToTeacher(teacherId: number, subjectId: number): void {
    this.teacherService.addSubjectToTeacher(teacherId, subjectId)
      .subscribe(() => {
        // A kiválasztott tanár frissítése
        this.getTeacher(teacherId);
      });
  }

  // Tantárgy eltávolítása a tanártól
  removeSubjectFromTeacher(teacherId: number, subjectId: number): void {
    this.teacherService.removeSubjectFromTeacher(teacherId, subjectId)
      .subscribe(() => {
        // A kiválasztott tanár frissítése
        this.getTeacher(teacherId);
      });
  }

  // Tanár kiválasztása
  onSelect(teacher: Teacher): void {
    this.selectedTeacher = new Teacher(teacher);
  }
  
  // Tanár azonosítójának lekérése
  getTeacherId(teacher: Teacher): number {
    return teacher ? teacher.id : 0;
  }
}