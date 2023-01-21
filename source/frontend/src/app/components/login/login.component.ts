import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Notify} from "notiflix";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      username: "",
      password: ""
    })
  }

  login() {
    Notify.success("Hello there!")
  }
}
