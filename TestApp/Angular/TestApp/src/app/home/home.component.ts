import {Component, OnInit} from '@angular/core';
import {Person} from '../core/models/person';
import {ApiService} from '../core/services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  people: Person[];
  columns: string[] = ['position', 'name', 'date', 'salary', 'isMarried', 'phone'];
  dataSource: Person[];
  form: FormGroup;
  maxDate: Date = new Date();
  phoneMask = ['+', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private api: ApiService) {
    this.setPersons = this.setPersons.bind(this);
  }

  ngOnInit(): void {
    this.getPersons();
    this.initForm();
  }
  initForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)]),
      salary: new FormControl('', [Validators.required,
        Validators.min(0)]),
      phone: new FormControl('', Validators.required),
      isMarried: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required)
    });
  }
  private getPersons() {
    this.api.getPersons().subscribe(this.setPersons);
  }

  private setPersons(persons: Person[]) {
    this.dataSource = persons;
  }

  add() {
    const person:Person = {
      ...this.form.value
    };
    if (this.form.get('isMarried').value === 'True')
    person.isMarried = true;
    if (this.form.get('isMarried').value === 'False')
      person.isMarried = false;
    console.log(person)
    this.api.createPerson(person).subscribe(response => console.log(response),error => console.log(error));
  }
}
