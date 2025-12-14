import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  private studentService = inject(StudentService);

  // Signal for the list of students
  students = signal<Student[]>([]);

  // Signal for the form object (Single Student)
  student = signal<Student>({ id: 0, name: '', class: '', section: '' });

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => this.students.set(data),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  // --- Setters for ngModelChange ---
  
  setName(name: string) {
    this.student.update(s => ({ ...s, name }));
  }

  setClass(className: string) {
    this.student.update(s => ({ ...s, class: className }));
  }

  setSection(section: string) {
    this.student.update(s => ({ ...s, section }));
  }

  // --- CRUD Operations ---

  save() {
    const currentStudent = this.student();

    // Basic Validation
    if (!currentStudent.name || !currentStudent.class) {
      alert('Name and Class are required');
      return;
    }

    if (currentStudent.id === 0) {
      // Create New
      // Remove ID 0 before sending if backend generates it, or send as is
      this.studentService.create(currentStudent).subscribe(saved => {
        this.students.update(list => [...list, saved]);
        this.resetForm();
      });
    } else {
      // Update Existing
      this.studentService.update(currentStudent.id, currentStudent).subscribe(updated => {
        this.students.update(list => 
          list.map(s => s.id === updated.id ? updated : s)
        );
        this.resetForm();
      });
    }
  }

  edit(s: Student) {
    // Clone the object to avoid modifying the table directly while typing
    this.student.set({ ...s });
  }

  delete(id: number) {
    if (confirm('Are you sure?')) {
      this.studentService.delete(id).subscribe(() => {
        this.students.update(list => list.filter(s => s.id !== id));
        // If we deleted the student currently being edited, reset the form
        if (this.student().id === id) {
          this.resetForm();
        }
      });
    }
  }

  resetForm() {
    this.student.set({ id: 0, name: '', class: '', section: '' });
  }
}