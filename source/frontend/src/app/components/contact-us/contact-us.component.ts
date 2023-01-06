import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {FormlyFormsService} from "../../services/formly-forms.service";
import {Contact} from "../../models/common/contact";
import {Message} from "../../models/common/message";
import {ContactFormData} from "../../models/common/contact-form-data";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  form : FormGroup
  fields: FormlyFieldConfig[]
  data: ContactFormData;
  options: FormlyFormOptions

  constructor(private formlyFormsService: FormlyFormsService) {
    this.form = new FormGroup({});
    this.data = {}
    this.options = {}
    this.fields = [{
      fieldGroupClassName: 'contact-us-form-group',
      fieldGroup: [{type: '#firstname'}, {type: '#lastname'}]
    },{
      fieldGroupClassName: 'contact-us-form-group',
      fieldGroup: [{type: '#firstname'}, {type: '#lastname'}]
    }]
  }

  onSubmit(data: ContactFormData) {
    console.log('Message will be sent with data: ')
    console.dir(data)
  }
}
