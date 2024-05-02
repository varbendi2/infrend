import { Component, OnInit } from '@angular/core';
import { Subject } from '../model/subject.model';
import { SubjectService } from '../services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']    
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];                 // A tantárgyak tömbje
  selectedSubject?: Subject;                 // Kiválasztott tantárgy
  newSubject: Subject = new Subject({       // Az új tantárgy, inicializálása üres tantárgyként
    id: 0,
    name: '',
    teachers: [],
    courses: []
  });

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.getSubjects();                     // Tantárgyak betöltése komponens inicializáláskor
  }

  // Tantárgyak lekérése a szervízből
  getSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects.map(s => new Subject(s));
    });
  }

  // Egy tantárgy lekérése az azonosítója alapján
  getSubject(subjectId: number): void {
    this.subjectService.getSubject(subjectId).subscribe(subject => {
      this.selectedSubject = subject;
    });
  }

  // Új tantárgy létrehozása
  createSubject(): void {
    if (this.newSubject.name) {
      this.subjectService.createSubject(this.newSubject).subscribe(subject => {
        this.subjects.push(new Subject(subject));
        this.newSubject = new Subject({
          id: 0,
          name: '',
          teachers: [],
          courses: []
        });
      });
    }
  }

  // Tantárgy adatainak frissítése
  updateSubject(subjectId: number): void {
    if (this.selectedSubject && this.selectedSubject.id) {
      this.subjectService
        .updateSubject(this.selectedSubject.id, this.selectedSubject)
        .subscribe(subject => {
          const index = this.subjects.findIndex(s => s.id === subject.id);
          if (index !== -1) {
            this.subjects[index] = new Subject(subject);
          }
        });
    }
  }

  // Tantárgy törlése
  deleteSubject(subjectId: number): void {
    this.subjectService.deleteSubject(subjectId).subscribe(() => {
      this.subjects = this.subjects.filter(s => s.id !== subjectId);
      this.selectedSubject = undefined;
    });
  }

  // addTeacherToSubject(subjectId: number, teacherId: number): void {
  //   this.subjectService.addTeacherToSubject(subjectId, teacherId).subscribe(() => {
  //     this.getSubject(subjectId);
  //   });
  // }

  // removeTeacherFromSubject(subjectId: number, teacherId: number): void {
  //   this.subjectService.removeTeacherFromSubject(subjectId, teacherId).subscribe(() => {
  //     this.getSubject(subjectId);
  //   });
  // }

  

 // Kiválasztott tantárgy kiválasztása

 onSelect(subject: Subject): void {
  this.selectedSubject = subject;
}
}
