import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Charity, Root } from '../Charity';
import { CharityService } from '../charity.service';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css']
})
export class PagingComponent implements OnInit {

  @Input() page: number;

  @Output() newPage = new EventEmitter();

  constructor(private data: CharityService, private route: ActivatedRoute) { }

  previousPage(){
    if(this.page > 1){
      this.newPage.emit(this.page - 1);
    }
  }

  nextPage(){
    this.newPage.emit(this.page + 1);
  }

  ngOnInit(): void {

  }

}
