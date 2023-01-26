import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-project-important-information',
  templateUrl: './project-important-information.component.html',
  styleUrls: ['./project-important-information.component.scss']
})
export class ProjectImportantInformationComponent implements OnInit{

  @Input() slug?: string
  @Output() informationLoaded: EventEmitter<void> = new EventEmitter<void>()

  ngOnInit() {
    this.informationLoaded.emit()
  }

}
