import { Component, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Task } from "../model/task.model"
import { CheckboxModule } from "primeng/checkbox";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss'
})
export class MainTableComponent implements OnInit {

  displayUserMap = new Map<number, string>([
    [1, "admin"],
    [2, "user"]
  ]);
  displayData : Task[] = [];
  adding = false;
  editting = false;
  modalForm: FormGroup;

  constructor(private http: HttpClient) {
    this.modalForm = new FormGroup({
      'userId': new FormControl('', Validators.required),
      'id': new FormControl('', Validators.required),
      'title': new FormControl('', Validators.required),
      'completed': new FormControl(false, Validators.required),
    });
  }

  ngOnInit() {
    this.http.get<Task[]>("https://jsonplaceholder.typicode.com/todos").subscribe( (result: Task[]) => {
      //Standard HTTP call to get the data when application is loaded.
      // This is usually done in a service and is loaded into store, but there is no complicated data management and displayData can be our only source of truth
      if(result.length != 0) { this.displayData = [...result]; }
    });
  }

  public showAddItemDialog(): void {
    this.modalForm.controls['userId'].setValue(2);
    this.modalForm.controls['id'].setValue(-1);
    this.modalForm.controls['title'].setValue('Enter a new task');
    this.modalForm.controls['completed'].setValue(false);
    this.adding = true;
  }

  public showEditItemDialog(item: Task): void {
    this.modalForm.controls['userId'].setValue(item.userId);
    this.modalForm.controls['id'].setValue(item.id);
    this.modalForm.controls['id'].disable();
    this.modalForm.controls['title'].setValue(item.title);
    this.modalForm.controls['completed'].setValue(item.completed);
    this.editting = true;
  }

  public deleteItem(id: number) {
    let toDelete = this.displayData.findIndex( t => t.id === id );
    this.displayData.splice(toDelete, 1);
  }

  public getUserRole(role: number): string {
    //Mapping user role number to text
    return this.displayUserMap.get(role) ?? 'Neznámý uživatel';
  }

  public onSubmit(): void {
    let task: Task = {
      userId: this.modalForm.controls['userId'].value,
      id: this.modalForm.controls['id'].value,
      title: this.modalForm.controls['title'].value,
      completed: this.modalForm.controls['completed'].value
    }
    console.info(task);

    if( task?.id < 0 ) {
      //generate new id for new task
      let newTaskId = 0;
      this.displayData.forEach( task => { newTaskId = Math.max(task.id, newTaskId); });
      task.id = newTaskId + 1;
      this.displayData.push(task);
    } else {
      //edit existing task
      const taskIndex = this.displayData.findIndex( t => t.id === task.id);
      this.displayData[taskIndex] = task;
    }

    this.adding = false;
    this.editting = false;
    this.modalForm.reset();
  }

}
