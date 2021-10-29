import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './app-field-error-display.component.html',
  styleUrls: ['./app-field-error-display.component.css']
})
export class AppFieldErrorDisplayComponent implements OnInit {

  @Input() errorMsg?: string;
  @Input() displayError?: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}