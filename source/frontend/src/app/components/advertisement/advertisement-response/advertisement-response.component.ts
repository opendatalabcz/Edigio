import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {tsCastToAny} from "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util";

@Component({
  selector: 'app-advertisement-response',
  templateUrl: './advertisement-response.component.html',
  styleUrls: ['./advertisement-response.component.scss']
})
export class AdvertisementResponseComponent {
  form: FormGroup = new FormGroup({})

  openListedItemDialog(item: any) {
    console.log(item)
  }
}
