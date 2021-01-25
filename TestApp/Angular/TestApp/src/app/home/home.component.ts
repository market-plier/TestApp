import {Component, OnInit, ViewChild} from '@angular/core';
import {Person} from '../core/models/person';
import {ApiService} from '../core/services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fileToUpload: File = null;
  people: Person[];
  filterValue: Person = {id:null,name:null,dateOfBirth:null,salary:null,isMarried:null,phone:null};
  columns: string[] = ['id', 'name', 'dateOfBirth', 'salary', 'isMarried', 'phone','delete','update'];
  dataSource: MatTableDataSource<Person>;
  form: FormGroup;
  maxDate: Date = new Date();
  phoneMask = ['+', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  filteredPeople: Person[];
  @ViewChild(MatSort) sort: MatSort;
  editPerson: Person;
  oldPerson: Person;
  editDisabled: boolean;

  constructor(private api: ApiService,
              public datepipe: DatePipe,
              private router: Router
) {
    this.setPersons = this.setPersons.bind(this);
  }

  ngOnInit(): void {
    this.getPersons();
  }
  initForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)]),
      salary: new FormControl('', [Validators.required,
        Validators.min(0)]),
      phone: new FormControl('', [Validators.required,
      Validators.minLength(13)]),
      isMarried: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required)
    });
  }

  private getPersons() {
    this.api.getPersons().subscribe(this.setPersons);
  }

  private setPersons(persons: Person[]) {
    this.people = persons;
    console.log(this.people);
    this.dataSource = new MatTableDataSource<Person>(persons);
    this.dataSource.sort = this.sort;

  }
  handleFileInput(event: any) {
    this.fileToUpload = event.target.files.item(0);
  }
  uploadFile() {
    this.api.postFile(this.fileToUpload).subscribe(data => {
      this.reloadComponent();
    }, error => {
      console.log(error);
    });
  }

  deletePerson(id: any){
    this.api.deletePerson(id).subscribe(data => {
      this.reloadComponent()
    }, error => {
      console.log(error);
    });
  }
  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/people']);
  }

  filterPeople() {
    this.filteredPeople = this.people;
      if(this.filterValue.isMarried) {
        this.filteredPeople = this.people.filter(person => person.isMarried);
      }
      if (!this.filterValue.isMarried) {
        this.filteredPeople = this.people.filter(person => !person.isMarried);
      }
    if (this.filterValue.name != null && this.filterValue.name !== '') {
      console.log(this.filterValue.name)
      this.filteredPeople = this.filteredPeople.filter(person => person.name.includes(this.filterValue.name))
    }
    if (this.filterValue.phone != null && this.filterValue.phone !== '') {
      console.log(this.filterValue.phone)
      this.filteredPeople = this.filteredPeople.filter(person => person.phone.includes(this.filterValue.phone))
    }
    if (this.filterValue.salary != null) {
      console.log(this.filterValue.salary)
      this.filteredPeople = this.filteredPeople.filter(person => person.salary.toString().includes(this.filterValue.salary.toString()))
    }
    if (this.filterValue.dateOfBirth != null) {
      console.log(this.filterValue.dateOfBirth)
      this.filteredPeople = this.filteredPeople.filter(person => this.datepipe.transform(person.dateOfBirth, 'yyyy/MM/dd') == this.datepipe.transform(this.filterValue.dateOfBirth, 'yyyy/MM/dd') )
    }
    if (this.filterValue.id != null) {
      console.log(this.filterValue.id)
      this.filteredPeople = this.filteredPeople.filter(person => person.id.toString().includes(this.filterValue.id.toString()))
    }
    this.dataSource = new MatTableDataSource(this.filteredPeople);
    this.dataSource.sort = this.sort;
  }

  updatePerson(element: any) {
    this.api.updatePerson(element.id,element).subscribe()
  }
}
